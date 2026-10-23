/**
 * Vorqualifizierung für das Erstgespräch.
 *
 * Diese Datei wird vom Formular (Browser) UND von der Lead-API (Server) genutzt.
 * Kriterien ändern = nur hier anpassen. `dq: true` beendet den Funnel höflich,
 * ohne dass Kontaktdaten abgefragt werden.
 */

export type Option = { value: string; label: string; hint?: string; dq?: boolean };

export type Question = {
  id: "rechtsform" | "umsatz" | "branche" | "mitarbeiter" | "anlass";
  title: string;
  subtitle?: string;
  multi?: boolean;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: "umsatz",
    title: "Wie hoch ist Ihr Jahresumsatz?",
    subtitle: "Eine grobe Einordnung genügt – Ihre Angaben behandeln wir vertraulich.",
    options: [
      { value: "unter-500k", label: "Unter 500.000 €", dq: true },
      { value: "500k-1m", label: "500.000 € – 1 Mio. €" },
      { value: "1m-2-5m", label: "1 – 2,5 Mio. €" },
      { value: "2-5m-10m", label: "2,5 – 10 Mio. €" },
      { value: "ueber-10m", label: "Über 10 Mio. €" },
    ],
  },
  {
    id: "rechtsform",
    title: "In welcher Rechtsform ist Ihr Unternehmen organisiert?",
    options: [
      { value: "gmbh", label: "GmbH / UG" },
      { value: "holding", label: "Holding- oder Gruppenstruktur" },
      { value: "einzel", label: "Einzelunternehmen / Freiberufler" },
      { value: "gbr-partg", label: "GbR / Partnerschaftsgesellschaft" },
      { value: "gmbh-co-kg", label: "GmbH & Co. KG" },
      { value: "ag", label: "AG / sonstige Kapitalgesellschaft" },
      // Ausschluss laut Kanzlei: KG und OHG (GmbH & Co. KG ist ausdrücklich erlaubt)
      { value: "kg", label: "KG", dq: true },
      { value: "ohg", label: "OHG", dq: true },
    ],
  },
  {
    id: "branche",
    title: "In welcher Branche sind Sie tätig?",
    options: [
      { value: "beratung", label: "Beratung & Dienstleistung" },
      { value: "it-agentur", label: "IT, Software & Agentur" },
      { value: "handel", label: "Handel & E-Commerce" },
      { value: "handwerk-bau", label: "Handwerk & Bau" },
      { value: "industrie", label: "Produktion & Industrie" },
      { value: "gesundheit", label: "Gesundheit & Heilberufe" },
      { value: "immobilien", label: "Immobilien (Bestand & Verwaltung)" },
      { value: "bautraeger", label: "Bauträger & Projektentwicklung" },
      { value: "freie-berufe", label: "Freie Berufe (Ingenieure, Architekten …)" },
      { value: "sonstige", label: "Andere Branche" },
      // Bargeldintensive Betriebe werden nicht betreut
      { value: "gastro-hotel", label: "Gastronomie & Hotellerie", dq: true },
      { value: "gluecksspiel", label: "Glücksspiel & Spielstätten", dq: true },
    ],
  },
  {
    id: "mitarbeiter",
    title: "Wie viele Mitarbeitende beschäftigen Sie?",
    options: [
      { value: "0", label: "Keine" },
      { value: "1-9", label: "1 – 9" },
      { value: "10-49", label: "10 – 49" },
      { value: "50-249", label: "50 – 249" },
      { value: "250+", label: "250 und mehr" },
    ],
  },
  {
    id: "anlass",
    title: "Was stört Sie an Ihrer aktuellen Steuerberatung am meisten?",
    subtitle: "Mehrfachauswahl möglich.",
    multi: true,
    options: [
      { value: "erreichbarkeit", label: "Antworten dauern zu lange" },
      { value: "nicht-proaktiv", label: "Keine proaktiven Gestaltungsvorschläge" },
      { value: "zahlen-zu-spaet", label: "Zahlen kommen zu spät für Entscheidungen" },
      { value: "kein-sparring", label: "Bei Investition, Kauf, Verkauf oder Nachfolge fehlt ein Sparringspartner" },
      { value: "nachzahlungen", label: "Überraschende Steuernachzahlungen" },
      { value: "wechselnde-ap", label: "Wechselnde Ansprechpartner" },
      { value: "nicht-digital", label: "Zusammenarbeit ist nicht digital" },
      { value: "honorar", label: "Honorare sind intransparent" },
      { value: "gewachsen", label: "Wir sind der Kanzlei entwachsen" },
      { value: "kein-stb", label: "Wir haben aktuell keinen Steuerberater" },
    ],
  },
];

export type Answers = Partial<Record<Question["id"], string | string[]>>;

export function isDisqualified(answers: Answers): Option | undefined {
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    const values = Array.isArray(a) ? a : a ? [a] : [];
    const hit = q.options.find((o) => o.dq && values.includes(o.value));
    if (hit) return hit;
  }
  return undefined;
}

export function labelFor(id: Question["id"], value: string | string[] | undefined) {
  const q = QUESTIONS.find((x) => x.id === id);
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.map((v) => q?.options.find((o) => o.value === v)?.label ?? v).join(", ");
}

/**
 * Zielgebiet: München + ca. 150 km. Grobe Prüfung über PLZ-Präfixe
 * (Oberbayern, Niederbayern-West, Schwaben, Oberpfalz-Süd). Kein Ausschluss,
 * sondern ein Merkmal im Lead (`im_zielgebiet`), damit nichts verloren geht.
 */
const REGION_PREFIXES = ["80", "81", "82", "83", "84", "85", "86", "87", "89", "93", "940", "941", "943", "944", "945"];

export function inRegion(plz: string | undefined) {
  const p = (plz ?? "").trim();
  if (!/^\d{5}$/.test(p)) return false;
  return REGION_PREFIXES.some((prefix) => p.startsWith(prefix));
}

/** Einfaches Scoring für die Priorisierung im Vertrieb (A/B/C). Max. 9 Punkte (+1 mit PLZ im Zielgebiet). */
export function leadScore(answers: Answers, plz?: string) {
  let s = 0;
  s += { "500k-1m": 2, "1m-2-5m": 3, "2-5m-10m": 4, "ueber-10m": 4 }[answers.umsatz as string] ?? 0;
  s += { "1-9": 1, "10-49": 2, "50-249": 3, "250+": 3 }[answers.mitarbeiter as string] ?? 0;
  // Mehrere Wechselgründe = höherer Leidensdruck
  const a = ((answers.anlass as string[] | undefined) ?? []).filter((v) => v !== "kein-stb");
  s += Math.min(a.length, 2);
  if (inRegion(plz)) s += 1;
  return { punkte: s, klasse: s >= 6 ? "A" : s >= 4 ? "B" : "C" } as const;
}
