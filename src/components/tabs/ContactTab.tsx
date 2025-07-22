import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Instagram, Youtube, Music } from "lucide-react";

export const ContactTab = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Contacto
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ¿Tienes alguna pregunta? Estoy aquí para ayudarte con tu proyecto musical
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Envía un Mensaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Tu nombre completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input id="subject" placeholder="¿En qué puedo ayudarte?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea 
                id="message" 
                placeholder="Cuéntame sobre tu proyecto musical..."
                className="min-h-[120px]"
              />
            </div>
            <Button variant="upgrade" className="w-full">
              Enviar Mensaje
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info & Social */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="bg-gradient-to-br from-card to-muted">
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">toni@tonimateos.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">+34 XXX XXX XXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Ubicación</p>
                  <p className="text-sm text-muted-foreground">Barcelona, España</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-gradient-to-br from-card to-muted">
            <CardHeader>
              <CardTitle>Sígueme en Redes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Instagram className="h-5 w-5" />
                @tonimateos_drums
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Youtube className="h-5 w-5" />
                Toni Mateos Drums
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Music className="h-5 w-5" />
                Spotify Artist Profile
              </Button>
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-primary">Tiempo de Respuesta</h4>
                <p className="text-sm text-muted-foreground">
                  Respondo a todos los mensajes en menos de 24 horas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};