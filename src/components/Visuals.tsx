import {
  ArrowDown,
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  CheckCheck,
  FileSpreadsheet,
  Landmark,
  Mail,
  Receipt,
  RefreshCcw,
  Smartphone,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";

/*
 * Grafiken der Landingpage – reines HTML/SVG, mobil zuerst gebaut.
 * Keine Euro-Beträge, keine Erfolgsversprechen (§ 57a StBerG); Abläufe sind schematisch.
 */

/** Hero: So fühlt sich proaktive Beratung an – eine (beispielhafte) Nachricht des Beraters im November. */
export function AdvisorMessage({ avatar }: { avatar?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_24px_50px_-20px_rgba(29,27,28,0.35)] sm:p-5">
      <div className="flex items-center gap-3">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="size-10 rounded-full object-cover object-top" />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            JB
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Ihr Steuerberater</p>
          <p className="text-xs text-grey">14. Nov., 9:12</p>
        </div>
        <span className="rounded-full bg-red px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          Neu
        </span>
      </div>
      <p className="mt-3 rounded-2xl rounded-tl-sm bg-paper p-3.5 text-[15px] leading-relaxed text-ink">
        Ihre Hochrechnung ist fertig. <strong className="font-semibold">Zwei Hebel</strong> sollten wir vor dem 31.12.
        noch ziehen. Passt Ihnen Donnerstag?
      </p>
      <p className="mt-2 flex items-center justify-end gap-1 text-[11px] text-grey">
        Gelesen <CheckCheck className="size-3.5 text-red" aria-hidden />
      </p>
    </div>
  );
}

/* ---------- Lohn: aus dem HR-System direkt in die Abrechnung ---------- */

const HR_TOOLS: { name: string; badge?: string }[] = [
  { name: "Personio", badge: "Expert Partner" },
  { name: "HRworks", badge: "Partner" },
  { name: "Zeiterfassung" },
  { name: "Recruiting" },
];

