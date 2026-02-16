import { Heart, Users, Dog, Disc, Tv, Music } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AboutTab = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Disc, value: "+1000", label: t("about.discs").replace("+1000 ", "").replace("+1000 ", "") || "Discos" },
    { icon: Tv, value: "+500", label: t("about.tvShows").replace("+500 ", "").replace("+500 ", "") || "Shows TV" },
    { icon: Music, value: "+800", label: t("about.songsYear").replace("+800 ", "").replace("+800 ", "") || "Canciones/Año" },
  ];

  const personalInfo = [
    { icon: Heart, label: t("about.maritalStatus"), value: t("about.married") },
    { icon: Users, label: t("about.children"), value: "2" },
    { icon: Dog, label: t("about.pets"), value: t("about.dogs") },
  ];

  return (
    <div className="bg-[#0d0d0d] text-[#e5e5e5] -mx-4 sm:-mx-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto py-16 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-5">
          <p
            className="text-xs uppercase tracking-[0.35em] font-medium"
            style={{ color: "#c9a54e" }}
          >
            {t("about.professionalDrummer")}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            {t("about.h1")}
          </h1>
          <p className="text-[#a0a0a0] max-w-lg mx-auto leading-relaxed">
            {t("about.tagline")}
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-10 sm:gap-16 pt-4">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{ borderColor: "#c9a54e" }}
                >
                  <s.icon className="h-4 w-4" style={{ color: "#c9a54e" }} />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-white leading-tight">{s.value}</p>
                  <p className="text-xs text-[#808080]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bio + Photo */}
        <section className="grid md:grid-cols-[300px_1fr] gap-10 items-start">
          <div className="mx-auto md:mx-0">
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/lovable-uploads/eb4a1907-6a44-44e7-8d78-faa86b62200e.png"
                alt={t("about.photoAlt")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-5">
            <h2
              className="text-lg font-bold uppercase tracking-widest"
              style={{ color: "#c9a54e" }}
            >
              {t("about.h2career")}
            </h2>
            <p className="text-[#b0b0b0] leading-relaxed text-[15px]">
              {t("about.historyText")}
            </p>
            <div className="space-y-2.5 pt-2">
              {personalInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 shrink-0" style={{ color: "#c9a54e" }} />
                  <span className="text-[#808080]">{item.label}:</span>
                  <span className="font-medium text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artist Cards */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Live */}
          <div
            className="rounded-lg p-8 space-y-5 text-center"
            style={{ border: "1px solid #c9a54e22", backgroundColor: "#141414" }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#c9a54e" }}
            >
              {t("about.liveArtists")}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              Alejandro Sanz, Miguel Bosé, Juanes, Antonio Orozco, Ana Torroja, Franco de Vita, Pastora Soler, Manuel Carrasco, Sergio Dalma, Raphael, Rosario Flores, La Guardia...
            </p>
            <div className="pt-2">
              <p className="text-4xl font-black text-white">{t("about.liveArtistsCount")}</p>
              <p className="text-sm text-[#808080] mt-1">{t("about.liveArtistsLabel")}</p>
            </div>
          </div>

          {/* Studio */}
          <div
            className="rounded-lg p-8 space-y-5 text-center"
            style={{ border: "1px solid #c9a54e22", backgroundColor: "#141414" }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#c9a54e" }}
            >
              {t("about.studioArtists")}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              Alejandro Sanz, Jarabe de Palo, Raphael, Melendi, Sergio Dalma, Antonio Orozco, Rozalén, Pastora Soler, Marwán, John Legend...
            </p>
            <div className="pt-2">
              <p className="text-4xl font-black text-white">{t("about.recordedDiscs")}</p>
              <p className="text-sm text-[#808080] mt-1">{t("about.recordedDiscsLabel")}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
