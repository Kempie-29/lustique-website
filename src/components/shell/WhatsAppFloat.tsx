import { MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/content/site";

/** Persistent WhatsApp button. Hidden from print and reduced-motion noise. */
export function WhatsAppFloat() {
  return (
    <a
      className="btn-whatsapp-float"
      href={whatsappLink(`Hi ${site.name}, I'd love to chat about my date.`)}
      target="_blank"
      rel="noopener"
      aria-label={`Message ${site.name} on WhatsApp`}
    >
      <MessageCircle size={24} aria-hidden="true" />
    </a>
  );
}