import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Music, Award, Clock, Drum, Star, Tv, Disc, Users, Heart, Dog, Home, MapPin, Calendar, Check, X, Sparkles, MessageCircle, Zap } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const AboutTab = () => {
  // Datos para el gráfico radar de habilidades ajustado
  const skillsData = [
    { skill: 'Groove', A: 95 },
    { skill: 'Sonido', A: 90 },
    { skill: 'Pegada', A: 88 },
    { skill: 'Versatilidad', A: 92 },
    { skill: 'Precisión', A: 92 },
    { skill: 'Creatividad', A: 82 }
  ];

  // Datos para estilos musicales como barras
  const stylesData = [
    { style: 'Rock', level: 95 },
    { style: 'Pop', level: 92 },
    { style: 'Ballad', level: 88 },
    { style: 'Worship', level: 85 },
    { style: 'Funk', level: 90 },
    { style: 'Blues', level: 87 },
    { style: 'Heavy', level: 80 },
    { style: 'Jazz', level: 75 },
    { style: 'Flamenco', level: 70 },
    { style: 'Regional', level: 78 }
  ];

  const fortalezas = ['Comunicativo', 'Respondo Rápido', 'Al Servicio de la Música'];
  const debilidades = ['Metal Progresivo', 'Compases de Amalgama', 'Solos de Batería'];

  const artistasDirecto = ['Alejandro Sanz', 'Juanes', 'Miguel Bosé', 'Antonio Orozco', 'Franco de Vita'];
  const artistasGrabacion = ['Alejandro Sanz', 'Jarabe de Palo', 'John Legend', 'Melendi'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Toni Mateos
        </h2>
        <p className="text-xl text-muted-foreground">
          Baterista Profesional • Grabaciones Remotas de Alta Calidad
        </p>
      </div>

      {/* DNI Falso / Ficha Técnica */}
      <Card className="bg-gradient-to-br from-card to-muted border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <img 
                src="/lovable-uploads/14fbb514-5136-49fb-b57c-0c478aad347d.png" 
                alt="Toni Mateos" 
                className="w-48 h-48 object-cover rounded-lg mx-auto border-4 border-primary/30"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-primary mb-6">Ficha Técnica del Artista</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Nombre:</span> Toni Mateos
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Nacimiento:</span> Barcelona, España
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Estudio:</span> Cardedeu, Barcelona
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Estado Civil:</span> Casado
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Hijos:</span> 2
                </div>
                <div className="flex items-center gap-2">
                  <Dog className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Perros:</span> 3
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contadores Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-3xl font-bold text-blue-500">30</h3>
            <p className="text-sm text-muted-foreground">Años de Experiencia</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Disc className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-3xl font-bold text-green-500">+1000</h3>
            <p className="text-sm text-muted-foreground">Discos Grabados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Music className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="text-3xl font-bold text-purple-500">+800</h3>
            <p className="text-sm text-muted-foreground">Canciones/Año</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Tv className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-3xl font-bold text-orange-500">+500</h3>
            <p className="text-sm text-muted-foreground">Shows TV "La Voz"</p>
          </CardContent>
        </Card>
      </div>

      {/* Habilidades como Baterista */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Mis Habilidades como Baterista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid stroke="hsl(var(--muted-foreground))" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={0} 
                  domain={[0, 100]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="Habilidades"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Estilos Musicales - Barras de Progreso */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Versatilidad en Estilos Musicales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stylesData.map((style, index) => (
            <div key={style.style} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{style.style}</span>
                <span className="text-muted-foreground">{style.level}%</span>
              </div>
              <Progress value={style.level} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Artistas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Artistas en Directo */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Artistas en Directo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {artistasDirecto.map((artista, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{artista}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Artistas Grabaciones */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Disc className="h-5 w-5 text-primary" />
              Artistas en Grabaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {artistasGrabacion.map((artista, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{artista}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fortalezas y Debilidades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fortalezas */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Sparkles className="h-5 w-5" />
              Mis Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: MessageCircle, text: 'Comunicativo' },
                { icon: Zap, text: 'Respondo Rápido' },
                { icon: Heart, text: 'Al Servicio de la Música' }
              ].map((fortaleza, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                  <fortaleza.icon className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700">{fortaleza.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debilidades */}
        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Áreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {debilidades.map((debilidad, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-700">{debilidad}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};