import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Music, Award, Clock, Drum, Star, Tv, Disc, Users, Heart, Dog, Home, MapPin, Calendar, Check, X, Sparkles, MessageCircle, Zap, Target, Headphones, Volume2, TrendingUp } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const AboutTab = () => {
  // Datos para el gráfico radar de habilidades ajustado
  const skillsData = [
    { skill: 'Groove', A: 95 },
    { skill: 'Sonido', A: 90 },
    { skill: 'Pegada', A: 88 },
    { skill: 'Versatilidad', A: 92 },
    { skill: 'Precisión', A: 94 },
    { skill: 'Creatividad', A: 78 }
  ];

  // Datos para estilos musicales más visual
  const stylesData = [
    { name: 'Rock', value: 95, icon: '🎸' },
    { name: 'Pop', value: 92, icon: '🎵' },
    { name: 'Ballad', value: 88, icon: '💕' },
    { name: 'Worship', value: 85, icon: '🙏' },
    { name: 'Funk', value: 90, icon: '🕺' },
    { name: 'Blues', value: 87, icon: '🎷' },
    { name: 'Heavy', value: 80, icon: '⚡' },
    { name: 'Jazz', value: 75, icon: '🎺' },
    { name: 'Flamenco', value: 70, icon: '💃' },
    { name: 'Regional', value: 78, icon: '🌍' }
  ];

  const debilidades = ['Metal Progresivo', 'Compases de Amalgama', 'Solos de Batería'];
  const artistasDirecto = ['Alejandro Sanz', 'Juanes', 'Miguel Bosé', 'Antonio Orozco', 'Franco de Vita'];
  const artistasGrabacion = ['Alejandro Sanz', 'Jarabe de Palo', 'John Legend', 'Melendi'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Header con animación */}
      <div className="text-center space-y-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            TONI MATEOS
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Drum className="h-8 w-8 text-primary animate-bounce" />
            <p className="text-2xl font-bold text-muted-foreground">
              Baterista Profesional • Grabaciones Remotas de Alta Calidad
            </p>
            <Drum className="h-8 w-8 text-primary animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      {/* Contadores Principales - Estilo infográfico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-300/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10 text-center text-white">
            <Calendar className="h-16 w-16 mx-auto mb-4 drop-shadow-lg animate-pulse" />
            <div className="text-6xl font-black mb-2 drop-shadow-lg">30</div>
            <div className="text-xl font-bold drop-shadow">Años de Experiencia</div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-green-500 to-emerald-700 border-2 border-green-300/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10 text-center text-white">
            <Disc className="h-16 w-16 mx-auto mb-4 drop-shadow-lg animate-spin" style={{ animationDuration: '3s' }} />
            <div className="text-6xl font-black mb-2 drop-shadow-lg">+1000</div>
            <div className="text-xl font-bold drop-shadow">Discos Grabados</div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-purple-500 to-purple-700 border-2 border-purple-300/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10 text-center text-white">
            <Music className="h-16 w-16 mx-auto mb-4 drop-shadow-lg animate-bounce" />
            <div className="text-6xl font-black mb-2 drop-shadow-lg">+800</div>
            <div className="text-xl font-bold drop-shadow">Canciones/Año</div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-orange-500 to-red-600 border-2 border-orange-300/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10 text-center text-white">
            <Tv className="h-16 w-16 mx-auto mb-4 drop-shadow-lg animate-pulse" />
            <div className="text-6xl font-black mb-2 drop-shadow-lg">+500</div>
            <div className="text-xl font-bold drop-shadow">Shows TV "La Voz"</div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        </div>
      </div>

      {/* Ficha Técnica - DNI Estilo */}
      <Card className="bg-gradient-to-br from-card via-muted/50 to-card border-4 border-primary/30 shadow-2xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 text-center">
              <div className="relative inline-block">
                <img 
                  src="/lovable-uploads/14fbb514-5136-49fb-b57c-0c478aad347d.png" 
                  alt="Toni Mateos" 
                  className="w-56 h-56 object-cover rounded-2xl border-6 border-primary/50 shadow-2xl transform hover:scale-105 transition-all duration-300"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                  <Drum className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-4xl font-black text-primary mb-8 text-center md:text-left">FICHA TÉCNICA DEL ARTISTA</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: User, label: "Nombre", value: "Toni Mateos" },
                  { icon: MapPin, label: "Nacimiento", value: "Barcelona, España" },
                  { icon: Home, label: "Estudio", value: "Cardedeu, Barcelona" },
                  { icon: Heart, label: "Estado Civil", value: "Casado" },
                  { icon: Users, label: "Hijos", value: "2" },
                  { icon: Dog, label: "Perros", value: "3" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <item.icon className="h-6 w-6 text-primary" />
                    <div>
                      <span className="font-bold text-primary">{item.label}:</span>
                      <span className="ml-2 font-semibold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habilidades como Baterista - Radar Chart */}
      <Card className="bg-gradient-to-br from-accent/10 via-card to-primary/10 border-2 border-accent/30 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl font-black">
            <Award className="h-8 w-8 text-primary animate-pulse" />
            MIS HABILIDADES COMO BATERISTA
            <Award className="h-8 w-8 text-primary animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
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
        </CardContent>
      </Card>

      {/* Estilos Musicales - Nueva visualización */}
      <Card className="bg-gradient-to-br from-card to-muted/50 border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl font-black">
            <Music className="h-8 w-8 text-primary animate-bounce" />
            VERSATILIDAD EN ESTILOS MUSICALES
            <Music className="h-8 w-8 text-primary animate-bounce" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stylesData.map((style, index) => (
              <div key={style.name} className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-2">{style.icon}</div>
                <div className="font-bold text-lg mb-2">{style.name}</div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${style.value}%` }}
                  ></div>
                </div>
                <div className="text-sm font-bold text-primary">{style.value}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Artistas - Diseño mejorado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-black text-green-700">
              <Volume2 className="h-8 w-8 animate-pulse" />
              ARTISTAS EN DIRECTO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {artistasDirecto.map((artista, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-lg text-green-800">{artista}</span>
                </div>
              ))}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-2xl border-2 border-green-600/50 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-700" />
                <div className="text-2xl font-black text-green-800">+2000</div>
                <div className="text-sm font-bold text-green-700">BANDAS Y ARTISTAS MÁS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-500/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-black text-blue-700">
              <Headphones className="h-8 w-8 animate-pulse" />
              ARTISTAS EN GRABACIONES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {artistasGrabacion.map((artista, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-lg text-blue-800">{artista}</span>
                </div>
              ))}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl border-2 border-blue-600/50 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-700" />
                <div className="text-2xl font-black text-blue-800">+CIENTOS</div>
                <div className="text-sm font-bold text-blue-700">DE ARTISTAS MÁS</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fortalezas y Debilidades - Diseño diferenciado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-400/20 via-amber-300/20 to-orange-400/20 border-4 border-yellow-500/50 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-black text-yellow-700">
              <Award className="h-10 w-10 text-yellow-600 animate-bounce" />
              MIS FORTALEZAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'Comunicativo', emoji: '💬' },
                { text: 'Respondo Rápido', emoji: '⚡' },
                { text: 'Al Servicio de la Música', emoji: '🎵' }
              ].map((fortaleza, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-yellow-400/40 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-2xl">{fortaleza.emoji}</div>
                  </div>
                  <span className="font-black text-lg text-yellow-800">{fortaleza.text}</span>
                  <div className="ml-auto">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-400/20 via-gray-300/20 to-zinc-400/20 border-4 border-slate-500/50 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-black text-foreground">
              <Target className="h-10 w-10 text-slate-600 animate-pulse" />
              ÁREAS DE MEJORA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'Metal Progresivo', emoji: '🤘' },
                { text: 'Compases de Amalgama', emoji: '🔢' },
                { text: 'Solos de Batería', emoji: '🥁' }
              ].map((debilidad, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-slate-400/40 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-2xl">{debilidad.emoji}</div>
                  </div>
                  <span className="font-black text-lg text-slate-800">{debilidad.text}</span>
                  <div className="ml-auto">
                    <Clock className="h-8 w-8 text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};