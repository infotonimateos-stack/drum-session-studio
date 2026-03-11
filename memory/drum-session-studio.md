# Drum Session Studio - Proyecto Principal

## Resumen
Plataforma SaaS para servicio de grabación remota de baterías de Toni Mateos.
Web de booking con configurador de 9 pasos, pagos, admin panel, blog bilingüe.

## Repo
- URL: https://github.com/infotonimateos-stack/drum-session-studio
- Local: /Users/tonimateos/drum-session-studio
- Deploy: Netlify (ver `public/_redirects`)

## Tech Stack
- **Frontend:** Vite 5.4 + React 18.3 + TypeScript 5.5 + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Pagos:** Stripe (webhooks) + PayPal + Transferencia bancaria
- **i18n:** i18next (es-ES + en-GB) con URLs SEO localizadas
- **State:** React Query + React Context (CartContext) + React Hook Form + Zod
- **Extras:** html2pdf, jszip, file-saver, Recharts, HuggingFace transformers

## Supabase
- Project ID: xxftvsejuwkgmemciswl
- URL: https://xxftvsejuwkgmemciswl.supabase.co
- 14+ Edge Functions (pagos, email, analytics, facturas, VIES)
- 10+ migraciones SQL

## Estructura principal
```
src/
  pages/          → Index, AdminPanel, Success, Blog, Legal
  components/
    steps/        → 9 pasos del configurador
    tabs/         → About, Studio, Samples, Tutorials, FAQ, Contact
    admin/        → Analytics, Clients, IncompleteOrders
    ui/           → shadcn/ui (~40 componentes)
  contexts/       → CartContext (carrito + perfil advisor)
  hooks/          → useCart, useStepValidation, useLanguagePrefix
  config/         → routes.ts (URLs SEO localizadas)
  i18n/locales/   → es-ES/common.json, en-GB/common.json
  data/           → blogPosts.ts, microphones.ts
  types/          → cart.ts, html2pdf.d.ts
  utils/          → taxCalculation.ts, backgroundRemoval.ts
  integrations/   → supabase/client.ts, supabase/types.ts
supabase/
  functions/      → Edge Functions (14+)
  migrations/     → SQL schemas
docs/             → session-log-*.md
```

## Configurador (9 pasos)
1. DrumKitStep - Selección batería (Modern, New Vintage, Jazz, Pure Vintage)
2. MicrophonesStep - Micrófonos
3. PreampsStep - Previos (API, Neve, DAD)
4. InterfaceStep - Interfaz de audio
5. ProductionStep - Nivel de producción
6. VideoStep - Grabación de vídeo
7. TakesStep - Tomas/retakes
8. DeliveryStep - Entrega (stems, bounces, formatos)
9. ExtrasStep - Extras (mastering, mezcla, etc.)

## Rutas principales
- ES: `/grabacion-baterias-online`, `/baterista-online`, `/estudio-grabacion-baterias`
- EN: `/en/remote-custom-drum-tracks`, `/en/remote-drummer`, `/en/drums-recording-studio`
- Admin: `/gfs-admin-2025`
- Blog: `/blog-grabacion-bateria`, `/blog-grabacion-bateria/:slug`

## Funcionalidades clave
- Cálculo IVA EU con validación VIES (B2B)
- Reglas especiales: Canarias, Ceuta, Melilla = 0% IVA
- Generación facturas PDF
- Tracking analytics (funnel + GA + email open)
- Tema dark/light
- Separación audio con Demucs/HuggingFace
- WhatsApp integration

## Patrones de código
- Componentes funcionales React con hooks
- shadcn/ui para UI (importar de @/components/ui/)
- Alias @/ = src/
- Puerto dev: 8080
- Traducciones: useTranslation('common')
- Rutas: config/routes.ts con localización
