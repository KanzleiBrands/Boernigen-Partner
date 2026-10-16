import { AlertTriangle, Check } from "lucide-react";

/*
 * „Zwei Jahre“ – dasselbe Unternehmen, einmal mit verwaltender Kanzlei, einmal mit Gestaltung.
 * Liquiditätskurven sind schematisch (keine Beträge, § 57a StBerG), die Ereignisse typische Abläufe.
 */

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const X0 = 45;
const STEP = 96;
const x = (m: number) => X0 + m * STEP; // m = Monat 0–11 (Bruchteile erlaubt)
const Y = (v: number) => Math.round(44 + (v - 55) * 1.38); // Werte 55–175 → 44–210, oben Platz fürs Stichtag-Label

type Event = { m: number; y: number; t: string; d: string; alert?: boolean };

const lanes: {
  key: string;
  label: string;
  title: string;
  scene: string;
  line: [number, number][];
  events: Event[];
  tone: "old" | "new";
  closing: string;
}[] = [
  {
    key: "alt",
    label: "Jahr A",
    title: "Mit einer Kanzlei, die verwaltet",
    scene:
      "Donnerstag, 7:40 Uhr. Auf Ihrem Schreibtisch liegt ein Brief vom Finanzamt. Nachzahlung. Darunter die neuen Vorauszahlungen – ab sofort jedes Quartal. Sie rufen Ihre Kanzlei an. Der Sachbearbeiter ist im Urlaub.",
    line: [
      [0, 150],
      [1, 142],
      [2, 134],
      [3, 126],
      [4, 118],
      [5, 110],
      [6, 103],
      [7, 96],
      [8, 89],
      [9, 82],
      [10.15, 78],
      [10.35, 172],
      [11, 168],
    ],
    events: [
      {
        m: 1,
        y: 142,
        t: "Februar",
        d: "Belege-Ordner gehen zur Kanzlei. Wie jedes Jahr.",
      },
      {
        m: 4,
        y: 118,
        t: "Mai",
        d: "Die BWA für Februar kommt. Zu spät für jede Entscheidung.",
      },
      {
        m: 8,
        y: 89,
        t: "September",
        d: "Der Abschluss fürs Vorjahr ist fertig. Ein Gestaltungsvorschlag: keiner.",
      },
      {
        m: 10.35,
        y: 172,
        t: "November",
        d: "Steuerbescheid: Nachzahlung plus höhere Vorauszahlungen. Liquidität weg.",
        alert: true,
      },
      {
        m: 11.0,
        y: 168,
        t: "31. Dezember",
        d: "Das Jahr endet. Niemand hat angerufen. Die Hebel für dieses Jahr sind verfallen.",
        alert: true,
      },
    ],
    tone: "old",
    closing: "Ergebnis: Sie haben bezahlt, was herauskam – und erfahren nie, was möglich gewesen wäre.",
  },
  {
    key: "neu",
    label: "Jahr B",
    title: "Mit Börnigen & Partners",
    scene:
      "14. November, 9:12 Uhr. Eine Nachricht Ihres Beraters: „Ihre Hochrechnung ist fertig. Zwei Hebel sollten wir vor dem 31.12. noch ziehen. Passt Ihnen Donnerstag?“ Sie sagen zu. 30 Minuten später ist entschieden.",
    line: [
      [0, 150],
      [1, 140],
      [2, 130],
      [2.15, 138],
      [3, 126],
      [4, 116],
      [5, 106],
      [5.15, 114],
      [6, 102],
      [7, 92],
      [8, 82],
      [8.15, 90],
      [9, 78],
      [10, 68],
      [11, 58],
      [11.15, 64],
    ],
    events: [
      {
        m: 0.6,
        y: 145,
        t: "Jeden Monat",
        d: "Zahlen aktuell in DATEV. Sie sehen, wo Sie stehen – jederzeit.",
      },
      {
        m: 5.6,
        y: 108,
        t: "Juni",
        d: "Halbjahres-Hochrechnung: Ihre Steuerlast fürs Jahr ist absehbar.",
      },
      {
        m: 8.6,
        y: 86,
        t: "September",
        d: "Vorauszahlungen werden vorausschauend angepasst. Keine Überraschung.",
      },
      {
        m: 10.4,
        y: 64,
        t: "November",
        d: "Hebel-Termin: Tantieme, Investitionszeitpunkt, Ausschüttung – festgelegt.",
      },
      {
        m: 11.0,
        y: 58,
        t: "31. Dezember",
        d: "Sie gehen mit einem klaren Plan ins neue Jahr. Und wissen, was kommt.",
      },
    ],
    tone: "new",
    closing: "Ergebnis: Ihre Steuerlast wurde geplant, bevor sie entstand. Und Sie hatten jederzeit die Kontrolle.",
  },
];

