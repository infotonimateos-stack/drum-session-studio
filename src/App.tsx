import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageLayout } from "@/components/LanguageLayout";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import { getAllMainPaths } from "@/config/routes";

// Lazy-loaded pages (code splitting)
const Success = lazy(() => import("./pages/Success"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const PoliticaPrivacidad = lazy(() => import("./pages/PoliticaPrivacidad"));
const PoliticaCookies = lazy(() => import("./pages/PoliticaCookies"));
const AmpliarPedido = lazy(() => import("./pages/AmpliarPedido"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const esMainPaths = getAllMainPaths("es-ES");
  const enMainPaths = getAllMainPaths("en-GB");

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
    </Suspense>
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
