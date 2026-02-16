import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageLayout } from "@/components/LanguageLayout";
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

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Spanish routes (default, no prefix) */}
    <Route element={<LanguageLayout lang="es-ES" />}>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route path="/aviso-legal" element={<AvisoLegal />} />
      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/politica-cookies" element={<PoliticaCookies />} />
      <Route path="/ampliar-pedido" element={<AmpliarPedido />} />
      <Route path="/gfs-admin-2025" element={<AdminPanel />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
    </Route>

    {/* English routes (/en prefix) */}
    <Route path="/en" element={<LanguageLayout lang="en-GB" />}>
      <Route index element={<Index />} />
      <Route path="success" element={<Success />} />
      <Route path="aviso-legal" element={<AvisoLegal />} />
      <Route path="politica-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="politica-cookies" element={<PoliticaCookies />} />
      <Route path="ampliar-pedido" element={<AmpliarPedido />} />
      <Route path="gfs-admin-2025" element={<AdminPanel />} />
      <Route path="blog" element={<BlogIndex />} />
      <Route path="blog/:slug" element={<BlogPost />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
