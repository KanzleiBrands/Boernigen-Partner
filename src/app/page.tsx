import { existsSync } from "node:fs";
import path from "node:path";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Landmark,
  Lock,
  Plus,
  Minus,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SelfCheck, type Pain } from "@/components/SelfCheck";
import { YearEndCountdown } from "@/components/YearEndCountdown";
import { YearComparison } from "@/components/YearComparison";
import { AdvisorMessage, SwitchGraphic } from "@/components/Visuals";
import { Container, CtaButton, CtaNote, Eyebrow, FUNNEL_HREF, H2 } from "@/components/ui";
import Link from "next/link";

/*
 * Copy-Logik (Hormozi „Grand Slam Offer“ + Baulig Evergreen-Strukturen):
 * Wert = Traumergebnis × Wahrscheinlichkeit ÷ (Zeit × Aufwand).
 * → Traumergebnis: Steuerlast planen statt erleiden. Wahrscheinlichkeit: Auszeichnungen, Partner, Mandanten.
 * → Zeit: Ergebnis schon im 30-Minuten-Gespräch. Aufwand: 2-Minuten-Check, Wechsel übernehmen wir.
 * Berufsrecht (§ 57a StBerG): keine Ersparnis-Beträge, keine Erfolgsgarantien – Fragen, Fakten, Konsequenzen.
 */

const pains: Pain[] = [
  {
    quote: "Von meiner Kanzlei kam noch nie ein Vorschlag.",
    text: "Holding, Geschäftsführergehalt, Ausschüttungen – angesprochen wird nur, was Sie selbst fragen.",
  },
  {
    quote: "Die Nachzahlung hat mich kalt erwischt.",
    text: "Bescheid, Nachzahlung, höhere Vorauszahlungen – und niemand hat Sie vorher gewarnt.",
  },
  {
    quote: "Antworten kommen erst, wenn es schon brennt.",
    text: "Rückfragen dauern Wochen. Entscheidungen treffen Sie ohne steuerliche Einschätzung.",
  },
  {
    quote: "Die BWA kommt so spät, dass sie nichts mehr nützt.",
    text: "Für Bank, Investitionen und Personal fehlen Ihnen aktuelle, belastbare Zahlen.",
  },
  {
    quote: "Jedes Jahr ein neuer Sachbearbeiter.",
    text: "Sie erklären Ihr Unternehmen immer wieder von vorn. Niemand kennt es wirklich.",
  },
  {
    quote: "Wir sind digital. Unsere Kanzlei nicht.",
    text: "Pendelordner, Belege per Post, E-Mail-Pingpong. Ihre Buchhaltung bremst Sie aus.",
  },
];

const offer = [
  {
    t: "Steuer-Röntgenblick",
    d: "Rechtsform, Geschäftsführervergütung, Ausschüttungen, Rücklagen: Wir sehen von außen, was intern niemand mehr hinterfragt.",
  },
  {
    t: "Ihre 3 wichtigsten Hebel",
    d: "Konkrete Ansatzpunkte, sortiert nach Wirkung – und was davon noch vor dem 31.12. umsetzbar ist.",
  },
  {
    t: "Nachzahlungs-Frühwarnung",
    d: "Eine ehrliche Einschätzung, ob Ihnen Nachzahlungen oder höhere Vorauszahlungen drohen – bevor der Bescheid kommt.",
  },
  {
    t: "Wechsel-Fahrplan",
    d: "Falls ein Wechsel sinnvoll ist: Zeitpunkt, Ablauf, Honorar. Schwarz auf weiß, ohne Kleingedrucktes.",
  },
];

const yearEnd = [
  {
    t: "Geschäftsführervergütung & Tantieme",
    d: "Höhe und Struktur müssen im Voraus vereinbart sein. Rückwirkend erkennt das Finanzamt nichts an.",
  },
  {
    t: "Investitionen & Abschreibungen",
    d: "Ob eine Anschaffung noch dieses oder erst nächstes Jahr wirkt, entscheidet sich am Kalender – nicht im Abschluss.",
  },
  {
    t: "Ausschüttung, Thesaurierung, Holding",
    d: "Gewinne entnehmen oder im Unternehmen lassen? Die Weichen stellen Sie vor dem Stichtag. Danach wird nur noch gebucht.",
  },
];

