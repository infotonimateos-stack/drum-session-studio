import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/34670605604?text=Hola%20Toni!";

export const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showTooltip) return;
    const pulseInterval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 8000);
    return () => clearInterval(pulseInterval);
  }, [showTooltip]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 sm:bottom-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))]">
      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`bg-[#1a1a1a] text-white text-sm font-sans px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap transition-all duration-300 animate-fade-in ${
            pulse ? "scale-105" : "scale-100"
          }`}
          style={{ transition: "transform 0.4s ease-in-out" }}
        >
          Hola, ¿cómo puedo ayudarte?
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#1a1a1a] rotate-45" />
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex-shrink-0"
      >
        <MessageCircle className="h-7 w-7 fill-current" />
      </a>
    </div>
  );
};
