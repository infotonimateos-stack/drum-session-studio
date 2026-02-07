import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Legal Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link 
              to="/aviso-legal" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Aviso Legal
            </Link>
            <Separator orientation="vertical" className="h-4 hidden md:block" />
            <Link 
              to="/politica-privacidad" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidad
            </Link>
            <Separator orientation="vertical" className="h-4 hidden md:block" />
            <Link 
              to="/politica-cookies" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Cookies
            </Link>
          </nav>

          {/* Copyright and Contact */}
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p>© {currentYear} Antonio Mateos</p>
            <p className="mt-1">
              <a 
                href="mailto:info@tonimateos.com" 
                className="hover:text-primary transition-colors"
              >
                info@tonimateos.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