const compare: [string, string, string][] = [
  ["Steuerlast", "Wird festgestellt – im Folgejahr", "Wird geplant – unterjährig, bevor sie entsteht"],
  ["Beratung", "Nur, wenn Sie fragen", "Proaktiv: Wir melden uns, bevor Sie fragen müssen"],
  ["Zahlen", "Monate nach Jahresende", "Monatlich aktuell, jederzeit in DATEV einsehbar"],
  ["Ansprechpartner", "Wechselnde Sachbearbeitung", "Ein fester Ansprechpartner, der Ihr Unternehmen kennt"],
  ["Lohn & HR", "Getrennt oder ausgelagert", "Aus einer Hand – mit Personio-Anbindung"],
  ["Zusammenarbeit", "Pendelordner und Papier", "Volldigital: DATEV, Kanzleicloud, KI-gestützte Prozesse"],
];

const services = [
  {
    icon: Scale,
    title: "Steuer- & Gestaltungsberatung",
    text: "Geschäftsführergehalt, Ausschüttungen, Holding, Rechtsform – vorausschauend statt rückblickend.",
  },
  {
    icon: BarChart3,
    title: "CFO-Service",
    text: "Controlling, Liquiditätsplanung, Bankreporting. Ein Sparringspartner für Ihre Entscheidungen.",
  },
  {
    icon: FileText,
    title: "Finanzbuchhaltung",
    text: "Digitale Belegverarbeitung über DATEV Unternehmen online – Zahlen monatlich aktuell.",
  },
  {
    icon: Users,
    title: "Lohn & HR",
    text: "Lohn- und Gehaltsabrechnung, Benefits, Sachbezüge – nahtlos angebunden an Personio.",
  },
  {
    icon: Landmark,
    title: "Jahresabschluss & Steuern",
    text: "Abschlüsse, betriebliche und private Erklärungen – termingerecht und verständlich erklärt.",
  },
  {
    icon: TrendingUp,
    title: "Bewertung & Nachfolge",
    text: "Unternehmensbewertung im eigenen Haus – für Nachfolge, Kauf, Verkauf, Gesellschafterwechsel.",
  },
];

const steps = [
  {
    title: "Vorab-Check",
    time: "2 Minuten",
    text: "8 kurze Klick-Fragen. Sie erfahren sofort, ob wir zusammenpassen.",
  },
  {
    title: "Steuer-Hebel-Check",
    time: "30 Minuten",
    text: "Telefon, Video oder vor Ort. Sie gehen mit Ihren 3 wichtigsten Hebeln raus – egal, wie Sie sich danach entscheiden.",
  },
  {
    title: "Klares Angebot",
    time: "wenige Tage",
    text: "Leistungsumfang und Honorar transparent auf einen Blick. Sie entscheiden in Ruhe.",
  },
  {
    title: "Wechsel ohne Aufwand",
    time: "wir übernehmen",
    text: "Kündigung, Datenübernahme aus DATEV, Abstimmung mit Ihrer bisherigen Kanzlei, laufende Fristen – alles bei uns.",
  },
];