export function PayrollFlow() {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_30px_60px_-35px_rgba(29,27,28,0.35)] ring-1 ring-line sm:p-8">
      <div className="grid gap-4">
        {/* Quelle */}
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-grey uppercase">Ihre HR-Systeme</p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {HR_TOOLS.map((t) => (
              <li key={t.name} className="rounded-xl bg-paper px-3 py-3">
                <p className="text-[15px] font-semibold text-ink">{t.name}</p>
                {t.badge ? (
                  <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-red uppercase">{t.badge}</p>
                ) : (
                  <p className="mt-0.5 text-[11px] text-grey">angebunden</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Verbindung */}
        <div className="flex flex-col items-center justify-center">
          <span className="h-5 w-px bg-gradient-to-b from-line to-red" />
          <span className="flex items-center gap-1.5 rounded-full bg-red px-3 py-1.5 text-xs font-semibold text-white">
            <RefreshCcw className="size-3.5" aria-hidden /> automatisch
          </span>
          <span className="h-5 w-px bg-gradient-to-b from-red to-line" />
        </div>
        {/* Ergebnis */}
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Lohnabrechnung</p>
          <ul className="mt-3 space-y-2.5 text-[15px]">
            {["Daten direkt aus dem System", "Kein Abtippen, keine Excel-Listen", "Pünktlich, jeden Monat"].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-red" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Vorher */}
      <div className="mt-6 border-t border-line pt-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-grey uppercase">Bisher</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[
            { i: FileSpreadsheet, t: "Excel-Liste" },
            { i: Mail, t: "E-Mail" },
            { i: Mail, t: "Rückfrage" },
            { i: Receipt, t: "Abtippen" },
            { i: RefreshCcw, t: "Korrektur" },
          ].map(({ i: Icon, t }) => (
            <li
              key={t}
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-grey line-through decoration-red/70"
            >
              <Icon className="size-3.5" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Buchhaltung: Arbeitstag der Buchhaltungskraft vorher/nachher ---------- */

const DAY_BEFORE = [
  { t: "Suchen", w: 24 },
  { t: "Abtippen", w: 30 },
  { t: "Rückfragen", w: 26 },
  { t: "Mehrwert", w: 20, good: true },
];
const DAY_AFTER = [
  { t: "Prüfen", w: 20 },
  { t: "Mehrwert: Controlling, Forderungen, Projekte", w: 80, good: true },
];

function DayBar({ parts, label }: { parts: { t: string; w: number; good?: boolean }[]; label: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2 flex h-12 overflow-hidden rounded-xl text-[11px] font-semibold sm:h-14 sm:text-xs">
        {parts.map((p) => (
          <div
            key={p.t}
            style={{ width: `${p.w}%` }}
            className={`flex items-center justify-center border-r border-white/60 px-1 text-center leading-tight last:border-r-0 ${p.good ? "bg-red text-white" : "bg-paper-200 text-muted"}`}
          >
            <span className="line-clamp-2">{p.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BookkeepingVisual() {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_30px_60px_-35px_rgba(29,27,28,0.35)] ring-1 ring-line sm:p-8">
      {/* Vorsysteme */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { i: Landmark, t: "Bankkonten" },
          { i: Smartphone, t: "Beleg-App" },
          { i: Mail, t: "E-Rechnungen" },
          { i: Building2, t: "Ihre Vorsysteme" },
        ].map(({ i: Icon, t }) => (
          <span
            key={t}
            className="flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-sm font-medium text-ink"
          >
            <Icon className="size-4 text-red" aria-hidden />
            {t}
          </span>
        ))}
        <ArrowRight className="hidden size-4 text-grey sm:block" aria-hidden />
        <ArrowDown className="size-4 text-grey sm:hidden" aria-hidden />
        <span className="rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white">
          DATEV Unternehmen online
        </span>
      </div>
      <div className="mt-7 space-y-5">
        <DayBar label="Ein Arbeitstag Ihrer Buchhaltung – bisher" parts={DAY_BEFORE} />
        <DayBar label="Mit digitalen Vorsystemen" parts={DAY_AFTER} />
      </div>
      <p className="mt-4 text-xs text-grey">Schematische Darstellung.</p>
    </div>
  );
}

/* ---------- CFO-Cockpit: was Sie jederzeit sehen ---------- */

export function CfoCockpit() {
  const spark = [42, 46, 44, 52, 55, 53, 61, 64, 62, 70, 74, 79];
  const max = 85;
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
  return (
    <div className="rounded-3xl bg-ink p-4 text-white shadow-[0_40px_80px_-40px_rgba(29,27,28,0.7)] sm:p-6">
      <div className="flex items-center justify-between px-1 pb-4">
        <p className="text-sm font-semibold">Ihr Unternehmens-Cockpit</p>
        <span className="flex items-center gap-1.5 text-xs text-white/50">
          <span className="size-2 rounded-full bg-emerald-400" /> live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-2xl bg-white/[0.06] p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-white/60">Liquidität</p>
            <p className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <TrendingUp className="size-3.5" aria-hidden /> planbar
            </p>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-2 h-16 w-full" aria-hidden>
            <defs>
              <linearGradient id="cfo-g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#e31536" stopOpacity="0.45" />
                <stop offset="1" stopColor="#e31536" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${pts} 100,100`} fill="url(#cfo-g)" />
            <polyline points={pts} fill="none" stroke="#e31536" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="rounded-2xl bg-white/[0.06] p-4">
          <p className="text-xs text-white/60">Steuerlast {new Date().getFullYear()}</p>
          <p className="mt-1 text-lg font-semibold">hochgerechnet</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-red" />
          </div>
          <p className="mt-2 text-[11px] text-white/50">Vorauszahlungen angepasst</p>
        </div>
        <div className="rounded-2xl bg-white/[0.06] p-4">
          <p className="text-xs text-white/60">Nächster Termin</p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold">
            <CalendarCheck className="size-4 text-red" aria-hidden /> Do, 10:00
          </p>
          <p className="mt-2 text-[11px] text-white/50">Quartalsgespräch</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-white p-4 text-ink">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-red">
            <Sparkles className="size-3.5" aria-hidden /> Vorschläge Ihres Beraters
          </p>
          <ul className="mt-3 space-y-2.5 text-sm">
            {[
              { t: "Tantieme festlegen", d: "bis 15.12.", done: true },
              { t: "Investition vorziehen", d: "bis 31.12.", done: false },
              { t: "Holding prüfen", d: "Q1", done: false },
            ].map((h) => (
              <li key={h.t} className="flex items-center gap-3">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md ${h.done ? "bg-red text-white" : "ring-2 ring-line"}`}
                >
                  {h.done && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                </span>
                <span className={`flex-1 font-medium ${h.done ? "text-grey line-through" : ""}`}>{h.t}</span>
                <span className="text-xs text-grey">{h.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Struktur: Holding-Modell ---------- */

function Node({ icon: Icon, t, d, dark }: { icon: typeof User; t: string; d: string; dark?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${dark ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}
    >
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${dark ? "bg-red" : "bg-paper"}`}>
        <Icon className={`size-4 ${dark ? "text-white" : "text-red"}`} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold">{t}</p>
        <p className={`text-xs ${dark ? "text-white/60" : "text-grey"}`}>{d}</p>
      </div>
    </div>
  );
}

const Connector = () => <div className="mx-auto h-6 w-px bg-line" aria-hidden />;

export function StructureDiagram() {
  return (
    <div className="rounded-3xl bg-paper p-5 sm:p-8">
      <div className="mx-auto max-w-sm">
        <Node icon={User} t="Sie" d="Gesellschafter" />
        <Connector />
        <Node icon={Building2} t="Holding GmbH" d="Gewinne sammeln & reinvestieren" dark />
        <div className="relative mx-auto h-6 w-1/2" aria-hidden>
          <span className="absolute top-0 left-1/2 h-3 w-px bg-line" />
          <span className="absolute top-3 right-0 left-0 h-px bg-line" />
          <span className="absolute top-3 left-0 h-3 w-px bg-line" />
          <span className="absolute top-3 right-0 h-3 w-px bg-line" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white px-3 py-3 text-center ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">Operative GmbH</p>
            <p className="text-[11px] text-grey">Ihr Geschäft</p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-3 text-center ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">Beteiligung</p>
            <p className="text-[11px] text-grey">Immobilie, Neues</p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-relaxed text-grey">
        Beispielstruktur. Ob sie zu Ihnen passt, klären wir im Gespräch.
      </p>
    </div>
  );
}

/** Wechsel-Grafik: Wer macht was – Ihr Teil vs. unser Teil. */
export function SwitchGraphic() {
  const ours = [
    "Kündigung bei Ihrer Kanzlei",
    "Übernahme der DATEV-Daten",
    "Buchhaltung & Lohnhistorie",
    "Laufende Fristen",
    "Abstimmung mit dem Finanzamt",
    "Einrichtung Ihrer Tools",
  ];
  return (
    <div className="grid gap-3 md:grid-cols-[0.8fr_1.4fr] md:gap-5">
      <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line sm:p-7">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Ihr Teil</p>
        <div className="mt-5 flex flex-1 flex-col justify-end gap-2">
          {["2 Minuten Vorab-Check", "30 Minuten Gespräch", "Eine Unterschrift"].map((t) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3 text-[15px] font-medium text-ink"
            >
              <Check className="size-4 shrink-0 text-red" aria-hidden />
              {t}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col rounded-3xl bg-ink p-6 text-white sm:p-7">
        <p className="text-xs font-semibold tracking-[0.16em] text-red uppercase">Unser Teil</p>
        <div className="mt-5 grid flex-1 grid-cols-2 gap-2">
          {ours.map((t) => (
            <div key={t} className="flex items-start gap-2 rounded-xl bg-white/[0.06] px-3 py-3 text-sm sm:text-[15px]">
              <Check className="mt-0.5 size-4 shrink-0 text-red" aria-hidden />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
