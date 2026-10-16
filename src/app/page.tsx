import { existsSync } from "node:fs";
import path from "node:path";
import { ArrowRight, Check, Lock, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SelfCheck, type Pain } from "@/components/SelfCheck";
import { YearEndCountdown } from "@/components/YearEndCountdown";
import { YearComparison } from "@/components/YearComparison";
import {
  AdvisorMessage,
  BookkeepingVisual,
  CfoCockpit,
  PayrollFlow,
  StructureDiagram,
  SwitchGraphic,
} from "@/components/Visuals";
import { Container, CtaButton, CtaNote, Eyebrow, FUNNEL_HREF, H2 } from "@/components/ui";

/*
 * Copy-Prinzip: Apple-Stil – kurze Headlines (≤ 6 Wörter), ein Satz Erklärung, die Grafik erzählt den Rest.
 * Mobil zuerst (80–90 % Social-Traffic). Angebot nach Hormozi: Ergebnis im Gespräch, kein Risiko, kein Aufwand.
 * Berufsrecht (§ 57a StBerG): keine Euro-Beträge, keine Erfolgsgarantien.
 */

const pains: Pain[] = [
  { quote: "Von meiner Kanzlei kam noch nie ein Vorschlag." },
  { quote: "Die Nachzahlung hat mich kalt erwischt." },
  { quote: "Antworten kommen erst, wenn es brennt." },
  { quote: "Die BWA kommt, wenn sie nichts mehr nützt." },
  { quote: "Lohn läuft über Excel und E-Mails." },
  { quote: "Unsere Buchhaltung tippt noch ab." },
];

const offer = [
  { t: "Ihre 3 wichtigsten Hebel", d: "Sortiert nach Wirkung – inklusive allem, was vor dem 31.12. noch geht." },
  { t: "Nachzahlungs-Frühwarnung", d: "Droht eine Nachzahlung? Sie wissen es, bevor der Bescheid kommt." },
  { t: "Digital-Check", d: "Wo Lohn und Buchhaltung bei Ihnen noch Zeit fressen." },
  { t: "Wechsel-Fahrplan", d: "Falls sinnvoll: Ablauf, Zeitpunkt, Honorar. Schwarz auf weiß." },
];

const faqs = [
  {
    q: "Ich bin eigentlich zufrieden. Lohnt sich das?",
    a: "Gerade dann. Zufrieden heißt oft: Es läuft ordentlich – aber niemand gestaltet. Finden wir nichts, sagen wir Ihnen das ehrlich.",
  },
  { q: "Was kostet der Hebel-Check?", a: "Nichts. Kostenfrei, unverbindlich, ohne Wechselpflicht." },
  {
    q: "Ist ein Wechsel nicht aufwendig?",
    a: "Für Sie nicht. Kündigung, DATEV-Datenübernahme, Fristen und die Abstimmung mit Ihrer bisherigen Kanzlei übernehmen wir.",
  },
  {
    q: "Wir nutzen Personio, HRworks oder andere Tools. Passt das?",
    a: "Ja. Wir binden Ihre HR- und Vorsysteme an, statt Sie zum Wechsel zu zwingen. Bei Personio sind wir Expert Partner, bei HRworks Partner.",
  },
  {
    q: "Für wen ist das Angebot?",
    a: "Für inhabergeführte Unternehmen ab ca. 500.000 € Umsatz im Raum München und Umland (ca. 150 km). Nicht für Gastronomie, Hotellerie und Glücksspiel.",
  },
];

const partners = [
  { ini: "JB", name: "Jan Börnigen", title: "Dipl.-Kfm., Steuerberater", img: "/img/team/jan-boernigen.jpg" },
  { ini: "PB", name: "Petra Börnigen", title: "Dipl.-Kffr., Steuerberaterin", img: "/img/team/petra-boernigen.jpg" },
];
// Portrait nur zeigen, wenn die Datei in public/img/team liegt – sonst Initialen als Platzhalter
const hasImage = (src: string) => existsSync(path.join(process.cwd(), "public", src));

