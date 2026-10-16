import { AlertTriangle, Check } from "lucide-react";

/*
 * „Zwei Jahre“ – dasselbe Unternehmen, einmal mit verwaltender Kanzlei, einmal mit Gestaltung.
 * Liquiditätskurven sind schematisch (keine Beträge, § 57a StBerG), die Ereignisse typische Abläufe.
 * Diagramm bewusst schmal (viewBox 620 breit) und mit großer Schrift, damit es auf dem Smartphone lesbar bleibt.
 */

const X0 = 28;
const STEP = 48;
const x = (m: number) => X0 + m * STEP; // m = Monat 0–11 (Bruchteile erlaubt)
const Y = (v: number) => Math.round(50 + (v - 55) * 1.6); // Werte 55–175 → 50–242
const AXIS = 252;
const TICKS: [number, string][] = [
  [0, "Jan"],
  [3, "Apr"],
  [6, "Jul"],
  [9, "Okt"],
];

type Event = { m: number; y: number; t: string; d: string; alert?: boolean };
type Lane = {
  key: string;
  label: string;
  title: string;
  scene: string;
  line: [number, number][];
  events: Event[];
  old: boolean;
  closing: string;
};

const lanes: Lane[] = [
  {
    key: "alt",
    label: "Option A",
    title: "Steuerberater, der nur bucht",
    scene: "Donnerstag, 7:40 Uhr. Ein Brief vom Finanzamt: Nachzahlung. Ihre Kanzlei? Im Urlaub.",
    line: [
      [0, 150],
      [3, 126],
      [6, 103],
      [9, 82],
      [10.15, 78],
      [10.35, 172],
      [11, 168],
    ],
    events: [
      { m: 4, y: 118, t: "Mai", d: "Die BWA kommt – zu spät für Entscheidungen." },
      { m: 10.25, y: 125, t: "November", d: "Nachzahlung plus höhere Vorauszahlungen.", alert: true },
      { m: 11.2, y: 167, t: "31.12.", d: "Niemand hat angerufen. Die Steuervorteile sind verfallen.", alert: true },
    ],
    old: true,
    closing: "Sie bezahlen, was herauskommt.",
  },
  {
    key: "neu",
    label: "Option B",
    title: "Steuerberater, der vorausdenkt",
    scene: "14. November. Ihr Berater meldet sich: „Mit zwei Maßnahmen vor dem 31.12. sparen Sie noch Steuern.“",
    line: [
      [0, 150],
      [2, 130],
      [2.15, 138],
      [5, 106],
      [5.15, 114],
      [8, 82],
      [8.15, 90],
      [11, 58],
      [11.15, 64],
    ],
    events: [
      { m: 1, y: 140, t: "Jeden Monat", d: "Zahlen aktuell. Sie sehen, wo Sie stehen." },
      { m: 5.7, y: 107, t: "Juni", d: "Steuerlast hochgerechnet. Keine Überraschung." },
      { m: 10.4, y: 65, t: "November", d: "Alles geregelt: Tantieme, Investition, Ausschüttung." },
    ],
    old: false,
    closing: "Sie planen, was Sie zahlen.",
  },
];

const linePath = (pts: [number, number][]) =>
  pts.map(([m, v], i) => `${i === 0 ? "M" : "L"}${x(m).toFixed(1)},${Y(v)}`).join(" ");

