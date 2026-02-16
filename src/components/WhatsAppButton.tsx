import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/34670605604";

export const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 mb-safe"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </a>
  );
};