const smoothPath = (pts: [number, number][]) =>
  pts.map(([m, y], i) => `${i === 0 ? "M" : "L"}${x(m).toFixed(1)},${Y(y)}`).join(" ");

function Chart({ lane }: { lane: (typeof lanes)[number] }) {
  const old = lane.tone === "old";
  const d = smoothPath(lane.line);
  const last = lane.line[lane.line.length - 1];
  const area = `${d} L${x(last[0])},215 L${x(lane.line[0][0])},215 Z`;
  const stroke = old ? "#94989a" : "#1d1b1c";
  const gid = `grad-${lane.key}`;
  return (
    <svg
      viewBox="0 0 1200 250"
      className="h-auto w-full"
      role="img"
      aria-label={`Schematischer Liquiditätsverlauf – ${lane.title}`}
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={old ? "#94989a" : "#e31536"} stopOpacity={old ? 0.18 : 0.14} />
          <stop offset="1" stopColor={old ? "#94989a" : "#e31536"} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Raster */}
      {MONTHS.map((mo, i) => (
        <g key={mo}>
          <line x1={x(i)} x2={x(i)} y1="20" y2="215" stroke="#e6e1db" strokeDasharray="2 6" />
          <text x={x(i)} y="242" textAnchor="middle" fontSize="18" fill="#94989a" fontFamily="var(--font-sans)">
            {mo}
          </text>
        </g>
      ))}
      <line x1={X0 - 10} x2="1190" y1="215" y2="215" stroke="#e6e1db" />
      {/* Stichtag */}
      <line x1={x(11.85)} x2={x(11.85)} y1="14" y2="215" stroke="#e31536" strokeWidth="1.5" strokeDasharray="4 4" />
      <text
        x={x(11.85) - 8}
        y="22"
        textAnchor="end"
        fontSize="17"
        fontWeight="600"
        fill="#e31536"
        fontFamily="var(--font-sans)"
      >
        31.12.
      </text>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      {old && (
        // Absturz hervorheben
        <path d={`M${x(10.15)},${Y(78)} L${x(10.35)},${Y(172)}`} stroke="#e31536" strokeWidth="5" strokeLinecap="round" />
      )}
      {lane.events.map((e, i) => (
        <g key={e.t}>
          <circle
            cx={x(e.m)}
            cy={Y(e.y)}
            r="17"
            fill={e.alert ? "#e31536" : old ? "#fff" : "#1d1b1c"}
            stroke={e.alert ? "#e31536" : stroke}
            strokeWidth="2.5"
          />
          <text
            x={x(e.m)}
            y={Y(e.y) + 6}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill={e.alert || !old ? "#fff" : "#5f5a57"}
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
    <div className="mt-14 space-y-6">
      {lanes.map((lane) => {
        const old = lane.tone === "old";
        return (
          <article
            key={lane.key}
            className={`overflow-hidden rounded-sm border ${old ? "border-line bg-white" : "border-ink bg-white shadow-[0_30px_60px_-35px_rgba(29,27,28,0.45)]"}`}
          >
            <header
              className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4 sm:px-8 ${old ? "bg-paper" : "bg-ink text-white"}`}
            >
              <span className={`text-xs font-semibold tracking-[0.16em] uppercase ${old ? "text-muted" : "text-red"}`}>
                {lane.label}
              </span>
              <h3 className="text-lg font-semibold">{lane.title}</h3>
            </header>
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_2fr] lg:items-center">
              <div>
                <p className="font-serif text-xl leading-relaxed text-ink italic">„{lane.scene}“</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-grey uppercase">
                  Ihre Liquidität im Jahresverlauf (schematisch)
                </p>
                <Chart lane={lane} />
              </div>
            </div>
            <ol className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
              {lane.events.map((e, i) => (
                <li key={e.t} className={`flex gap-3 p-5 ${e.alert ? "bg-red-50" : "bg-white"}`}>
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${e.alert ? "bg-red text-white" : old ? "border-2 border-grey text-muted" : "bg-ink text-white"}`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${e.alert ? "text-red" : "text-ink"}`}>{e.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{e.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p
              className={`flex items-start gap-3 px-6 py-5 text-[15px] font-semibold sm:px-8 ${old ? "bg-paper text-ink-700" : "bg-ink text-white"}`}
            >
              {old ? (
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red" aria-hidden />
              ) : (
                <Check className="mt-0.5 size-5 shrink-0 text-red" aria-hidden />
              )}
              {lane.closing}
            </p>
          </article>
        );
      })}
    </div>
  );
}
