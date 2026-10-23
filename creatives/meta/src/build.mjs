// Rendert die Meta-Creatives (5 Angles × Feed 4:5 + Story 9:16) als PNG nach creatives/meta/.
// Aufruf: node creatives/meta/src/build.mjs  (Playwright global + Chromium unter /opt/pw-browsers)
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));

const SRC = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(SRC, "..");
const A = (f) => `file://${SRC}/assets/${f}`;

const FORMATS = {
  feed: { w: 1080, h: 1350, top: 72, bottom: 72 },
  // Story: oben ~250 px (Profil/Fortschritt) und unten ~340 px (CTA-Sticker) frei halten
  story: { w: 1080, h: 1920, top: 250, bottom: 340 },
};

const BASE_CSS = `
@font-face { font-family: Inter; src: url(${A("inter-latin-wght-normal.woff2")}) format("woff2"); font-weight: 100 900; }
@font-face { font-family: Inter; src: url(${A("inter-latin-ext-wght-normal.woff2")}) format("woff2"); font-weight: 100 900;
  unicode-range: U+0100-02AF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
:root { --red:#e31536; --ink:#1d1b1c; --paper:#f7f5f2; --line:#e6e1db; --muted:#5f5a57; --grey:#94989a; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: var(--w); height: var(--h); overflow: hidden; }
body { font-family: Inter, sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
.frame { position: relative; width: var(--w); height: var(--h); padding: var(--top) 80px var(--bottom); display: flex; flex-direction: column; }
.logo { height: 60px; width: auto; display: block; align-self: flex-start; }
.frame > * { flex-shrink: 0; }
h1, p { text-wrap: balance; }
h1 { font-weight: 800; letter-spacing: -0.035em; line-height: 1.02; }
.eyebrow { font-size: 26px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.cta { display: inline-flex; align-items: center; gap: 18px; background: var(--red); color: #fff; font-weight: 700;
  font-size: 34px; padding: 26px 40px; border-radius: 999px; letter-spacing: -0.01em; }
.cta .arr { font-size: 36px; }
.fine { font-size: 25px; font-weight: 500; }
.chip { display: inline-flex; align-items: center; gap: 14px; border-radius: 999px; padding: 16px 26px; font-size: 28px; font-weight: 600; }
.check { width: 40px; height: 40px; border-radius: 50%; display: inline-grid; place-items: center; flex: none; }
.spacer { flex: 1; }
`;

const tick = (c = "#fff") =>
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

const footer = ({ dark = false, cta = "Kostenloses Erstgespräch sichern", fine, lead } = {}) => `
  <div style="display:flex; flex-direction:column; align-items:flex-start; gap:22px">
    ${lead ? `<div style="font-size:32px; font-weight:700; letter-spacing:-0.01em; margin-bottom:-4px">${lead}</div>` : ""}
    <div class="cta">${cta} <span class="arr">→</span></div>
    <div class="fine" style="color:${dark ? "rgba(255,255,255,.72)" : "var(--muted)"}">${fine ?? "20 Minuten · unverbindlich · für Unternehmer ab 500.000 € Umsatz"}</div>
  </div>`;