function Chart({ lane }: { lane: Lane }) {
  const d = linePath(lane.line);
  const last = lane.line[lane.line.length - 1];
  const area = `${d} L${x(last[0])},${AXIS} L${x(lane.line[0][0])},${AXIS} Z`;
  const stroke = lane.old ? "#94989a" : "#1d1b1c";
  const tint = lane.old ? "#94989a" : "#e31536";
  const gid = `grad-${lane.key}`;
  const deadline = x(11.85);
  return (
    <svg
      viewBox="0 0 620 285"
      className="h-auto w-full"
      role="img"
      aria-label={`Schematischer Liquiditätsverlauf – ${lane.title}`}
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity={lane.old ? 0.18 : 0.16} />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </linearGradient>
      </defs>
      {TICKS.map(([m, label]) => (
        <g key={label}>
          <line x1={x(m)} x2={x(m)} y1="30" y2={AXIS} stroke="#e6e1db" strokeDasharray="3 7" />
          <text x={x(m)} y="280" textAnchor="middle" fontSize="22" fill="#94989a" fontFamily="var(--font-sans)">
            {label}
          </text>
        </g>
      ))}
      <line x1={X0 - 10} x2="612" y1={AXIS} y2={AXIS} stroke="#e6e1db" />
      <line x1={deadline} x2={deadline} y1="22" y2={AXIS} stroke="#e31536" strokeWidth="2" strokeDasharray="5 5" />
      <text
        x={deadline}
        y="280"
        textAnchor="end"
        fontSize="22"
        fontWeight="600"
        fill="#e31536"
        fontFamily="var(--font-sans)"
      >
        31.12.
      </text>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      {lane.old && (
        <path
          d={`M${x(10.15)},${Y(78)} L${x(10.35)},${Y(172)}`}
          stroke="#e31536"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}
      {lane.events.map((e, i) => (
        <g key={e.t}>
          <circle
            cx={x(e.m)}
            cy={Y(e.y)}
            r="17"
            fill={e.alert ? "#e31536" : lane.old ? "#fff" : "#1d1b1c"}
            stroke={e.alert ? "#e31536" : stroke}
            strokeWidth="3"
          />
          <text
            x={x(e.m)}
            y={Y(e.y) + 7}
            textAnchor="middle"
            fontSize="19"
            fontWeight="700"
            fill={e.alert || !lane.old ? "#fff" : "#5f5a57"}
            fontFamily="var(--font-sans)"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function YearComparison() {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-6">
      {lanes.map((lane) => (
        <article
          key={lane.key}
          className={`flex flex-col overflow-hidden rounded-3xl ${lane.old ? "bg-white ring-1 ring-line" : "bg-white shadow-[0_40px_80px_-40px_rgba(29,27,28,0.45)] ring-2 ring-ink"}`}
        >
          <header className={`flex flex-col gap-0.5 px-5 py-4 sm:px-6 ${lane.old ? "bg-paper" : "bg-ink text-white"}`}>
            <span
              className={`text-xs font-semibold tracking-[0.14em] uppercase ${lane.old ? "text-grey" : "text-red"}`}
            >
              {lane.label}
            </span>
            <h3 className="text-lg font-semibold">{lane.title}</h3>
          </header>
          <div className="px-5 pt-5 sm:px-6">
            <p className="text-[17px] leading-relaxed text-ink-700 italic">{lane.scene}</p>
            <div className="mt-4">
              <Chart lane={lane} />
            </div>
          </div>
          <ol className="mt-2 flex-1 space-y-3 px-5 pb-5 sm:px-6">
            {lane.events.map((e, i) => (
              <li key={e.t} className="flex gap-3">
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${e.alert ? "bg-red text-white" : lane.old ? "ring-2 ring-grey text-muted" : "bg-ink text-white"}`}
                >
                  {i + 1}
                </span>
                <p className="text-[15px] leading-snug">
                  <strong className={`font-semibold ${e.alert ? "text-red" : "text-ink"}`}>{e.t}:</strong>{" "}
                  <span className="text-muted">{e.d}</span>
                </p>
              </li>
            ))}
          </ol>
          <p
            className={`flex items-center gap-2.5 px-5 py-4 text-[17px] font-semibold sm:px-6 ${lane.old ? "bg-paper text-ink" : "bg-ink text-white"}`}
          >
            {lane.old ? (
              <AlertTriangle className="size-5 shrink-0 text-red" aria-hidden />
            ) : (
              <Check className="size-5 shrink-0 text-red" aria-hidden />
            )}
            {lane.closing}
          </p>
        </article>
      ))}
    </div>
  );
}
