import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Music, Award, Clock, Drum, Star, Tv, Disc, Users, Heart, Dog, Home, MapPin, Calendar, Check, Target, Headphones, Volume2, TrendingUp, Zap, Mic, Trophy, MessageCircle, PlayCircle, Palette, Briefcase } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import alejandroSanzImg from '@/assets/alejandro-sanz.jpg';
import juanesImg from '@/assets/juanes.jpg';
import miguelBoseImg from '@/assets/miguel-bose.jpg';
import antonioOrozcoImg from '@/assets/antonio-orozco.jpg';
import johnLegendImg from '@/assets/john-legend.jpg';

export const AboutTab = () => {
  // Datos para el gráfico radar de habilidades
  const skillsData = [
    { skill: 'Groove', A: 95 },
    { skill: 'Sonido', A: 90 },
    { skill: 'Pegada', A: 88 },
    { skill: 'Versatilidad', A: 92 },
    { skill: 'Precisión', A: 94 },
    { skill: 'Creatividad', A: 78 }
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

  const artistasDirecto = [
    { name: 'Alejandro Sanz', image: alejandroSanzImg },
    { name: 'Juanes', image: juanesImg },
    { name: 'Miguel Bosé', image: miguelBoseImg },
    { name: 'Antonio Orozco', image: antonioOrozcoImg },
    { name: 'Franco de Vita', image: null }
  ];
  const artistasGrabacion = [
    { name: 'Alejandro Sanz', image: alejandroSanzImg },
    { name: 'Jarabe de Palo', image: null },
    { name: 'John Legend', image: johnLegendImg },
    { name: 'Melendi', image: null }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section - Completamente nuevo */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_hsl(var(--background))_100%)]"></div>
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30">
            <Drum className="h-6 w-6 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Baterista Profesional</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            TONI<br />MATEOS
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            30 años creando el ritmo perfecto para tus canciones. Desde Barcelona para el mundo.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Star className="h-4 w-4 mr-2" />
              +1000 Discos
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Tv className="h-4 w-4 mr-2" />
              +500 Shows TV
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Music className="h-4 w-4 mr-2" />
              +800 Canciones/Año
            </Badge>
          </div>
        </div>
      </section>

      {/* Perfil Personal - Rediseño completo */}
      <section className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden rounded-3xl border-4 border-primary/30 shadow-2xl">
            <img 
              src="/lovable-uploads/034fd0a0-541a-4538-93eb-4467b4a6b561.png" 
              alt="Toni Mateos" 
              className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Toni Mateos</h3>
              <p className="text-lg opacity-90">Barcelona, España</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-black text-primary mb-6">Mi Historia</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Con 30 años de experiencia profesional, he tenido el privilegio de trabajar con algunos de los artistas más reconocidos de la música en español. Mi estudio en Cardedeu, Barcelona, se ha convertido en el lugar donde nacen los ritmos que acompañan las emociones de millones de personas.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Heart, label: "Estado Civil", value: "Casado" },
              { icon: Users, label: "Hijos", value: "2" },
              { icon: Dog, label: "Mascotas", value: "3 Perros" },
              { icon: Home, label: "Estudio", value: "Cardedeu, BCN" }
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

      {/* Habilidades Profesionales - Nuevo enfoque */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-primary mb-4">Mis Habilidades</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada beat cuenta una historia. Estas son las habilidades que me permiten dar vida a tu música.
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
                    name="Habilidades"
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


      {/* Colaboraciones - Diseño premium */}
      <section className="grid lg:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/20 rounded-full blur-2xl -translate-y-20 translate-x-20"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-green-700">
              <Volume2 className="h-8 w-8" />
              Artistas en Directo
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-green-500/40">
              <img 
                src="/lovable-uploads/55129f4b-46e1-40c1-998a-89373ed12824.png" 
                alt="Batería en escenario con luces dramáticas" 
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
              <div className="text-3xl font-black text-green-800">+2000</div>
              <div className="text-sm font-bold text-green-700">artistas en directo</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-500/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl -translate-y-20 translate-x-20"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-blue-700">
              <Headphones className="h-8 w-8" />
              Artistas en Estudio
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-blue-500/40">
              <img 
                src="/lovable-uploads/0651ca59-4628-48cc-934c-517cee1400c6.png" 
                alt="Estudio de grabación profesional con batería acústica" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-blue-400/40">
              <p className="text-lg font-bold text-blue-800 leading-relaxed text-center">
                Alejandro Sanz, Jarabe de Palo, Raphael, Melendi, Sergio Dalma, Antonio Orozco, Rozalén, Pastora soler, Marwán,
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border-2 border-blue-600/40 text-center">
              <Target className="h-10 w-10 mx-auto mb-3 text-blue-700" />
              <div className="text-3xl font-black text-blue-800">+100</div>
              <div className="text-sm font-bold text-blue-700">Más colaboraciones</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Fortalezas y Filosofía - Rediseño completo */}
      <section className="grid lg:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-400/20 via-yellow-300/20 to-orange-400/20 border-4 border-amber-500/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.3),_transparent_50%)]"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-amber-700">
              <Trophy className="h-10 w-10" />
              Mis Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {[
              { 
                title: 'Comunicativo', 
                description: 'Entiendo perfectamente lo que necesitas para tu música',
                icon: MessageCircle,
                color: 'text-amber-600'
              },
              { 
                title: 'Respuesta Rápida', 
                description: 'Tiempos de entrega que respetan tus deadlines',
                icon: Zap,
                color: 'text-amber-600'
              },
              { 
                title: 'Al Servicio de la Música', 
                description: 'Cada beat está pensado para realzar tu composición',
                icon: Music,
                color: 'text-amber-600'
              }
            ].map((fortaleza, index) => (
              <div key={index} className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-amber-400/40 hover:border-amber-500/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <fortaleza.icon className={`h-7 w-7 text-white`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-xl text-amber-800 mb-2">{fortaleza.title}</h4>
                    <p className="text-amber-700 leading-relaxed">{fortaleza.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-400/20 via-gray-300/20 to-zinc-400/20 border-4 border-slate-500/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.3),_transparent_50%)]"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-700">
              <Target className="h-10 w-10" />
              Áreas de Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {[
              { 
                title: 'Metal Progresivo', 
                description: 'Explorando nuevas técnicas en géneros complejos',
                icon: Award,
                color: 'text-slate-600'
              },
              { 
                title: 'Compases de Amalgama', 
                description: 'Perfeccionando ritmos no convencionales',
                icon: Clock,
                color: 'text-slate-600'
              },
              { 
                title: 'Solos de Batería', 
                description: 'Desarrollando mi expresión como solista',
                icon: Drum,
                color: 'text-slate-600'
              }
            ].map((area, index) => (
              <div key={index} className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-slate-400/40 hover:border-slate-500/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <area.icon className={`h-7 w-7 text-white`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-xl text-slate-800 mb-2">{area.title}</h4>
                    <p className="text-slate-700 leading-relaxed">{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Call to Action Final */}
      <section className="text-center space-y-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-primary mb-6">¿Listo para crear música juntos?</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Cada proyecto es único, como cada artista. Mi compromiso es encontrar el ritmo perfecto que haga brillar tu música.
          </p>
        </div>
      </section>
    </div>
  );
};