// ---------- 1 · Realtalk: „Der letzte Vorschlag“ ----------
function c1(f) {
  const v = (a, b) => (f === "story" ? b : a);
  const msgs = [
    ["14. März", "Bitte reichen Sie die Belege für das 4. Quartal nach."],
    ["28. Juli", "Anbei Ihr Jahresabschluss zur Unterschrift."],
    ["2. Oktober", "Ihre Rechnung für das 3. Quartal."],
  ];
  return `
  <div class="frame" style="background:var(--paper)">
    <img class="logo" src="${A("logo.svg")}">
    <h1 style="font-size:${v(74, 78)}px; margin-top:${v(44, 50)}px">
      Wann hat Ihr Steuerberater Ihnen zuletzt etwas <span style="color:var(--red)">vorgeschlagen?</span>
    </h1>
    <div style="margin-top:${v(44, 60)}px; background:#fff; border:2px solid var(--line); border-radius:36px; padding:${v("26px 32px 34px", "32px 36px 40px")}; box-shadow:0 30px 60px -30px rgba(29,27,28,.25); position:relative">
      <div style="display:flex; align-items:center; gap:20px; padding-bottom:22px; border-bottom:2px solid var(--line)">
        <div style="width:64px; height:64px; border-radius:50%; background:#dcd7d1; display:grid; place-items:center; font-weight:700; font-size:26px; color:#7d7772">StB</div>
        <div><div style="font-size:30px; font-weight:700">Ihr Steuerbüro</div><div style="font-size:23px; color:var(--grey)">E-Mails an Sie, dieses Jahr</div></div>
      </div>
      <div style="display:flex; flex-direction:column; gap:${v(16, 22)}px; margin-top:22px">
        ${msgs
          .map(
            ([d, t]) => `
          <div>
            <div style="font-size:21px; color:var(--grey); font-weight:600; margin:0 0 8px 6px">${d}</div>
            <div style="display:inline-block; background:#efece8; border-radius:24px 24px 24px 8px; padding:${v("18px 24px", "20px 26px")}; font-size:${v(27, 29)}px; line-height:1.3">${t}</div>
          </div>`,
          )
          .join("")}
      </div>
      <div style="position:absolute; right:28px; bottom:-42px; transform:rotate(-4deg); background:var(--red); color:#fff; font-weight:800; font-size:${v(32, 36)}px; padding:18px 30px; border-radius:16px; box-shadow:0 16px 30px -12px rgba(227,21,54,.6)">
        Kein einziger Vorschlag.
      </div>
    </div>
    ${v("", `<p style="font-size:38px; line-height:1.3; font-weight:500; color:var(--muted); margin-top:70px">Wir melden uns, <b style="color:var(--ink)">bevor</b> es zu spät ist.</p>`)}
    <div class="spacer"></div>
    ${footer()}
  </div>`;
}

