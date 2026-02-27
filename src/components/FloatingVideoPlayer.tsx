import { useState, useEffect, useRef } from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingVideoPlayerProps {
  videoId: string;
  visible: boolean;
  onClose: () => void;
}

export const FloatingVideoPlayer = ({ videoId, visible, onClose }: FloatingVideoPlayerProps) => {
  const [minimized, setMinimized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position when becoming visible
  useEffect(() => {
    if (visible) {
      setPosition({ x: 0, y: 0 });
      setMinimized(false);
    }
  }, [visible]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: position.x, origY: position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
  };

  const handlePointerUp = () => {
    setDragging(false);
    dragRef.current = null;
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden",
        "ring-1 ring-white/15 bg-[hsl(220,20%,8%)]",
        minimized ? "w-48 h-12 bottom-6 right-6" : "w-[340px] sm:w-[400px] bottom-6 right-6",
        dragging && "cursor-grabbing"
      )}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-primary/20 to-accent/20 cursor-grab select-none">
        <span className="text-xs font-semibold text-white/80 truncate">
          🎥 Tutorial
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5 text-white/70" /> : <Minimize2 className="w-3.5 h-3.5 text-white/70" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Video */}
      {!minimized && (
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Tutorial de configuración"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};
