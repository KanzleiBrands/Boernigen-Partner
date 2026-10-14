import {
  ArrowDown,
  BarChart3,
  Building2,
  Check,
  Clock,
  FileText,
  Landmark,
  Lock,
  MessageSquareQuote,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container, CtaButton, CtaNote, Eyebrow, FUNNEL_HREF, H2 } from "@/components/ui";
import Link from "next/link";

const pains = [
  {
    quote: "Ich bekomme Antworten erst, wenn es schon dringend ist.",
    text: "Rückfragen dauern Wochen. Entscheidungen, die heute fallen müssen, treffen Sie ohne steuerliche Einschätzung.",
  },
  {
    quote: "Die Nachzahlung hat mich kalt erwischt.",
    text: "Steuerbescheid, Nachzahlung, angepasste Vorauszahlungen – und niemand hat Sie vorher darauf vorbereitet.",
  },
  {
    quote: "Holding? Geschäftsführergehalt? Von meiner Kanzlei kam dazu nie etwas.",
    text: "Gestaltungsmöglichkeiten werden nicht angesprochen. Ihre Kanzlei verwaltet die Vergangenheit, statt die Zukunft zu planen.",
  },
  {
    quote: "Die BWA kommt so spät, dass sie mir nicht mehr hilft.",
    text: "Für Bankgespräche, Investitionen und Personalentscheidungen fehlen Ihnen aktuelle, belastbare Zahlen.",
  },
  {
    quote: "Jedes Jahr ein anderer Sachbearbeiter.",
    text: "Sie erklären Ihr Unternehmen immer wieder von vorne – und niemand kennt Ihre Situation wirklich.",
  },
  {
    quote: "Wir arbeiten digital. Unsere Kanzlei nicht.",
    text: "Pendelordner, Belege per Post, E-Mail-Pingpong. Ihre Buchhaltung bremst Ihr Unternehmen, statt es zu unterstützen.",
  },
];

const compare: [string, string, string][] = [
  ["Zahlen", "Erst Monate nach Jahresende", "Monatlich aktuell – digital in DATEV einsehbar"],
  ["Beratung", "Nur auf Nachfrage", "Proaktiv und unterjährig – bevor Entscheidungen fallen"],
  ["Ansprechpartner", "Wechselnde Sachbearbeitung", "Ein fester, persönlicher Ansprechpartner"],
  ["Lohn & HR", "Getrennt oder ausgelagert", "Aus einer Hand – mit Personio-Schnittstelle"],
  ["Zusammenarbeit", "Pendelordner und Papier", "Volldigital: DATEV, Kanzleicloud, KI-gestützte Prozesse"],
  ["Steuerlast", "Wird festgestellt", "Wird geplant und aktiv gestaltet"],
];

const services = [
  {
    icon: Users,
    title: "Lohn & HR",
    text: "Lohn- und Gehaltsabrechnung, Sachbezüge und Benefits – nahtlos angebunden an Personio und Ihre Zeiterfassung.",
  },
  {
    icon: FileText,
    title: "Finanzbuchhaltung",
    text: "Digitale Belegverarbeitung über DATEV Unternehmen online. Ihre Zahlen sind monatlich aktuell – nicht erst im Folgejahr.",
  },
  {
    icon: Landmark,
    title: "Jahresabschluss & Steuern",
    text: "Jahresabschlüsse, betriebliche und private Steuererklärungen – termingerecht und mit klarer Erläuterung.",
  },
  {
    icon: Scale,
    title: "Gestaltungsberatung",
    text: "Geschäftsführergehalt, Ausschüttungspolitik, Holding- und Rechtsformfragen – vorausschauend statt rückblickend.",
  },
  {
    icon: BarChart3,
    title: "CFO-Service",
    text: "Controlling, Liquiditätsplanung und Bankreporting. Ein Sparringspartner für Ihre unternehmerischen Entscheidungen.",
  },
  {
    icon: TrendingUp,
    title: "Bewertung & Nachfolge",
    text: "Unternehmensbewertung im eigenen Haus – für Nachfolge, Gesellschafterwechsel, Kauf oder Verkauf.",
  },
];

