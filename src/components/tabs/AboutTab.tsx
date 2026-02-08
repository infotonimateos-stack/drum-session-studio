import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Music, Award, Clock, Drum, Star, Tv, Disc, Users, Heart, Dog, Home, MapPin, Calendar, Check, Target, Headphones, Volume2, TrendingUp, Zap, Mic, Trophy, MessageCircle, PlayCircle, Palette, Briefcase } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import alejandroSanzImg from '@/assets/alejandro-sanz.jpg';
import juanesImg from '@/assets/juanes.jpg';
import miguelBoseImg from '@/assets/miguel-bose.jpg';
import antonioOrozcoImg from '@/assets/antonio-orozco.jpg';
import johnLegendImg from '@/assets/john-legend.jpg';
import { useTranslation } from "react-i18next";

export const AboutTab = () => {
  const { t } = useTranslation();

  // Datos para el gráfico radar de habilidades
  const skillsData = [
    { skill: t("about.skillGroove"), A: 95 },
    { skill: t("about.skillSound"), A: 93 },
    { skill: t("about.skillPunch"), A: 93 },
    { skill: t("about.skillVersatility"), A: 93 },
    { skill: t("about.skillPrecision"), A: 94 },
    { skill: t("about.skillCreativity"), A: 78 }
  ];

  // Datos para estilos musicales
  const stylesData = [
    { name: 'Rock', value: 95 },
    { name: 'Pop', value: 92 },
    { name: 'Ballad', value: 88 },
    { name: 'Worship', value: 85 },
    { name: 'Funk', value: 90 },
    { name: 'Blues', value: 87 },
    { name: 'Heavy', value: 80 },
    { name: 'Jazz', value: 75 },
    { name: 'Flamenco', value: 70 },
    { name: 'Regional', value: 78 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_hsl(var(--background))_100%)]"></div>
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30">
            <Drum className="h-6 w-6 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("about.professionalDrummer")}</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            TONI<br />MATEOS
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("about.tagline")}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Star className="h-4 w-4 mr-2" />
              {t("about.discs")}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Tv className="h-4 w-4 mr-2" />
              {t("about.tvShows")}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Music className="h-4 w-4 mr-2" />
              {t("about.songsYear")}
            </Badge>
          </div>
        </div>
      </section>

      {/* Perfil Personal */}
      <section className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="relative">
          <div className="w-80 h-80 mx-auto relative overflow-hidden rounded-3xl border-4 border-primary/30 shadow-2xl">
            <img 
              src="/lovable-uploads/eb4a1907-6a44-44e7-8d78-faa86b62200e.png" 
              alt="Toni Mateos"
              className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Toni Mateos</h3>
              <p className="text-lg opacity-90">{t("about.locationBarcelona")}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-black text-primary mb-6">{t("about.myHistory")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t("about.historyText")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Heart, label: t("about.maritalStatus"), value: t("about.married") },
              { icon: Users, label: t("about.children"), value: "2" },
              { icon: Dog, label: t("about.pets"), value: t("about.dogs") },
              { icon: Home, label: t("about.studio"), value: "Cardedeu, BCN" }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-card to-muted/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="font-bold text-lg">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Habilidades Profesionales */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-primary mb-4">{t("about.mySkills")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("about.skillsSubtitle")}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Card className="p-8 bg-gradient-to-br from-accent/10 via-card to-primary/10 border-2 border-accent/30">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="hsl(var(--primary))" strokeWidth={2} />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 14, fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Radar
                    name={t("about.skills")}
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.4}
                    strokeWidth={4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="space-y-4">
            {skillsData.map((skill, index) => (
              <div key={skill.skill} className="p-4 bg-gradient-to-r from-card to-muted/30 rounded-xl border border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{skill.skill}</span>
                  <span className="text-2xl font-black text-primary">{skill.A}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.A}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colaboraciones */}
      <section className="grid lg:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/20 rounded-full blur-2xl -translate-y-20 translate-x-20"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-green-700">
              <Volume2 className="h-8 w-8" />
              {t("about.liveArtists")}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-green-500/40">
              <img 
                src="/lovable-uploads/55129f4b-46e1-40c1-998a-89373ed12824.png" 
                alt={t("about.liveStageAlt")}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-green-400/40">
              <p className="text-lg font-bold text-green-800 leading-relaxed text-center">
                Alejandro Sanz, Miguel Bosé, Juanes, Antonio Orozco, Ana Torroja, Franco de Vita, Pastora Soler, Manuel Carrasco, Sergio Dalma...
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl border-2 border-green-600/40 text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 text-green-700" />
              <div className="text-3xl font-black text-green-800">{t("about.liveArtistsCount")}</div>
              <div className="text-sm font-bold text-green-700">{t("about.liveArtistsLabel")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-500/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl -translate-y-20 translate-x-20"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-blue-700">
              <Headphones className="h-8 w-8" />
              {t("about.studioArtists")}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-blue-500/40">
              <img 
                src="/lovable-uploads/0651ca59-4628-48cc-934c-517cee1400c6.png" 
                alt={t("about.studioAlt")}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-blue-400/40">
              <p className="text-lg font-bold text-blue-800 leading-relaxed text-center">
                Alejandro Sanz, Jarabe de Palo, Raphael, Melendi, Sergio Dalma, Antonio Orozco, Rozalén, Pastora Soler, Marwán...
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border-2 border-blue-600/40 text-center">
              <Target className="h-10 w-10 mx-auto mb-3 text-blue-700" />
              <div className="text-3xl font-black text-blue-800">{t("about.recordedDiscs")}</div>
              <div className="text-sm font-bold text-blue-700">{t("about.recordedDiscsLabel")}</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};