import { useTranslation } from "react-i18next";

interface HeroVideoDualProps {
  youtubeVideoId: string;
}

export const HeroVideoDual = ({ youtubeVideoId }: HeroVideoDualProps) => {
  const { t } = useTranslation();

  const videoWrapper = "relative w-full rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_20px_60px_-15px_hsl(0,0%,0%/0.7)]";
  const overlay1 = "absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none";
  const overlay2 = "absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,8%/0.3)] via-transparent to-transparent pointer-events-none";

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {/* Promo video */}
      <div>
        <div className={videoWrapper}>
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
          <div className={overlay1} />
          <div className={overlay2} />
        </div>
      </div>

      {/* Tutorial video */}
      <div>
        <div className={videoWrapper}>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
              title={t("config.videoLabelTutorial")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>
          <div className={overlay1} />
          <div className={overlay2} />
        </div>
        <p className="mt-1.5 text-[11px] text-white/35 text-center font-medium">
          {t("config.videoLabelTutorial")}
        </p>
      </div>
    </div>
  );
};