/** Zentrierte Abschnittsüberschrift im Apple-Stil. */
function Head({
  eyebrow,
  title,
  sub,
  light,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-red">{eyebrow}</p>
      <H2 light={light} className="mt-3">
        {title}
      </H2>
      {sub && (
        <p
          className={`mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty sm:text-xl ${light ? "text-white/70" : "text-muted"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Leistungsblock: Text + Grafik, auf Desktop abwechselnd links/rechts. */
function Pillar({
  eyebrow,
  title,
  sub,
  points,
  visual,
  flip,
  tint,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  points: string[];
  visual: React.ReactNode;
  flip?: boolean;
  tint?: boolean;
}) {
  return (
    <section className={`py-16 sm:py-28 ${tint ? "bg-paper" : ""}`}>
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={flip ? "lg:order-2" : ""}>
          <p className="text-sm font-semibold text-red">{eyebrow}</p>
          <H2 className="mt-3">{title}</H2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">{sub}</p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-[17px] text-ink">
                <Check className="mt-1 size-5 shrink-0 text-red" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className={flip ? "lg:order-1" : ""}>{visual}</div>
      </Container>
    </section>
  );
}

export default function Home() {
  const avatar = hasImage(partners[0].img) ? partners[0].img : undefined;
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-paper">
          <div
            className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-red/[0.07] blur-2xl"
            aria-hidden
          />
          <Container className="relative grid gap-10 pt-10 pb-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-24">
            <div>
              <Eyebrow>Für Unternehmer ab 500.000 € Umsatz</Eyebrow>
              <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-6xl lg:text-[4.2rem]">
                Ihr Steuerberater sollte Sie anrufen. <span className="text-red">Nicht umgekehrt.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-700 sm:text-xl">
                Steuern planen. Lohn und Buchhaltung automatisieren. Die richtigen Hebel setzen – bevor Sie fragen
                müssen.
              </p>
              <div className="mt-8">
                <CtaButton className="w-full sm:w-auto">Kostenfrei meine Steuer-Hebel finden</CtaButton>
                <CtaNote />
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <AdvisorMessage avatar={avatar} />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["5×", "DATEV Digitale Kanzlei"],
                  ["30 Min.", "kostenfrei"],
                  ["3", "Hebel für Sie"],
                ].map(([a, b]) => (
                  <div key={b} className="rounded-2xl bg-white px-2 py-3 ring-1 ring-line">
                    <p className="text-xl font-semibold tracking-tight text-ink">{a}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-muted">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* TRUST */}
        <section className="border-y border-line bg-white">
          <Container className="grid grid-cols-2 gap-x-4 gap-y-5 py-7 sm:py-9 md:grid-cols-4 md:items-center">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/datev-digitale-kanzlei-2023.png"
                alt="DATEV Digitale Kanzlei 2023"
                className="size-12 shrink-0"
              />
              <p className="text-sm leading-snug text-ink-700">
                <strong className="block text-ink">5× in Folge</strong>DATEV Digitale Kanzlei
              </p>
            </div>
            {[
              ["Personio", "Expert Partner"],
              ["HRworks", "Partner"],
              ["DATEV", "SmartExpert"],
            ].map(([a, b]) => (
              <p key={a} className="text-sm leading-snug text-ink-700 md:border-l md:border-line md:pl-6">
                <strong className="block text-base text-ink">{a}</strong>
                {b}
              </p>
            ))}
          </Container>
        </section>

        {/* SELBSTTEST */}
        <section className="py-16 sm:py-28">
          <Container>
            <Head
              eyebrow="Ehrlicher Selbsttest"
              title="Kommt Ihnen das bekannt vor?"
              sub="Tippen Sie an, was auf Sie zutrifft."
            />
            <SelfCheck pains={pains} />
          </Container>
        </section>

        {/* STEUERN PLANEN – Jahresvergleich */}
        <section className="bg-paper py-16 sm:py-28">
          <Container>
            <Head
              eyebrow="Steuern"
              title="Planen statt bezahlen, was herauskommt."
              sub="Gleiches Unternehmen, gleicher Umsatz. Zwei völlig verschiedene Jahre."
            />
            <YearComparison />
            <div className="mt-10 text-center">
              <CtaButton className="w-full sm:w-auto">Option B: Steuern optimieren, bevor sie entstehen</CtaButton>
              <p className="mt-3 text-xs text-grey">Schematische Darstellung typischer Abläufe.</p>
            </div>
          </Container>
        </section>

        {/* STRUKTUR */}
        <Pillar
          eyebrow="Gestaltung & Struktur"
          title="Die richtige Struktur. Bevor es zählt."
          sub="Holding, Geschäftsführergehalt, Rechtsform: Hier entscheidet sich, was Ihnen am Ende bleibt."
          points={[
            "Gewinne in der Holding reinvestieren",
            "Geschäftsführervergütung optimal aufgestellt",
            "Verkauf und Nachfolge vorbereitet",
          ]}
          visual={<StructureDiagram />}
        />

        {/* LOHN */}
        <Pillar
          tint
          flip
          eyebrow="Lohn & HR"
          title="Lohn direkt aus Ihrem HR-System."
          sub="Ihr System liefert, wir rechnen ab. Ohne Excel. Ohne E-Mail-Pingpong."
          points={["Personio Expert Partner", "HRworks Partner", "Weitere HR-Tools angebunden"]}
          visual={<PayrollFlow />}
        />

        {/* BUCHHALTUNG */}
        <Pillar
          eyebrow="Finanzbuchhaltung"
          title="Buchhaltung ohne Abtippen."
          sub="Digitale Vorsysteme sparen Ihrer Buchhaltung Stunden. Zeit für das, was Ihr Unternehmen weiterbringt."
          points={[
            "Belege und Bankdaten fließen automatisch",
            "Zahlen monatlich aktuell",
            "Ihre Buchhaltungskraft wird entlastet",
          ]}
          visual={<BookkeepingVisual />}
        />

        {/* CFO */}
        <Pillar
          tint
          flip
          eyebrow="CFO-Service"
          title="Wir denken wie Ihr CFO."
          sub="Sie sehen jederzeit, wo Sie stehen. Wir setzen die Hebel. Sie konzentrieren sich auf Ihr Wachstum."
          points={["Liquidität und Steuerlast im Blick", "Vorschläge, bevor Sie fragen", "Fester Ansprechpartner"]}
          visual={<CfoCockpit />}
        />

        {/* STICHTAG */}
        <section className="bg-ink py-16 text-white sm:py-28">
          <Container className="text-center">
            <Head
              light
              eyebrow="Der Stichtag"
              title="Gestaltung hat ein Verfallsdatum."
              sub="Was bis zum 31.12. nicht geplant ist, wird im Abschluss nur noch festgestellt."
            />
            <div className="mt-10">
              <YearEndCountdown />
            </div>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
              {["Tantieme & GF-Gehalt", "Investitionszeitpunkt", "Ausschüttung oder Holding"].map((t, i) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-4">
                  <span className="text-sm font-semibold text-red">0{i + 1}</span>
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CtaButton className="w-full sm:w-auto">Hebel vor dem 31.12. sichern</CtaButton>
              <CtaNote light />
            </div>
          </Container>
        </section>

        {/* ANGEBOT */}
        <section className="py-16 sm:py-28">
          <Container>
            <Head
              eyebrow="Der Steuer-Hebel-Check"
              title="30 Minuten. Ihre 3 Hebel."
              sub="Kostenfrei. Ohne Wechselpflicht."
            />
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-6 shadow-[0_40px_80px_-40px_rgba(29,27,28,0.35)] ring-1 ring-line sm:p-10">
              <ol className="grid gap-6 sm:grid-cols-2">
                {offer.map(({ t, d }, i) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{t}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex gap-3 rounded-2xl bg-paper p-4 text-[15px] leading-relaxed text-ink-700">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-red" aria-hidden />
                <p>
                  <strong className="font-semibold text-ink">Ehrlichkeits-Versprechen:</strong> Sind Sie gut
                  aufgestellt, sagen wir Ihnen das. Und Sie bleiben mit gutem Gefühl bei Ihrer Kanzlei.
                </p>
              </div>
              <div className="mt-8 text-center">
                <CtaButton className="w-full sm:w-auto">Kostenfrei meine 3 Hebel erfahren</CtaButton>
                <CtaNote />
              </div>
            </div>
          </Container>
        </section>

        {/* PARTNER + STIMMEN */}
        <section className="bg-paper py-16 sm:py-28">
          <Container>
            <Head eyebrow="Ihre Steuerberater" title="Menschen. Keine Warteschleife." />
            <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-3 sm:gap-5">
              {partners.map(({ ini, name, title, img }) => (
                <figure key={name}>
                  {hasImage(img) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={`${name}, ${title}`}
                      className="aspect-[4/5] w-full rounded-3xl object-cover object-top"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-gradient-to-br from-paper-200 to-white">
                      <span className="text-5xl font-semibold text-ink/15">{ini}</span>
                    </div>
                  )}
                  <figcaption className="mt-3 text-center">
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-sm text-muted">{title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <blockquote className="mx-auto mt-10 max-w-2xl text-center text-xl leading-relaxed font-medium text-ink sm:text-2xl">
              „Wir sagen Unternehmern, was Sache ist. Und zwar bevor die Entscheidung fällt.“
            </blockquote>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {[
                "Endlich eine Kanzlei, die mitdenkt.",
                "Ein Ansprechpartner für Steuern und HR – das spart enorm Zeit.",
                "In jeder Phase begleitet – vom Start-up bis international.",
              ].map((q) => (
                <figure key={q} className="rounded-3xl bg-white p-6 ring-1 ring-line">
                  <blockquote className="text-[17px] leading-relaxed text-ink">„{q}“</blockquote>
                  <figcaption className="mt-2 text-sm text-grey">Mandant von Börnigen &amp; Partners</figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>

        {/* WECHSEL */}
        <section className="py-16 sm:py-28">
          <Container>
            <Head
              eyebrow="Wechsel"
              title="Wechseln? Erledigen wir."
              sub="Ihr Aufwand: ein Gespräch und eine Unterschrift."
            />
            <div className="mx-auto mt-10 max-w-4xl">
              <SwitchGraphic />
            </div>
          </Container>
        </section>

        {/* FÜR WEN */}
        <section className="bg-paper py-16 sm:py-24">
          <Container>
            <Head eyebrow="Nicht für jeden" title="Für Unternehmer, die wachsen." />
            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
              {[
                "Ab 500.000 € Umsatz",
                "Inhabergeführt",
                "Raum München + 150 km",
                "GmbH, Holding, Einzelunternehmen",
                "Digital – oder bereit dazu",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[15px] font-medium text-ink ring-1 ring-line"
                >
                  <Check className="size-4 text-red" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-sm text-grey">Nicht für Gastronomie, Hotellerie und Glücksspiel.</p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-28">
          <Container>
            <Head eyebrow="Fragen" title="Kurz beantwortet." />
            <div className="mx-auto mt-10 max-w-2xl divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 text-[17px] font-semibold text-ink">
                    {f.q}
                    <Plus
                      className="faq-icon mt-0.5 size-5 shrink-0 text-red transition-transform duration-200"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 pr-8 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* FINAL */}
        <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-28">
          <div
            className="pointer-events-none absolute -bottom-40 -left-40 size-[480px] rounded-full bg-red/15 blur-2xl"
            aria-hidden
          />
          <Container className="relative">
            <Head light eyebrow="Ihre Entscheidung" title="Option A oder Option B?" />
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 md:grid-cols-2">
              <div className="rounded-3xl p-6 ring-1 ring-white/15">
                <p className="text-sm font-semibold text-white/50">Option A</p>
                <p className="mt-2 text-xl font-semibold">Alles bleibt, wie es ist.</p>
                <p className="mt-2 leading-relaxed text-white/60">Und Sie erfahren nie, was möglich gewesen wäre.</p>
              </div>
              <div className="rounded-3xl bg-red p-6">
                <p className="text-sm font-semibold text-white/80">Option B</p>
                <p className="mt-2 text-xl font-semibold">30 Minuten Klarheit.</p>
                <p className="mt-2 leading-relaxed text-white/90">Ihre 3 Hebel. Kostenfrei. Dann entscheiden Sie.</p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <CtaButton variant="light" className="w-full sm:w-auto">
                Option B: Steuern planen statt bezahlen
              </CtaButton>
              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/55">
                <Lock className="size-3.5" aria-hidden />
                Vertraulich · Verschwiegenheitspflicht nach § 57 StBerG
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />

      {/* Mobile Sticky-CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <Link
          href={FUNNEL_HREF}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red py-3.5 text-[15px] font-semibold text-white"
        >
          Kostenfrei Steuer-Hebel finden
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}
