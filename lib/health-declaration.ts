import type { Locale } from "./i18n"

interface HealthDeclarationContent {
  title: string
  paragraphs: string[]
  commitmentsIntro: string
  commitments: string[]
  consent: string
  downloadLabel: string
  openInNewTab: string
  backToForm: string
  pageSubtitle: string
  fileNoteParent: string
  formIntro: string
  formCheckboxLabel: string
  formReadHere: string
  formHide: string
}

const HU: HealthDeclarationContent = {
  title: "Egészségügyi nyilatkozat",
  paragraphs: [
    "A Tireksz Nonprofit Kft. (Szolgáltató) által (KICKOFF Elite Football Camps márkanév alatt) szervezett focitáborba történő jelentkezéssel egyidőben nyilatkozom, hogy a jelentkezésben megadott gyermekem egészséges, sporttevékenység végzésére alkalmas állapotban van, és nincs olyan betegsége, sérülése vagy egészségügyi problémája, amely a focitáborban való részvétel során saját magára, vagy másokra nézve kockázatot jelentene.",
    "Vállalom, hogy a szervezőt haladéktalanul tájékoztatom minden olyan egészségügyi körülményről, amely a táborozás ideje alatt jelentkezik vagy releváns lehet.",
    "Továbbá tudomásul veszem, hogy a gyermekem saját felelősségemre vesz részt a tábor sporttevékenységeiben, és a szervező nem vállal felelősséget olyan egészségügyi problémákért, amelyek a fenti nyilatkozat elmulasztásából vagy annak valótlan tartalmából erednek.",
    "Tudomásul veszem, hogy a Szolgáltatás során sporttevékenység zajlik, amely természetes egészségügyi és egyéb kockázatokkal jár gyermekre nézve, az ilyen eredetű sportsérülésekért Szolgáltatót semmilyen felelősség nem terheli!",
  ],
  commitmentsIntro: "Vállalom, hogy:",
  commitments: [
    "a tábor megkezdése előtt gyermekem egészségi állapotáról valós és pontos tájékoztatást adok,",
    "betegség esetén haladéktalanul értesítem a szervezőket,",
    "szükség esetén gondoskodom gyermekem hazaszállításáról.",
  ],
  consent: "Hozzájárulok, hogy szükség esetén gyermekem sürgősségi egészségügyi ellátásban részesüljön.",
  downloadLabel: "Nyilatkozat letöltése (DOCX)",
  openInNewTab: "Teljes szöveg megnyitása új lapon",
  backToForm: "Tovább a jelentkezésre",
  pageSubtitle: "A futballtáborba való jelentkezés feltétele az alábbi nyilatkozat elfogadása.",
  fileNoteParent:
    "A nyilatkozatot a jelentkezési űrlapon elektronikusan el kell fogadni. A teljes szöveget letöltheted az alábbi linkre kattintva.",
  formIntro: "A táborban való részvétel feltétele. Olvasd el, majd pipáld be, hogy elfogadod.",
  formCheckboxLabel: "Elolvastam és elfogadom az egészségügyi nyilatkozatot gyermekem nevében.",
  formReadHere: "Elolvasom itt",
  formHide: "Elrejtés",
}

const EN: HealthDeclarationContent = {
  title: "Health declaration",
  paragraphs: [
    "By registering for the football camp organised by Tireksz Nonprofit Kft. (Service Provider) under the KICKOFF Elite Football Camps brand, I hereby declare that my child named in the registration is healthy, fit for sports activities, and does not have any illness, injury, or medical condition that would pose a risk to themselves or others during participation in the camp.",
    "I undertake to immediately inform the organiser of any medical circumstance that may arise during the camp or that may become relevant.",
    "I further acknowledge that my child participates in the camp's sports activities at my own responsibility, and the organiser shall not be held liable for any medical issues arising from failure to provide the above declaration or from any false content therein.",
    "I acknowledge that the Service involves sports activities, which carry natural health and other risks for the child; the Service Provider bears no liability for sports injuries of such origin.",
  ],
  commitmentsIntro: "I undertake that:",
  commitments: [
    "I will provide truthful and accurate information about my child's state of health before the start of the camp,",
    "I will notify the organisers immediately in the event of illness,",
    "I will arrange for my child's transport home if necessary.",
  ],
  consent:
    "I consent to my child receiving emergency medical care if necessary.",
  downloadLabel: "Download declaration (DOCX)",
  openInNewTab: "Open full text in new tab",
  backToForm: "Continue to registration",
  pageSubtitle: "Accepting the declaration below is a requirement for registering for the camp.",
  fileNoteParent:
    "You must accept this declaration electronically on the registration form. You can download the full text by clicking the link below.",
  formIntro: "Required for camp participation. Please read it and tick the box to accept.",
  formCheckboxLabel: "I have read and accept the health declaration on behalf of my child.",
  formReadHere: "Read here",
  formHide: "Hide",
}

export function getHealthDeclaration(locale: Locale): HealthDeclarationContent {
  return locale === "en" ? EN : HU
}

// Backwards-compat exports (Hungarian defaults) kept so older imports keep working.
export const HEALTH_DECLARATION_TITLE = HU.title
export const HEALTH_DECLARATION_PARAGRAPHS = HU.paragraphs
export const HEALTH_DECLARATION_COMMITMENTS = HU.commitments
export const HEALTH_DECLARATION_CONSENT = HU.consent
