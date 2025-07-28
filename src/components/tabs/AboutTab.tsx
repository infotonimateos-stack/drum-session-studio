import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Music, Award, Clock, Drum } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export const AboutTab = () => {
  // Datos para el gráfico de estilos musicales
  const musicalStylesData = [
    { name: 'Rock', value: 25, color: '#e11d48' },
    { name: 'Pop', value: 20, color: '#3b82f6' },
    { name: 'Ballad', value: 15, color: '#8b5cf6' },
    { name: 'Worship', value: 12, color: '#06b6d4' },
    { name: 'Funk', value: 10, color: '#f59e0b' },
    { name: 'Blues', value: 8, color: '#6366f1' },
    { name: 'Heavy', value: 5, color: '#ef4444' },
    { name: 'Jazz', value: 3, color: '#10b981' },
    { name: 'Flamenco', value: 1.5, color: '#f97316' },
    { name: 'Regional', value: 0.5, color: '#84cc16' }
  ];

  // Datos para el gráfico radar de habilidades
  const skillsData = [
    { skill: 'Groove', A: 95 },
    { skill: 'Sonido', A: 90 },
    { skill: 'Pegada', A: 88 },
    { skill: 'Versatilidad', A: 92 },
    { skill: 'Precisión', A: 85 },
    { skill: 'Creatividad', A: 87 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Toni Mateos
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Baterista profesional especializado en grabaciones remotas de alta calidad
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Sobre Mí
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Con más de 30 años de experiencia como baterista de sesión, Toni ha grabado y/o tocado con artistas de la talla de John Legend, Paul Carrack, Juanes, Alejandro Sanz, Joaquín Sabina, Jarabe de Palo, Miguel Ríos, Antonio Orozco, Miguel Bosé, Franco De Vita, Ana Torroja, David Bisbal, Malú, Ana Belén... Es también el batería del TV show La Voz, habiendo acompañado a Alejandro Fernandez, Ricky Martin, Jarabe de Palo... Ha grabado más de 1000 álbumes en los últimos años.
            </p>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardContent className="p-0">
            <img 
              src="/lovable-uploads/14fbb514-5136-49fb-b57c-0c478aad347d.png" 
              alt="Toni Mateos" 
              className="w-full h-full object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      </div>

      {/* Infografías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estilos Musicales */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Estilos Musicales que Domino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={musicalStylesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {musicalStylesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Icono del baterista en el centro */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-background rounded-full p-4 shadow-lg">
                  <Drum className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habilidades del Baterista */}
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
      </div>

      {/* Philosophy */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle>Mi Filosofía</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Creo que cada canción tiene su propia personalidad y merece un tratamiento único. 
            Mi objetivo no es solo tocar la batería, sino convertirme en parte integral de tu música, 
            aportando el groove y la energía que tu proyecto necesita para destacar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};