// ---------- 2 · Agitation: „Die Nachzahlung“ ----------
function c2(f) {
  const v = (a, b) => (f === "story" ? b : a);
  const row = (label, w, hi = false) => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:${v(16, 20)}px 0; border-bottom:2px dashed #e4e0da">
      <span style="font-size:27px; color:${hi ? "var(--ink)" : "#6e6964"}; font-weight:${hi ? 700 : 500}">${label}</span>
      <span style="display:inline-block; width:${w}px; height:26px; border-radius:6px; background:${hi ? "rgba(227,21,54,.85)" : "#cfcac4"}; filter:blur(${hi ? 4 : 3}px)"></span>
    </div>`;
  return `
  <div class="frame" style="background:radial-gradient(120% 80% at 80% 0%, #2d2a2b 0%, var(--ink) 55%); color:#fff">
    <img class="logo" src="${A("logo-white.svg")}">
    <h1 style="font-size:${v(84, 90)}px; margin-top:${v(48, 64)}px">Die Nachzahlung ist nicht das Problem.</h1>
    <p style="font-size:${v(44, 48)}px; font-weight:700; letter-spacing:-0.02em; line-height:1.15; color:var(--red); margin-top:22px">
      Sondern, dass Sie niemand vorher gewarnt hat.
    </p>
    <div style="position:relative; margin-top:${v(56, 90)}px; align-self:center; width:${v(800, 860)}px">
      <div style="position:absolute; inset:0; background:#fff; border-radius:10px; transform:rotate(3.5deg) translate(18px, 10px); opacity:.25"></div>
      <div style="position:relative; background:#fbfaf8; color:var(--ink); border-radius:10px; padding:${v("40px 48px 44px", "50px 54px 54px")}; transform:rotate(-2deg); box-shadow:0 40px 80px -30px rgba(0,0,0,.7)">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div>
            <div style="font-size:22px; color:#8a857f; font-weight:600; letter-spacing:.06em; text-transform:uppercase">Steuerbescheid</div>
            <div style="font-size:34px; font-weight:800; margin-top:6px; letter-spacing:-0.01em">Körperschaftsteuer · Gewerbesteuer</div>
          </div>
          <div style="width:74px; height:74px; border-radius:50%; border:3px solid #cfcac4"></div>
        </div>
        <div style="margin-top:${v(20, 28)}px">${row("Festgesetzte Steuer", 210)}${row("Bereits gezahlt", 170)}${row("Nachzahlung", 240, true)}</div>
        <div style="margin-top:24px; display:inline-flex; align-items:center; gap:12px; background:rgba(227,21,54,.1); color:var(--red); font-weight:700; font-size:27px; padding:14px 22px; border-radius:12px">
          ↑ Vorauszahlungen ab sofort erhöht
        </div>
      </div>
    </div>
    <div class="spacer"></div>
    ${footer({ dark: true, cta: "Nächstes Jahr vorher Bescheid wissen" })}
  </div>`;
}

// ---------- 3 · Zeitdruck: „31. Dezember“ ----------
function c3(f) {
  const story = f === "story";
  const v = (a, b) => (story ? b : a);
  const items = ["Geschäftsführergehalt & Tantieme", "Investitionen vorziehen", "Gewinnverwendung planen"];
  const cal = `
    <div style="position:relative; width:${v(380, 370)}px; flex:none">
      <div style="position:absolute; inset:0; background:#fff; border-radius:28px; transform:rotate(6deg) translate(16px,8px); opacity:.25"></div>
      <div style="position:relative; background:#fff; border-radius:28px; overflow:hidden; transform:rotate(-3deg); box-shadow:0 40px 70px -28px rgba(80,0,10,.6)">
        <div style="background:var(--ink); color:#fff; text-align:center; font-weight:700; font-size:${v(34, 36)}px; padding:${v(16, 18)}px 0; letter-spacing:.02em">Dezember</div>
        <div style="text-align:center; font-weight:800; font-size:${v(220, 210)}px; line-height:1; letter-spacing:-0.06em; color:var(--red); padding:18px 0 6px">31</div>
        <div style="text-align:center; font-size:${v(25, 27)}px; color:var(--muted); font-weight:600; padding-bottom:24px">Letzter Tag im Steuerjahr</div>
      </div>
    </div>`;
  const list = `
    <div style="display:flex; flex-direction:column; gap:${v(18, 20)}px">
      ${items
        .map(
          (t) => `
        <div style="display:flex; align-items:center; gap:18px; font-size:${v(31, 35)}px; font-weight:600; line-height:1.2">
          <span class="check" style="background:#fff">${tick("#e31536")}</span>${t}
        </div>`,
        )
        .join("")}
    </div>`;
  return `
  <div class="frame" style="background:radial-gradient(110% 70% at 100% 0%, #f2304f 0%, var(--red) 45%, #c40f2c 100%); color:#fff">
    <img class="logo" src="${A("logo-mono-white.svg")}">
    <h1 style="font-size:${v(86, 90)}px; margin-top:${v(48, 50)}px">Viele Steuervorteile verfallen am 31.&nbsp;Dezember.</h1>
    ${
      story
        ? `<div style="margin-top:50px; align-self:center">${cal}</div><div style="margin-top:56px">${list}</div>`
        : `<div style="display:flex; gap:56px; align-items:center; margin-top:56px">${cal}<div>${list}</div></div>`
    }
    <p style="font-size:${v(32, 34)}px; line-height:1.3; font-weight:500; color:rgba(255,255,255,.85); margin-top:${v(56, 44)}px">
      Was bis dahin nicht geregelt ist, zählt für dieses Jahr nicht mehr.
    </p>
    <div class="spacer"></div>
    <div style="display:flex; flex-direction:column; align-items:flex-start; gap:22px">
      <div class="cta" style="background:#fff; color:var(--red)">Jetzt noch prüfen lassen <span class="arr">→</span></div>
      <div class="fine" style="color:rgba(255,255,255,.85)">Kostenloses Erstgespräch · 20 Minuten · ab 500.000 € Umsatz</div>
    </div>
  </div>`;
}

// ---------- 4 · Neuer Weg: „Lohn ohne Excel-Chaos“ ----------
function c4(f) {
  const v = (a, b) => (f === "story" ? b : a);
  const chaos = [
    ["Excel-Liste_final_v3.xlsx", -4],
    ["Re: Re: Fw: Stunden März", 3],
    ["Rückfrage Lohnbüro", -2],
    ["Abtippen", 5],
    ["Korrekturabrechnung", -3],
  ];
  const old = `
    <div style="flex:1; background:#f1eee9; border-radius:32px; padding:${v("30px 26px", "36px 30px")}; display:flex; flex-direction:column">
      <div class="eyebrow" style="color:var(--grey); font-size:22px">Bisher</div>
      <div style="flex:1; display:flex; flex-direction:column; justify-content:space-around; align-items:flex-start; gap:12px; margin-top:20px">
        ${chaos
          .map(
            ([t, r]) => `
          <div style="transform:rotate(${r}deg); background:#fff; border:2px solid #e2ddd6; border-radius:14px; padding:${v("12px 16px", "14px 18px")}; font-size:${v(22, 24)}px; font-weight:600; color:#6e6964; text-decoration:line-through; text-decoration-color:var(--red); text-decoration-thickness:3px; white-space:nowrap">${t}</div>`,
          )
          .join("")}
      </div>
    </div>`;
  const step = (t, sub, hi = false) => `
    <div style="background:${hi ? "var(--ink)" : "#fff"}; color:${hi ? "#fff" : "var(--ink)"}; border:2px solid ${hi ? "var(--ink)" : "var(--line)"}; border-radius:20px; padding:${v("16px 20px", "20px 22px")}">
      <div style="font-size:${v(25, 27)}px; font-weight:700; display:flex; align-items:center; gap:12px">${hi ? `<span class="check" style="background:var(--red); width:36px; height:36px">${tick()}</span>` : ""}${t}</div>
      <div style="font-size:${v(19, 21)}px; color:${hi ? "rgba(255,255,255,.7)" : "var(--grey)"}; margin-top:4px">${sub}</div>
    </div>`;
  const arrow = `<div style="text-align:center; color:var(--red); font-size:30px; font-weight:800; line-height:1">↓</div>`;
  const neu = `
    <div style="flex:1; border:2px solid var(--line); border-radius:32px; padding:${v("30px 26px", "36px 30px")}; background:var(--paper)">
      <div class="eyebrow" style="color:var(--red); font-size:22px">Mit uns</div>
      <div style="display:flex; flex-direction:column; gap:${v(10, 14)}px; margin-top:20px">
        ${step("Personio / HRworks", "Ihr Team pflegt Zeiten & Urlaub")}
        ${arrow}
        ${step("Automatische Übergabe", "direkt an DATEV, ohne Abtippen")}
        ${arrow}
        ${step("Abrechnung fertig", "pünktlich, jeden Monat", true)}
      </div>
    </div>`;
  return `
  <div class="frame" style="background:#fff">
    <img class="logo" src="${A("logo.svg")}">
    <h1 style="font-size:${v(80, 84)}px; margin-top:${v(48, 60)}px">
      Lohnabrechnung ohne Excel und <span style="color:var(--red); white-space:nowrap">E-Mail-Chaos.</span>
    </h1>
    <div style="display:flex; gap:24px; margin-top:${v(48, 64)}px">${old}${neu}</div>
    <div style="display:flex; gap:14px; margin-top:${v(28, 40)}px; flex-wrap:wrap">
      <span class="chip" style="background:var(--paper); border:2px solid var(--line); font-size:24px; padding:12px 22px">${tick("#e31536")} Personio Expert Partner</span>
      <span class="chip" style="background:var(--paper); border:2px solid var(--line); font-size:24px; padding:12px 22px">${tick("#e31536")} HRworks Partner</span>
    </div>
    <div class="spacer"></div>
    ${footer({ cta: "Lohn-Prozess prüfen lassen" })}
  </div>`;
}

// Gesichter (Stirn bis Kinn, Anteil am Originalfoto). Design-Regel: Text, Logo und Overlays liegen NIE auf einem
// Gesicht – build prüft das gegen diese Box (+ Sicherheitsabstand) und bricht sonst ab.
const PETRA_FACE = { x: 0.34, y: 0.2, w: 0.4, h: 0.3, ratio: 2100 / 1400 };
const faceBox = (face, left, top, width) =>
  `<div class="deco face" style="position:absolute; left:${left + face.x * width}px; top:${top + face.y * width * face.ratio}px; width:${face.w * width}px; height:${face.h * width * face.ratio}px"></div>`;

// ---------- 5 · Future Projection: „Ihr Steuerberater meldet sich zuerst“ ----------
function c5(f) {
  const v = (a, b) => (f === "story" ? b : a);
  // Foto oben, Gesicht frei; Nachricht unter dem Kinn, Text auf dunklem Verlauf
  return `
  <div class="frame" style="background:#1b1819; color:#fff">
    <img class="deco" src="${A("petra.jpg")}" style="position:absolute; left:0; top:${v(-260, -60)}px; width:1110px">
    ${faceBox(PETRA_FACE, 0, v(-260, -60), 1110)}
    <div class="deco" style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,18,19,.5) 0%, rgba(20,18,19,0) ${v(14, 20)}%, rgba(20,18,19,0) ${v(40, 42)}%, rgba(20,18,19,.9) ${v(64, 62)}%, #1b1819 ${v(100, 85)}%)"></div>
    <div style="position:relative; display:flex; flex-direction:column; flex:1">
      <img class="logo" src="${A("logo-white.svg")}">
      <div class="overlay" style="margin-top:${v(490, 520)}px; align-self:flex-end; width:${v(640, 680)}px; background:rgba(255,255,255,.95); color:var(--ink); border-radius:32px; padding:24px 28px 28px; box-shadow:0 30px 60px -20px rgba(0,0,0,.55)">
        <div style="display:flex; align-items:center; gap:14px">
          <div style="width:52px; height:52px; border-radius:14px; background:var(--red); display:grid; place-items:center; color:#fff; font-weight:800; font-size:21px">B&amp;P</div>
          <div style="flex:1"><div style="font-size:24px; font-weight:700">Petra Börnigen, Steuerberaterin</div><div style="font-size:20px; color:var(--grey)">Nachricht · jetzt</div></div>
        </div>
        <div style="font-size:${v(27, 29)}px; line-height:1.35; margin-top:14px">
          Ihre Hochrechnung ist fertig. Mit zwei Maßnahmen vor dem 31.12. sparen Sie noch Steuern. <b>Passt Ihnen Donnerstag?</b>
        </div>
      </div>
      <div class="spacer"></div>
      <h1 style="font-size:${v(72, 80)}px; margin-bottom:${v(36, 44)}px">
        Stellen Sie sich vor, Ihr Steuerberater meldet sich <span style="color:var(--red)">zuerst.</span>
      </h1>
      ${footer({ dark: true })}
    </div>
  </div>`;
}

// ---------- 6 · Anti-Mainstream: „Blick nach vorn“ (Jans Positionierung, Nutzen je Entscheidung) ----------
function c6(f) {
  const v = (a, b) => (f === "story" ? b : a);
  const back = ["Jahresabschluss", "Steuererklärung", "Bescheid"];
  const ahead = [
    ["Investition", "Steuerfolgen kennen, bevor Sie unterschreiben"],
    ["Zukauf & Verkauf", "Mehr vom Kaufpreis und Erlös behalten"],
    ["Nachfolge", "Rechtzeitig und steuerlich sauber geregelt"],
    ["Wachstum", "Wissen, wie viel Geld Ihnen bleibt"],
  ];
  return `
  <div class="frame" style="background:radial-gradient(90% 60% at 85% 75%, rgba(227,21,54,.28) 0%, rgba(227,21,54,0) 60%), var(--ink); color:#fff">
    <img class="logo" src="${A("logo-white.svg")}">
    <div style="margin-top:${v(40, 56)}px; align-self:flex-start; background:var(--red); color:#fff; font-size:${v(40, 46)}px; font-weight:800; letter-spacing:-0.02em; padding:${v("10px 22px", "12px 26px")}; border-radius:16px; transform:rotate(-1.5deg)">Unzufrieden mit Ihrem Steuerberater?</div>
    <h1 style="font-size:${v(68, 80)}px; margin-top:${v(28, 40)}px; color:rgba(255,255,255,.38)">Wir erklären nicht, was war.</h1>
    <h1 style="font-size:${v(68, 80)}px; margin-top:${v(6, 12)}px">Wir beraten, was als <span style="color:var(--red)">Nächstes</span> kommt.</h1>
    <div style="margin-top:${v(44, 72)}px; display:grid; grid-template-columns:0.72fr 92px 1.35fr; gap:${v(12, 14)}px; align-items:stretch">
      <div>
        <div class="eyebrow" style="font-size:20px; color:rgba(255,255,255,.4)">Blick zurück</div>
        <div style="display:flex; flex-direction:column; gap:${v(12, 16)}px; margin-top:16px">${back
          .map(
            (t) => `
          <div style="border-radius:14px; padding:${v("13px 16px", "15px 18px")}; font-size:${v(23, 25)}px; font-weight:500; color:rgba(255,255,255,.42); background:rgba(255,255,255,.06); border:2px dashed rgba(255,255,255,.14)">${t}</div>`,
          )
          .join("")}</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center">
        <div style="background:var(--red); color:#fff; font-size:18px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:6px 12px; border-radius:999px">Heute</div>
        <div style="flex:1; width:4px; margin-top:10px; border-radius:4px; background:linear-gradient(180deg, var(--red), rgba(227,21,54,.15))"></div>
      </div>
      <div>
        <div class="eyebrow" style="font-size:20px; color:var(--red)">Ihr Nutzen: Blick nach vorn</div>
        <div style="display:flex; flex-direction:column; gap:${v(10, 14)}px; margin-top:16px">${ahead
          .map(
            ([t, sub]) => `
          <div style="display:flex; gap:12px; align-items:flex-start; border-radius:16px; padding:${v("12px 16px", "15px 18px")}; background:#fff; color:var(--ink); box-shadow:0 14px 30px -14px rgba(227,21,54,.55)">
            <span class="check" style="background:var(--red); width:30px; height:30px; margin-top:2px">${tick()}</span>
            <div><div style="font-size:${v(24, 26)}px; font-weight:800; letter-spacing:-0.01em">${t}</div><div style="font-size:${v(20, 22)}px; color:#5f5a57; margin-top:2px; line-height:1.25">${sub}</div></div>
          </div>`,
          )
          .join("")}</div>
      </div>
    </div>
    <div class="spacer"></div>
    ${footer({ dark: true, lead: "Echte Steuerberatung statt Verwaltung kennenlernen:", cta: "Unverbindliches Erstgespräch sichern", fine: "Kostenlos · 20 Minuten · für Unternehmer ab 500.000 € Umsatz" })}
  </div>`;
}

// ---------- 7 · Wertebasiert: Jan Börnigen, selbst Finanzchef – Nutzen für den Mandanten vorn ----------
const JAN_FACE = { x: 0.37, y: 0.15, w: 0.43, h: 0.33, ratio: 2100 / 1400 };
function c7(f) {
  const v = (a, b) => (f === "story" ? b : a);
  const top = v(-250, -40);
  const gains = [
    "Steuerfolgen kennen, bevor Sie entscheiden",
    "Zahlen, auf die Sie sich verlassen können",
    "Sparring auf Augenhöhe – ohne CFO-Gehalt",
  ];
  return `
  <div class="frame" style="background:#1b1819; color:#fff">
    <img class="deco" src="${A("jan.jpg")}" style="position:absolute; left:0; top:${top}px; width:1080px">
    ${faceBox(JAN_FACE, 0, top, 1080)}
    <div class="deco" style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,18,19,.45) 0%, rgba(20,18,19,0) ${v(14, 20)}%, rgba(20,18,19,0) ${v(40, 42)}%, rgba(20,18,19,.9) ${v(64, 62)}%, #1b1819 ${v(98, 85)}%)"></div>
    <div style="position:relative; display:flex; flex-direction:column; flex:1">
      <img class="logo" src="${A("logo-white.svg")}">
      <div class="overlay" style="margin-top:${v(468, 480)}px; align-self:flex-start; width:${v(640, 680)}px; background:rgba(255,255,255,.96); color:var(--ink); border-radius:30px; padding:22px 26px 24px; box-shadow:0 30px 60px -20px rgba(0,0,0,.55)">
        <div style="font-size:23px; font-weight:800">Jan Börnigen, Steuerberater</div>
        <div style="font-size:20px; color:#5f5a57; margin-top:2px">Zuvor Finanzchef einer Konzerneinheit, Controlling &amp; M&amp;A</div>
        <div style="height:2px; background:var(--line); margin:14px 0 12px"></div>
        <div class="eyebrow" style="font-size:18px; color:var(--red)">Was Sie davon haben</div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px">
          ${gains
            .map(
              (t) => `
            <div style="display:flex; gap:12px; align-items:center; font-size:${v(23, 25)}px; font-weight:600">
              <span class="check" style="background:var(--red); width:28px; height:28px">${tick()}</span>${t}
            </div>`,
            )
            .join("")}
        </div>
      </div>
      <div class="spacer"></div>
      <div style="align-self:flex-start; background:var(--red); color:#fff; font-size:${v(30, 34)}px; font-weight:800; letter-spacing:-0.01em; padding:8px 18px; border-radius:12px; margin-bottom:16px">Verkauf, Zukauf oder Nachfolge geplant?</div>
      <h1 style="font-size:${v(68, 76)}px; margin-bottom:${v(30, 40)}px">
        Ihr nächster Steuerberater war selbst <span style="color:var(--red)">Finanzchef.</span>
      </h1>
      ${footer({ dark: true, cta: "Erstgespräch mit Jan Börnigen sichern", fine: "Kostenlos · unverbindlich · 20 Minuten · ab 500.000 € Umsatz" })}
    </div>
  </div>`;
}

const CREATIVES = [
  ["01-letzter-vorschlag", c1],
  ["02-nachzahlung", c2],
  ["03-31-dezember", c3],
  ["04-lohn-ohne-chaos", c4],
  ["05-meldet-sich-zuerst", c5],
  ["06-blick-nach-vorn", c6],
  ["07-selbst-finanzchef", c7],
];

const only = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const [fmt, d] of Object.entries(FORMATS)) {
  const page = await browser.newPage({ viewport: { width: d.w, height: d.h }, deviceScaleFactor: 1 });
  mkdirSync(path.join(OUT, fmt), { recursive: true });
  for (const [name, fn] of CREATIVES) {
    if (only && !name.startsWith(only)) continue;
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${BASE_CSS}
      :root{--w:${d.w}px;--h:${d.h}px;--top:${d.top}px;--bottom:${d.bottom}px}</style></head><body>${fn(fmt)}</body></html>`;
    const file = path.join(SRC, `.tmp-${name}-${fmt}.html`);
    writeFileSync(file, html);
    await page.goto(`file://${file}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const out = path.join(OUT, fmt, `${name}-${fmt === "feed" ? "4x5" : "9x16"}.png`);
    const over = await page.evaluate((limit) => {
      const els = [...document.querySelectorAll(".frame *")].filter((e) => !e.closest(".deco"));
      return Math.max(...els.map((e) => e.getBoundingClientRect().bottom)) - limit;
    }, d.h - d.bottom);
    if (over > 1) console.warn(`  ! ${name} ${fmt}: ${Math.round(over)}px über der Safe-Zone`);
    const onFace = await page.evaluate((pad) => {
      const hits = [];
      for (const face of document.querySelectorAll(".face")) {
        const f = face.getBoundingClientRect();
        for (const e of document.querySelectorAll(".frame *")) {
          if (e.closest(".deco")) continue;
          const ownText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!ownText && e.tagName !== "IMG" && !e.classList.contains("overlay")) continue;
          const r = e.getBoundingClientRect();
          if (r.left < f.right + pad && r.right > f.left - pad && r.top < f.bottom + pad && r.bottom > f.top - pad)
            hits.push((e.textContent || e.className).trim().slice(0, 40));
        }
      }
      return hits;
    }, 40);
    if (onFace.length) throw new Error(`${name} ${fmt}: Element liegt auf dem Gesicht → ${onFace.join(" | ")}`);
    await page.screenshot({ path: out });
    console.log(out);
  }
  await page.close();
}
await browser.close();
