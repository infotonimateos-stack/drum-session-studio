import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Página no encontrada | Toni Mateos</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="text-xl text-muted-foreground">Esta página no existe o ha sido movida.</p>
          <a href="/grabacion-baterias-online" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium">
            Ir a la web
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