const faqs = [
  {
    q: "Ich bin eigentlich ganz zufrieden. Lohnt sich das trotzdem?",
    a: "Gerade dann. „Zufrieden“ heißt oft: Es läuft ordentlich – aber niemand gestaltet. Im Hebel-Check sehen Sie in 30 Minuten, ob Spielraum brachliegt. Wenn nicht, sagen wir Ihnen das ehrlich, und Sie bleiben mit gutem Gefühl bei Ihrer Kanzlei.",
  },
  {
    q: "Was kostet der Steuer-Hebel-Check?",
    a: "Nichts. Er ist kostenfrei und unverbindlich. Kein Haken, kein Abo, keine Verpflichtung.",
  },
  {
    q: "Ist ein Wechsel nicht wahnsinnig aufwendig?",
    a: "Für Sie nicht. Kündigung, Übernahme der DATEV-Daten (Stammdaten, Buchhaltung, Lohnhistorie), Abstimmung mit Ihrer bisherigen Kanzlei und alle laufenden Fristen koordinieren wir. Sie müssen nichts neu aufbereiten.",
  },
  {
    q: "Geht das auch mitten im Jahr?",
    a: "In aller Regel ja. Wir planen den Zeitpunkt mit Ihnen – mit Blick auf Kündigungsfristen, laufende Abschlüsse und Fristen. Für die Gestaltung des laufenden Jahres gilt allerdings: je früher, desto mehr Spielraum.",
  },
  {
    q: "Wird es teurer als bei meiner jetzigen Kanzlei?",
    a: "Das hängt vom Umfang ab – und genau deshalb bekommen Sie ein transparentes Angebot, bevor Sie irgendetwas entscheiden. Viele Unternehmer stellen fest: Teuer ist nicht das Honorar, sondern die Beratung, die nie stattgefunden hat.",
  },
  {
    q: "Für wen ist das Angebot gedacht?",
    a: "Für inhabergeführte Unternehmen und Selbstständige ab etwa 500.000 € Jahresumsatz im Großraum München und Umland (ca. 150 km). Bargeldintensive Branchen wie Gastronomie, Hotellerie oder Glücksspiel betreuen wir nicht.",
  },
  {
    q: "Warum die Vorab-Fragen?",
    a: "Weil wir Mandate bewusst auswählen. So stellen wir sicher, dass das Gespräch für Sie wertvoll ist – und dass Sie direkt mit dem passenden Berater sprechen, nicht mit einem Vertriebsmitarbeiter.",
  },
];

