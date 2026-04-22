import {
  Home,
  MapPin,
  Shield,
  Handshake,
  HelpCircle,
  ImageIcon,
  Settings,
  FileText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ContentPageId =
  | "home"
  | "helyszinek"
  | "klubok"
  | "partner"
  | "gyik"
  | "galeria"
  | "altalanos"
  | "jogi"

export type ContentPageMeta = {
  id: ContentPageId
  label: string
  icon: LucideIcon
  sections: string[]
  description?: string
}

/**
 * Registry of editable content “pages” in the admin (text sections + optional images).
 * Lives in a non-client module so Server Components can import it safely.
 */
export const CONTENT_PAGES: ContentPageMeta[] = [
  {
    id: "home",
    label: "Főoldal",
    icon: Home,
    description: "A nyitó oldal összes szekciójának szövegei és képei.",
    sections: ["hero", "whySpecial", "whyDifferent", "usp", "limitedSpots", "whatKidsGet", "targetAudience", "experience"],
  },
  {
    id: "helyszinek",
    label: "Helyszínek & Jelentkezés",
    icon: MapPin,
    description: "A Táborok/Jelentkezés szekciók szövegei (a konkrét táborokat külön menüből szerkeszd).",
    sections: ["locations", "form"],
  },
  {
    id: "klubok",
    label: "Klubok oldal",
    icon: Shield,
    description: "A Klubok aloldal szövegei és képei.",
    sections: ["coaches"],
  },
  {
    id: "partner",
    label: "Partnerprogram oldal",
    icon: Handshake,
    description: "A Partnerprogram aloldal szövegei és képei.",
    sections: ["partnerProgram"],
  },
  {
    id: "gyik",
    label: "GYIK",
    icon: HelpCircle,
    description: "Gyakran ismételt kérdések és válaszok.",
    sections: ["faq"],
  },
  {
    id: "galeria",
    label: "Galéria feliratok",
    icon: ImageIcon,
    description: "A Galéria szekció szövegei (képeket a „Galéria” menüből tölts fel).",
    sections: ["gallery"],
  },
  {
    id: "altalanos",
    label: "Navigáció & lábléc",
    icon: Settings,
    description: "A menüpontok és a lábléc szövegei.",
    sections: ["nav", "footer"],
  },
  {
    id: "jogi",
    label: "Jogi szövegek",
    icon: FileText,
    description: "ÁSZF, Cookie tájékoztató, cookie sáv szövegei.",
    sections: ["aszf", "cookiePolicy", "cookieBanner"],
  },
]
