import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Music, Award, Clock } from "lucide-react";

export const AboutTab = () => {
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
            <p className="text-muted-foreground">
              He trabajado con artistas de diversos géneros musicales, desde rock alternativo 
              hasta pop comercial, siempre buscando el sonido perfecto para cada proyecto.
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              <Badge variant="secondary">Rock</Badge>
              <Badge variant="secondary">Pop</Badge>
              <Badge variant="secondary">Indie</Badge>
              <Badge variant="secondary">Alternative</Badge>
              <Badge variant="secondary">Metal</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Experiencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold">+15 años</span>
                <span className="text-muted-foreground">de experiencia profesional</span>
              </div>
              <div className="flex items-center gap-3">
                <Music className="h-4 w-4 text-primary" />
                <span className="font-semibold">+500 canciones</span>
                <span className="text-muted-foreground">grabadas</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-primary" />
                <span className="font-semibold">30K seguidores</span>
                <span className="text-muted-foreground">en redes sociales</span>
              </div>
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