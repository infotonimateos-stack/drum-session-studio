import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroVideoTabsProps {
  youtubeVideoId: string;
}

export const HeroVideoTabs = ({ youtubeVideoId }: HeroVideoTabsProps) => {
  const [activeTab, setActiveTab] = useState<"promo" | "tutorial">("promo");
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      {/* Tab selector */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setActiveTab("promo")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
            activeTab === "promo"
              ? "bg-primary/90 text-white shadow-[0_2px_12px_-2px_hsl(18,80%,52%/0.5)]"
              : "bg-white/10 text-white/50 hover:bg-white/15 hover:text-white/70"
          )}
        >
          <Play className="w-3 h-3" />
          {t("config.videoTabPromo")}
        </button>
        <button
          onClick={() => setActiveTab("tutorial")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
            activeTab === "tutorial"
              ? "bg-accent/90 text-white shadow-[0_2px_12px_-2px_hsl(28,75%,55%/0.5)]"
              : "bg-white/10 text-white/50 hover:bg-white/15 hover:text-white/70"
          )}
        >
          <GraduationCap className="w-3 h-3" />
          {t("config.videoTabTutorial")}
        </button>
      </div>

      {/* Video container — shared styling */}
      <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_20px_60px_-15px_hsl(0,0%,0%/0.7)]">
        {/* Promo video */}
        <div className={cn("w-full transition-opacity duration-500", activeTab === "promo" ? "block" : "hidden")}>
          <video
            src="/videos/big-drums.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-auto"
            style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          />
        </div>

        {/* Tutorial (YouTube) */}
        <div className={cn("w-full transition-opacity duration-500", activeTab === "tutorial" ? "block" : "hidden")}>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {/* Only load iframe when tab is active to save resources */}
            {activeTab === "tutorial" && (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
                title={t("config.videoTabTutorial")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Shared overlays */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,8%/0.3)] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Label */}
      <p className="mt-2 text-[11px] text-white/35 text-center font-medium">
        {activeTab === "promo" ? t("config.videoLabelPromo") : t("config.videoLabelTutorial")}
      </p>
    </div>
  );
};