const partners = [
  {
    ini: "JB",
    name: "Jan Börnigen",
    title: "Dipl.-Kfm., Steuerberater",
    img: "/img/team/jan-boernigen.jpg",
  },
  {
    ini: "PB",
    name: "Petra Börnigen",
    title: "Dipl.-Kffr., Steuerberaterin",
    img: "/img/team/petra-boernigen.jpg",
  },
];
// Portrait nur zeigen, wenn die Datei in public/img/team liegt – sonst Initialen als Platzhalter
const hasImage = (src: string) => existsSync(path.join(process.cwd(), "public", src));

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* HERO – Frage-Hook + Angebot als Value-Stack */}
        <section className="relative overflow-hidden bg-paper">
          <div
            className="pointer-events-none absolute top-[-20%] right-[-12%] hidden size-[640px] rounded-full bg-red/[0.06] lg:block"
            aria-hidden
          />
          <Container className="relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
            <div>
              <Eyebrow>Für Unternehmer im Raum München · ab 500.000 € Umsatz</Eyebrow>
              <h1 className="mt-6 font-serif text-[2.3rem] leading-[1.08] font-medium tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.4rem]">
                Wann hat Ihr Steuerberater Ihnen zuletzt etwas vorgeschlagen,{" "}
                <span className="text-red">ohne dass Sie gefragt haben?</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 text-pretty">
                Wenn Sie darüber nachdenken müssen, liegt bei Ihnen sehr wahrscheinlich Gestaltungsspielraum brach – bei
                Geschäftsführergehalt, Ausschüttungen, Holding und Liquidität. Jahr für Jahr.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-700 text-pretty">
                Im kostenfreien <strong className="font-semibold text-ink">Steuer-Hebel-Check</strong> zeigen wir Ihnen
                in 30 Minuten, wo Ihre ungenutzten Hebel liegen. Ob Sie danach wechseln, entscheiden Sie.
              </p>
              <div className="mt-9">
                <CtaButton>Kostenfreien Hebel-Check sichern</CtaButton>
                <CtaNote />
              </div>
            </div>

            <div className="relative">
              <aside className="relative rounded-sm border border-line bg-white p-7 shadow-[0_30px_60px_-30px_rgba(29,27,28,0.25)] sm:p-9">
                <div className="absolute -top-3 left-7 rounded-sm bg-red px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
                  Kostenfrei · 30 Minuten
                </div>
                <h2 className="font-serif text-2xl leading-snug font-medium text-ink">Der Steuer-Hebel-Check</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">Das nehmen Sie aus dem Gespräch mit:</p>
                <ol className="mt-6 space-y-5">
                  {offer.map(({ t, d }, i) => (
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
                <div className="mt-7 flex gap-3 rounded-sm bg-paper p-4 text-[15px] leading-relaxed text-ink-700">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-red" aria-hidden />
                  <p>
                    <strong className="font-semibold text-ink">Unser Ehrlichkeits-Versprechen:</strong> Sind Sie bereits
                    gut aufgestellt, sagen wir Ihnen das klar – und Sie bleiben mit gutem Gefühl bei Ihrer Kanzlei.
                  </p>
                </div>
              </aside>
              {/* So fühlt sich Gestaltung an – Beispielnachricht */}
              <div className="relative z-10 mt-5 lg:-mt-6 lg:-ml-16 lg:w-[380px] lg:-rotate-1">
                <AdvisorMessage avatar={hasImage(partners[0].img) ? partners[0].img : undefined} />
                <p className="mt-3 pl-2 text-sm text-muted italic">So fühlt sich eine Kanzlei an, die mitdenkt.</p>
              </div>
            </div>
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

        {/* SELBST-CHECK – Problem-Lösung / Agitation */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>60-Sekunden-Selbsttest</Eyebrow>
              <H2 className="mt-5">Wie viele dieser Sätze haben Sie schon einmal gedacht?</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-700">
                Die teuersten Fehler stehen in keinem Steuerbescheid. Es sind die Entscheidungen, die nie getroffen
                wurden – weil niemand sie Ihnen vorgeschlagen hat.
              </p>
            </div>
            <SelfCheck pains={pains} />
          </Container>
        </section>

        {/* ZWEI JAHRE – das Bild ausmalen */}
        <section className="bg-paper py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Stellen Sie es sich einmal vor</Eyebrow>
              <H2 className="mt-5">Gleiches Unternehmen. Gleicher Umsatz. Zwei völlig verschiedene Jahre.</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-700">
                Der Unterschied zwischen einer Kanzlei, die verwaltet, und einer, die gestaltet, steht nicht im
                Jahresabschluss. Er steht auf Ihrem Konto – und in Ihrem Kalender.
              </p>
            </div>
            <YearComparison />
            <div className="mt-12 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
              <CtaButton>Ich will Jahr B</CtaButton>
              <p className="text-sm text-muted">Schematische Darstellung typischer Abläufe, keine Einzelfallzusage.</p>
            </div>
          </Container>
        </section>

        {/* ZEITDRUCK – echter Stichtag */}
        <section className="hairlines relative bg-ink py-20 text-white sm:py-28">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div>
                <Eyebrow light>Der Stichtag, den Ihre Kanzlei nicht erwähnt</Eyebrow>
                <H2 light className="mt-5">
                  Steuerliche Gestaltung hat ein Verfallsdatum: den 31. Dezember.
                </H2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                  Was bis zum Jahresende nicht geplant ist, lässt sich im Abschluss nur noch feststellen. Dann bucht
                  Ihre Kanzlei, was passiert ist – und Sie zahlen, was dabei herauskommt.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <YearEndCountdown />
              </div>
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {yearEnd.map(({ t, d }, i) => (
                <div key={t} className="border-t border-white/15 pt-7">
                  <span className="font-serif text-3xl text-red">0{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-14">
              <CtaButton>Hebel-Check vor Jahresende sichern</CtaButton>
              <CtaNote light />
            </div>
          </Container>
        </section>

        {/* ALTER WEG / NEUER WEG */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Verwalten oder gestalten</Eyebrow>
              <H2 className="mt-5">Ihre Kanzlei schaut in den Rückspiegel. Sie fahren nach vorn.</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-700">
                Das ist kein Vorwurf an Ihre Kanzlei. Ab einer gewissen Unternehmensgröße reicht Verwalten einfach nicht
                mehr.
              </p>
            </div>
            <div className="mt-12 overflow-hidden rounded-sm border border-line">
              <div className="hidden grid-cols-[1fr_1.3fr_1.5fr] bg-paper text-xs font-semibold tracking-[0.14em] uppercase sm:grid">
                <div className="p-5" />
                <div className="p-5 text-muted">Der alte Weg</div>
                <div className="bg-ink p-5 text-white">Börnigen &amp; Partners</div>
              </div>
              {compare.map(([k, a, b]) => (
                <div
                  key={k}
                  className="grid border-t border-line first:border-t-0 sm:grid-cols-[1fr_1.3fr_1.5fr] sm:first:border-t"
                >
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

        {/* PARTNER – Autorität + Werte */}
        <section className="bg-paper py-20 sm:py-28">
          <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="grid grid-cols-2 gap-4">
              {partners.map(({ ini, name, title, img }) => (
                <figure key={name}>
                  {hasImage(img) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={`${name}, ${title}`}
                      className="aspect-[4/5] w-full rounded-sm object-cover object-top"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-gradient-to-br from-paper-200 to-white">
                      <span className="font-serif text-6xl text-ink/15">{ini}</span>
                    </div>
                  )}
                  <figcaption className="mt-3">
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-sm text-muted">{title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div>
              <Eyebrow>Geschäftsführende Partner</Eyebrow>
              <H2 className="mt-5">Bei uns sprechen Sie mit Steuerberatern. Nicht mit einer Warteschleife.</H2>
              <blockquote className="mt-8 border-l-2 border-red pl-6 font-serif text-xl leading-relaxed text-ink-700 sm:text-2xl">
                „Wir sagen Unternehmern, was Sache ist. Keine unnötige Komplexität, keine leeren Versprechen – sondern
                Vorschläge, bevor die Entscheidung fällt.“
              </blockquote>
              <p className="mt-8 leading-relaxed text-muted">
                Jan und Petra Börnigen führen eine der digitalsten Kanzleien im Raum München – fünfmal in Folge von
                DATEV ausgezeichnet. Wir automatisieren, was sich automatisieren lässt. Damit unsere Berater Zeit für
                das haben, was zählt: Ihre Entscheidungen. Zwei Standorte, 27 Mitarbeitende, ein fester Ansprechpartner
                für Sie.
              </p>
            </div>
          </Container>
        </section>

        {/* STIMMEN */}
        <section className="py-20 sm:py-24">
          <Container>
            <Eyebrow>Was Mandanten sagen</Eyebrow>
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

        {/* ABLAUF – Aufwand minimieren */}
        <section className="bg-paper py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Wechseln ist einfacher, als Sie denken</Eyebrow>
              <H2 className="mt-5">Ihr Aufwand: 2 Minuten und ein Gespräch. Den Rest übernehmen wir.</H2>
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
            <div className="mt-16">
              <SwitchGraphic />
            </div>
            <div className="mt-14">
              <CtaButton>Jetzt Vorab-Check starten</CtaButton>
              <CtaNote />
            </div>
          </Container>
        </section>

        {/* LEISTUNGEN */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <Eyebrow>Leistungen</Eyebrow>
                <H2 className="mt-5">Alles aus einer Hand. Oder genau der Teil, den Sie brauchen.</H2>
              </div>
              <p className="text-lg leading-relaxed text-ink-700 lg:pb-2">
                Lohn, Buchhaltung und Beratung greifen ineinander. Kein Informationsverlust zwischen drei
                Dienstleistern, kein „Da müssen Sie Ihr Lohnbüro fragen“.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-sm border border-line bg-white p-7 transition-shadow hover:shadow-lg"
                >
                  <Icon className="size-6 text-red" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FÜR WEN – Identität + Exklusivität */}
        <section className="bg-paper py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Nicht für jeden</Eyebrow>
              <H2 className="mt-5">Wir nehmen nicht jedes Mandat an. Und das ist gut für Sie.</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-700">
                Jedes neue Mandat wird persönlich aufgenommen. Deshalb arbeiten wir nur mit Unternehmern, für die wir
                wirklich einen Unterschied machen können.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-sm border border-line bg-white p-8">
                <p className="flex items-center gap-3 font-semibold text-ink">
                  <span className="flex size-7 items-center justify-center rounded-full bg-red text-white">
                    <Plus className="size-4" aria-hidden />
                  </span>
                  Wir passen zusammen, wenn …
                </p>
                <ul className="mt-6 space-y-3.5 text-ink-700">
                  {[
                    "Ihr Unternehmen mindestens 500.000 € Jahresumsatz macht",
                    "Sie es als Inhaber oder Geschäftsführer selbst führen",
                    "Sie im Großraum München oder bis ca. 150 km entfernt sitzen",
                    "Sie digital arbeiten – oder es endlich wollen",
                    "Sie einen Berater wollen, der widerspricht, wenn es nötig ist",
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
                  Bitte nicht anfragen, wenn …
                </p>
                <ul className="mt-6 space-y-3.5 text-muted">
                  {[
                    "Sie einen bargeldintensiven Betrieb führen (Gastronomie, Hotellerie, Glücksspiel)",
                    "Sie nur den billigsten Anbieter suchen",
                    "Sie Belege weiterhin einmal im Jahr im Schuhkarton abgeben möchten",
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

        {/* FAQ – Einwandbehandlung */}
        <section className="py-20 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Ehrliche Antworten</Eyebrow>
              <H2 className="mt-5">Was Unternehmer uns vorher fragen.</H2>
              <p className="mt-6 leading-relaxed text-muted">
                Ihre Frage ist nicht dabei? Stellen Sie sie im Hebel-Check – dafür ist er da.
              </p>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 text-lg font-semibold text-ink">
                    {f.q}
                    <Plus
                      className="faq-icon mt-1 size-5 shrink-0 text-red transition-transform duration-200"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 pr-10 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* FINAL CTA – Zusammenfassung + Entscheidung */}
        <section className="hairlines relative overflow-hidden bg-ink py-20 text-white sm:py-28">
          <div
            className="pointer-events-none absolute -bottom-40 -left-40 size-[480px] rounded-full bg-red/10"
            aria-hidden
          />
          <Container className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <H2 light>Sie haben zwei Möglichkeiten.</H2>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
              <div className="rounded-sm border border-white/15 p-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Option 1</p>
                <p className="mt-3 text-lg font-semibold">Alles bleibt, wie es ist.</p>
                <p className="mt-3 leading-relaxed text-white/60">
                  Der nächste Abschluss kommt im Herbst. Der nächste Bescheid vielleicht mit Überraschung. Und ob Sie
                  Spielraum verschenkt haben, erfahren Sie nie.
                </p>
              </div>
              <div className="rounded-sm border border-red bg-red/10 p-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-red uppercase">Option 2</p>
                <p className="mt-3 text-lg font-semibold">30 Minuten Klarheit. Kostenfrei.</p>
                <p className="mt-3 leading-relaxed text-white/75">
                  Sie kennen Ihre 3 wichtigsten Hebel, wissen, was noch vor dem 31.12. geht – und entscheiden dann in
                  Ruhe. Im schlimmsten Fall haben Sie die Bestätigung, dass alles passt.
                </p>
              </div>
            </div>
            <div className="mt-12 flex flex-col items-center">
              <CtaButton>Kostenfreien Hebel-Check sichern</CtaButton>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/55">
                <Lock className="size-3.5" aria-hidden />
                Vertraulich · unterliegt der Verschwiegenheitspflicht nach § 57 StBerG
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
          Kostenfreien Hebel-Check sichern
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}
