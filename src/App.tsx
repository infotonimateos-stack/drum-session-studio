import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageLayout } from "@/components/LanguageLayout";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";
import AvisoLegal from "./pages/AvisoLegal";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookies";
import AmpliarPedido from "./pages/AmpliarPedido";
import AdminPanel from "./pages/AdminPanel";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import { getAllMainPaths } from "@/config/routes";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const esMainPaths = getAllMainPaths("es-ES");
  const enMainPaths = getAllMainPaths("en-GB");

  return (
    <Routes>
      {/* Spanish routes (default, no prefix) */}
      <Route element={<LanguageLayout lang="es-ES" />}>
        {/* Redirect root to configure tab */}
        <Route path="/" element={<Navigate to="/grabacion-baterias-online" replace />} />

        {/* Main content pages — all rendered by Index */}
        {esMainPaths.map((path) => (
          <Route key={path} path={`/${path}`} element={<Index />} />
        ))}

        {/* Standalone pages */}
        <Route path="/success" element={<Success />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
        <Route path="/ampliar-pedido" element={<AmpliarPedido />} />
        <Route path="/gfs-admin-2025" element={<AdminPanel />} />
        <Route path="/blog-grabacion-bateria" element={<BlogIndex />} />
        <Route path="/blog-grabacion-bateria/:slug" element={<BlogPost />} />
      </Route>

      {/* English routes (/en prefix) */}
      <Route path="/en" element={<LanguageLayout lang="en-GB" />}>
        {/* Redirect /en to configure tab */}
        <Route index element={<Navigate to="/en/remote-custom-drum-tracks" replace />} />

        {/* Main content pages — all rendered by Index */}
        {enMainPaths.map((path) => (
          <Route key={path} path={path} element={<Index />} />
        ))}

        {/* Standalone pages */}
        <Route path="success" element={<Success />} />
        <Route path="aviso-legal" element={<AvisoLegal />} />
        <Route path="politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="politica-cookies" element={<PoliticaCookies />} />
        <Route path="ampliar-pedido" element={<AmpliarPedido />} />
        <Route path="gfs-admin-2025" element={<AdminPanel />} />
        <Route path="drum-recording-blog" element={<BlogIndex />} />
        <Route path="drum-recording-blog/:slug" element={<BlogPost />} />
      </Route>

      {/* Catch-all: redirect to home silently */}
      <Route path="*" element={<Navigate to="/grabacion-baterias-online" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