const steps = [
  {
    title: "Vorab-Check",
    time: "2 Minuten",
    text: "Sie beantworten online einige kurze Fragen zu Ihrem Unternehmen. So bereiten wir das Gespräch gezielt vor.",
  },
  {
    title: "Strategiegespräch",
    time: "30 Minuten",
    text: "Mit einem unserer Steuerberater – telefonisch, per Video oder vor Ort in Unterföhring. Vertraulich und unverbindlich.",
  },
  {
    title: "Klares Angebot",
    time: "wenige Tage",
    text: "Sie erhalten eine transparente Übersicht über Leistungsumfang und Honorar. Ohne Kleingedrucktes.",
  },
  {
    title: "Geordneter Wechsel",
    time: "wir übernehmen",
    text: "Datenübernahme, Abstimmung mit Ihrer bisherigen Kanzlei, laufende Fristen – wir koordinieren den Übergang.",
  },
];

const faqs = [
  {
    q: "Was kostet das Erstgespräch?",
    a: "Nichts. Das Gespräch ist kostenfrei und unverbindlich. Sie gehen keinerlei Verpflichtung ein.",
  },
  {
    q: "Muss ich danach direkt wechseln?",
    a: "Nein. Viele Unternehmer nutzen das Gespräch als steuerliche Zweitmeinung. Ob und wann ein Wechsel für Sie sinnvoll ist, entscheiden Sie – auf Basis einer klaren Einschätzung.",
  },
  {
    q: "Ist ein Wechsel auch während des laufenden Jahres möglich?",
    a: "In aller Regel ja. Wir besprechen mit Ihnen den sinnvollsten Zeitpunkt – mit Blick auf Kündigungsfristen, laufende Abschlüsse und anstehende Fristen. Die Abstimmung mit Ihrer bisherigen Kanzlei übernehmen wir.",
  },
  {
    q: "Was passiert mit meinen Daten in DATEV?",
    a: "Arbeitet Ihre bisherige Kanzlei mit DATEV, lassen sich Stammdaten, Buchhaltung und Lohnhistorie strukturiert übernehmen. Sie müssen nichts neu aufbereiten.",
  },
  {
    q: "Für wen ist das Angebot gedacht?",
    a: "Für inhabergeführte Unternehmen und Selbstständige ab etwa 500.000 € Jahresumsatz im Großraum München. Bargeldintensive Branchen wie Gastronomie, Hotellerie oder Glücksspiel betreuen wir nicht.",
  },
  {
    q: "Wir sind nicht direkt in München. Passt das trotzdem?",
    a: "Ja. Wir betreuen Unternehmen im gesamten Umland – Termine finden bei Bedarf vor Ort, ansonsten bequem per Video statt. Durch die digitale Zusammenarbeit spielt die Entfernung im Alltag kaum eine Rolle.",
  },
  {
    q: "Warum die Vorab-Fragen?",
    a: "Wir wählen unsere Mandate bewusst aus, um jedem Mandanten die Betreuungsqualität zu bieten, die er erwartet. Die Fragen stellen sicher, dass das Gespräch für beide Seiten wertvoll ist – und dass Sie direkt mit dem passenden Berater sprechen.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-paper">
          <div
            className="pointer-events-none absolute top-[-20%] right-[-12%] hidden size-[640px] rounded-full bg-red/[0.06] lg:block"
            aria-hidden
          />
          <Container className="relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-24">
            <div>
              <Eyebrow>Für Unternehmer im Raum München · ab 500.000 € Umsatz</Eyebrow>
              <h1 className="mt-6 font-serif text-[2.4rem] leading-[1.08] font-medium tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.6rem]">
                Ihr Unternehmen ist gewachsen. <span className="text-red">Ihre Steuerberatung auch?</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 text-pretty">
                Wenn Zahlen erst im Folgejahr kommen, Rückfragen Wochen dauern und von Ihrer Kanzlei kein einziger
                Gestaltungsvorschlag kommt, zahlen Sie dafür – mit Steuern, Zeit und Unsicherheit.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-700 text-pretty">
                Börnigen &amp; Partners betreut inhabergeführte Unternehmen ganzheitlich: Lohn, Buchhaltung,
                Jahresabschluss – und eine Beratung, die mitdenkt, bevor Entscheidungen fallen.
              </p>
              <div className="mt-9">
                <CtaButton>Kostenfreies Erstgespräch anfragen</CtaButton>
                <CtaNote />
              </div>
            </div>

            {/* Angebot als No-Brainer */}
            <aside className="relative rounded-sm border border-line bg-white p-7 shadow-[0_30px_60px_-30px_rgba(29,27,28,0.25)] sm:p-9">
              <div className="absolute -top-3 left-7 rounded-sm bg-ink px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
                Kostenfrei · 30 Minuten
              </div>
              <h2 className="font-serif text-2xl leading-snug font-medium text-ink">Ihre steuerliche Zweitmeinung</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Im Erstgespräch schauen wir mit dem Blick von außen auf Ihre Situation:
              </p>
              <ol className="mt-6 space-y-5">
                {[
                  ["Standortbestimmung", "Rechtsform, Geschäftsführergehalt, Ausschüttungen, Rücklagen – wo stehen Sie heute?"],
                  ["Ungenutzte Hebel", "Welche Gestaltungsmöglichkeiten bisher nicht angesprochen wurden."],
                  ["Klarer Fahrplan", "Was ein Wechsel konkret bedeutet: Ablauf, Zeitpunkt, Aufwand für Sie."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-red/30 font-serif text-sm text-red">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{t}</p>
                      <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-7 border-t border-line pt-5 text-[15px] leading-relaxed text-ink-700">
                <strong className="font-semibold">Auch wenn Sie danach bei Ihrer Kanzlei bleiben:</strong> Sie wissen,
                wo Sie steuerlich stehen.
              </p>
            </aside>
          </Container>
        </section>

        {/* TRUST */}
        <section className="border-y border-line bg-white">
          <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-9 md:grid-cols-4 md:items-center">
            <div className="col-span-2 flex items-center gap-4 md:col-span-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/datev-digitale-kanzlei-2023.png"
                alt="DATEV-Auszeichnung Digitale Kanzlei 2023"
                className="size-16 shrink-0"
              />
              <p className="text-sm leading-snug text-ink-700">
                <strong className="block text-base text-ink">5× in Folge</strong>
                als „Digitale Kanzlei“ von DATEV ausgezeichnet
              </p>
            </div>
            {[
              ["DATEV SmartExpert", "zertifizierte Expertise"],
              ["27 Mitarbeitende", "persönlich, kein Callcenter"],
              ["Unterföhring & Haar", "zwei Standorte im Raum München"],
            ].map(([a, b]) => (
              <p key={a} className="text-sm leading-snug text-ink-700 md:border-l md:border-line md:pl-6">
                <strong className="block text-base text-ink">{a}</strong>
                {b}
              </p>
            ))}
          </Container>
        </section>

        {/* PAIN */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Erkennen Sie sich wieder?</Eyebrow>
              <H2 className="mt-5">
                Die meisten Unternehmer wechseln nicht, weil ihre Kanzlei Fehler macht. Sondern weil sie nicht mehr
                mitwächst.
              </H2>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {pains.map((p) => (
                <div key={p.quote} className="bg-white p-7 sm:p-8">
                  <MessageSquareQuote className="size-5 text-red" aria-hidden />
                  <p className="mt-4 font-serif text-xl leading-snug text-ink">„{p.quote}“</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-700">
              Trifft mehr als einer dieser Punkte zu, ist das kein Zeichen schlechter Unternehmensführung. Es ist ein
              Zeichen, dass Ihr Unternehmen seiner Kanzlei <strong className="font-semibold">entwachsen</strong> ist.
            </p>
          </Container>
        </section>

        {/* KOSTEN DES NICHTSTUNS */}
        <section className="hairlines relative bg-ink py-20 text-white sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow light>Was eine passive Kanzlei wirklich kostet</Eyebrow>
              <H2 light className="mt-5">
                Steuerliche Gestaltung wirkt nur nach vorne. Jedes Jahr ohne Plan ist ein Jahr, das Sie nicht
                zurückbekommen.
              </H2>
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {[
                {
                  icon: Scale,
                  t: "Verpasster Gestaltungsspielraum",
                  d: "Geschäftsführervergütung, Ausschüttungen, Holding, Investitionszeitpunkte: Diese Hebel lassen sich nur planen, bevor das Geschäftsjahr endet – nicht danach.",
                },
                {
                  icon: Clock,
                  t: "Liquidität unter Druck",
                  d: "Nachzahlungen und angepasste Vorauszahlungen treffen Sie unvorbereitet. Kapital, das Sie für Wachstum eingeplant hatten, fließt ungeplant ab.",
                },
                {
                  icon: ShieldCheck,
                  t: "Entscheiden ohne Grundlage",
                  d: "Ohne aktuelle Zahlen werden Einstellungen, Investitionen und Bankgespräche zum Bauchgefühl – genau dort, wo Sie Sicherheit brauchen.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="border-t border-white/15 pt-7">
                  <Icon className="size-6 text-red" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-14">
              <CtaButton>Jetzt Zweitmeinung einholen</CtaButton>
              <CtaNote light />
            </div>
          </Container>
        </section>

        {/* VERGLEICH */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Verwalten oder gestalten</Eyebrow>
              <H2 className="mt-5">Der Unterschied liegt nicht im Jahresabschluss. Sondern in allem davor.</H2>
            </div>
            <div className="mt-12 overflow-hidden rounded-sm border border-line">
              <div className="hidden grid-cols-[1fr_1.3fr_1.5fr] bg-paper text-xs font-semibold tracking-[0.14em] uppercase sm:grid">
                <div className="p-5" />
                <div className="p-5 text-muted">Klassische Kanzlei</div>
                <div className="bg-ink p-5 text-white">Börnigen &amp; Partners</div>
              </div>
              {compare.map(([k, a, b]) => (
                <div key={k} className="grid border-t border-line first:border-t-0 sm:grid-cols-[1fr_1.3fr_1.5fr] sm:first:border-t">
                  <div className="px-5 pt-5 font-semibold text-ink sm:p-5">{k}</div>
                  <div className="flex items-start gap-3 px-5 pt-3 text-muted sm:p-5">
                    <X className="mt-0.5 size-4 shrink-0 text-grey" aria-hidden />
                    {a}
                  </div>
                  <div className="flex items-start gap-3 px-5 pt-2 pb-5 text-ink sm:bg-paper/60 sm:p-5">
                    <Check className="mt-0.5 size-4 shrink-0 text-red" aria-hidden />
                    {b}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* LEISTUNGEN */}
        <section className="bg-paper py-20 sm:py-28">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <Eyebrow>Leistungen</Eyebrow>
                <H2 className="mt-5">Alles aus einer Hand. Oder genau der Teil, den Sie brauchen.</H2>
              </div>
              <p className="text-lg leading-relaxed text-ink-700 lg:pb-2">
                Ob Komplettbetreuung oder einzelne Bausteine: Sie erhalten eine Kanzlei, in der Lohn, Buchhaltung und
                Beratung ineinandergreifen – ohne Schnittstellenverluste.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-sm border border-line bg-white p-7 transition-shadow hover:shadow-lg">
                  <Icon className="size-6 text-red" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ABLAUF */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>So einfach ist der Wechsel</Eyebrow>
              <H2 className="mt-5">Sie entscheiden. Den Rest koordinieren wir.</H2>
            </div>
            <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="relative">
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-5xl leading-none text-red/90">{i + 1}</span>
                    <span className="h-px flex-1 bg-line" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-grey uppercase">{s.time}</p>
                  <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* FÜR WEN */}
        <section className="bg-paper py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Qualität durch Auswahl</Eyebrow>
              <H2 className="mt-5">Wir nehmen nicht jedes Mandat an. Aus Verantwortung gegenüber unseren Mandanten.</H2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-sm border border-line bg-white p-8">
                <p className="flex items-center gap-3 font-semibold text-ink">
                  <span className="flex size-7 items-center justify-center rounded-full bg-red text-white">
                    <Plus className="size-4" aria-hidden />
                  </span>
                  Wir passen gut zusammen, wenn …
                </p>
                <ul className="mt-6 space-y-3.5 text-ink-700">
                  {[
                    "Sie ein inhabergeführtes Unternehmen ab ca. 500.000 € Jahresumsatz führen",
                    "Sie als GmbH, UG, Holding, Einzelunternehmer oder Freiberufler tätig sind",
                    "Ihr Unternehmen im Großraum München bzw. im Umkreis von ca. 150 km sitzt",
                    "Sie digital zusammenarbeiten möchten – oder dazu bereit sind",
                    "Sie einen Berater suchen, der unternehmerisch mitdenkt",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-red" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-line bg-white p-8">
                <p className="flex items-center gap-3 font-semibold text-ink">
                  <span className="flex size-7 items-center justify-center rounded-full bg-paper-200 text-muted">
                    <Minus className="size-4" aria-hidden />
                  </span>
                  Wir sind nicht die richtige Kanzlei, wenn …
                </p>
                <ul className="mt-6 space-y-3.5 text-muted">
                  {[
                    "Sie einen bargeldintensiven Betrieb führen (z. B. Gastronomie, Hotellerie, Glücksspiel)",
                    "Sie ausschließlich den günstigsten Preis suchen",
                    "Sie Belege lieber einmal im Jahr im Schuhkarton abgeben",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <X className="mt-1 size-4 shrink-0 text-grey" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* PARTNER */}
        <section className="py-20 sm:py-28">
          <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["JB", "Jan Börnigen", "Dipl.-Kfm., Steuerberater"],
                ["PB", "Petra Börnigen", "Dipl.-Kffr., Steuerberaterin"],
              ].map(([ini, name, title]) => (
                <figure key={name}>
                  {/* Platzhalter bis zum Drehtag: hier Portraitfoto einsetzen (4:5) */}
                  <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-gradient-to-br from-paper-200 to-paper">
                    <span className="font-serif text-6xl text-ink/15">{ini}</span>
                  </div>
                  <figcaption className="mt-3">
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-sm text-muted">{title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div>
              <Eyebrow>Geschäftsführende Partner</Eyebrow>
              <H2 className="mt-5">Partnerschaft statt Dienstleistung.</H2>
              <blockquote className="mt-8 border-l-2 border-red pl-6 font-serif text-xl leading-relaxed text-ink-700 sm:text-2xl">
                „Wir begleiten Unternehmer nicht nur steuerlich – sondern unternehmerisch. Wir sagen, was Sache ist:
                keine unnötige Komplexität, keine leeren Versprechen.“
              </blockquote>
              <p className="mt-8 leading-relaxed text-muted">
                Als digitale Kanzlei mit Standorten in Unterföhring und Haar verbinden wir fundierte Fachkompetenz mit
                modernen Prozessen. Wir automatisieren, was automatisierbar ist – damit sich unsere Berater auf das
                konzentrieren, was wirklich zählt: Ihre unternehmerischen Entscheidungen. Zwei Standorte, ein
                überschaubares Team, persönliche Ansprechpartner. Kein Callcenter, keine anonyme Großkanzlei.
              </p>
            </div>
          </Container>
        </section>

        {/* STIMMEN */}
        <section className="bg-paper py-20 sm:py-24">
          <Container>
            <Eyebrow>Aus unserer Mandantschaft</Eyebrow>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                "Endlich eine Kanzlei, die mitdenkt – ein Wegbegleiter zum Erfolg.",
                "Mehr als nur Steuern. Ein Ansprechpartner für Steuern und HR – das spart enorm Zeit.",
                "Vom Start-up bis zum international tätigen Unternehmen: Wir wurden in jeder Phase begleitet.",
              ].map((q) => (
                <figure key={q} className="rounded-sm border border-line bg-white p-8">
                  <span className="font-serif text-5xl leading-none text-red">“</span>
                  <blockquote className="mt-2 font-serif text-lg leading-relaxed text-ink">{q}</blockquote>
                </figure>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-20 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Häufige Fragen</Eyebrow>
              <H2 className="mt-5">Bevor Sie anfragen.</H2>
              <p className="mt-6 leading-relaxed text-muted">
                Ihre Frage ist nicht dabei? Stellen Sie sie direkt im Erstgespräch – dafür ist es da.
              </p>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 text-lg font-semibold text-ink">
                    {f.q}
                    <Plus className="faq-icon mt-1 size-5 shrink-0 text-red transition-transform duration-200" aria-hidden />
                  </summary>
                  <p className="mt-3 pr-10 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* FINAL CTA */}
        <section className="hairlines relative overflow-hidden bg-ink py-20 text-white sm:py-28">
          <div
            className="pointer-events-none absolute -bottom-40 -left-40 size-[480px] rounded-full bg-red/10"
            aria-hidden
          />
          <Container className="relative text-center">
            <Building2 className="mx-auto size-8 text-red" aria-hidden />
            <H2 light className="mx-auto mt-6 max-w-3xl">
              30 Minuten, die Ihnen zeigen, was Ihre Steuerberatung leisten könnte.
            </H2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Kostenfrei, vertraulich und ohne Verpflichtung. Beantworten Sie einige kurze Fragen – wir melden uns
              innerhalb eines Werktags mit einem Terminvorschlag.
            </p>
            <div className="mt-10 flex flex-col items-center">
              <CtaButton>Erstgespräch anfragen</CtaButton>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/55">
                <Lock className="size-3.5" aria-hidden />
                Ihre Angaben werden vertraulich behandelt und unterliegen der Verschwiegenheitspflicht.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />

      {/* Mobile Sticky-CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur sm:hidden">
        <Link
          href={FUNNEL_HREF}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-red py-3.5 text-[15px] font-semibold text-white"
        >
          Kostenfreies Erstgespräch anfragen
          <ArrowDown className="size-4 -rotate-90" aria-hidden />
        </Link>
      </div>
    </>
  );
}
