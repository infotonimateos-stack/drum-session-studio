import { Badge } from "@/components/ui/badge";
import { Star, Tv, Music, Volume2, Headphones, Target, TrendingUp, Heart, Users, Dog } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AboutTab = () => {
  const { t } = useTranslation();

  const personalInfo = [
    { icon: Heart, label: t("about.maritalStatus"), value: t("about.married") },
    { icon: Users, label: t("about.children"), value: "2" },
    { icon: Dog, label: t("about.pets"), value: t("about.dogs") }
  ];




  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl space-y-24">

      {/* Hero — minimal */}
      <section className="text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">{t("about.professionalDrummer")}</p>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight">
          TONI MATEOS
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {t("about.tagline")}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium border-border/60">
            <Star className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {t("about.discs")}
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium border-border/60">
            <Tv className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {t("about.tvShows")}
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium border-border/60">
            <Music className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {t("about.songsYear")}
          </Badge>
        </div>
      </section>

      {/* Bio + Photo */}
      <section className="grid md:grid-cols-[280px_1fr] gap-12 items-start">
        <div className="mx-auto md:mx-0">
          <div className="w-64 h-64 rounded-2xl overflow-hidden border border-border/40">
            <img
              src="/lovable-uploads/eb4a1907-6a44-44e7-8d78-faa86b62200e.png"
              alt="Toni Mateos"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 space-y-3">
            {personalInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <item.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">{t("about.myHistory")}</h2>
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            {t("about.historyText")}
          </p>
        </div>
      </section>




      {/* Collaborations */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Live */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Volume2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">{t("about.liveArtists")}</h3>
          </div>
          <div className="rounded-xl overflow-hidden border border-border/40 aspect-video">
            <img
              src="/lovable-uploads/55129f4b-46e1-40c1-998a-89373ed12824.png"
              alt={t("about.liveStageAlt")}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Alejandro Sanz, Miguel Bosé, Juanes, Antonio Orozco, Ana Torroja, Franco de Vita, Pastora Soler, Manuel Carrasco, Sergio Dalma...
          </p>
          <div className="flex items-center gap-3 pt-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-2xl font-black">{t("about.liveArtistsCount")}</span>
            <span className="text-sm text-muted-foreground">{t("about.liveArtistsLabel")}</span>
          </div>
        </div>

        {/* Studio */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Headphones className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">{t("about.studioArtists")}</h3>
          </div>
          <div className="rounded-xl overflow-hidden border border-border/40 aspect-video">
            <img
              src="/lovable-uploads/0651ca59-4628-48cc-934c-517cee1400c6.png"
              alt={t("about.studioAlt")}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Alejandro Sanz, Jarabe de Palo, Raphael, Melendi, Sergio Dalma, Antonio Orozco, Rozalén, Pastora Soler, Marwán...
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-2xl font-black">{t("about.recordedDiscs")}</span>
            <span className="text-sm text-muted-foreground">{t("about.recordedDiscsLabel")}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
