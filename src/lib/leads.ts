import "server-only";
import { createHmac } from "node:crypto";
import { list, sendMail, table } from "@/lib/mail";
import { QUESTIONS, labelFor, type Answers } from "@/lib/funnel";

export type LeadPayload = {
  event: "lead.created";
  lead_id: string;
  created_at: string;
  quelle: string;
  kanzlei: string;
  status: "qualifiziert";
  kontakt: {
    vorname: string;
    nachname: string;
    firma: string;
    email: string;
    telefon: string;
    plz: string;
    erreichbarkeit?: string;
  };
  nachricht?: string;
  qualifizierung: Record<string, { wert: string | string[]; label: string }>;
  score: { punkte: number; klasse: "A" | "B" | "C" };
  im_zielgebiet: boolean;
  tracking: Record<string, string>;
  einwilligung: { datenschutz: true; zeitpunkt: string; text: string };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * POST an einen Webhook mit Timeout, 3 Versuchen und HMAC-Signatur.
 * Header `Idempotency-Key` = lead_id, damit das Zielsystem Dubletten verwerfen kann.
 */
async function postWebhook(url: string, payload: LeadPayload, secret?: string) {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "bup-erstgespraech/1.0",
    "Idempotency-Key": payload.lead_id,
  };
  const token = process.env.LEAD_WEBHOOK_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (secret) {
    const ts = Math.floor(Date.now() / 1000).toString();
    headers["X-Signature-Timestamp"] = ts;
    headers["X-Signature"] = `sha256=${createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex")}`;
  }

  let last = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(8000) });
      if (res.ok) return { ok: true as const, attempt };
      last = `HTTP ${res.status}`;
      // 4xx (außer 408/429) ist ein Konfigurationsfehler – Wiederholen hilft nicht
      if (res.status < 500 && res.status !== 408 && res.status !== 429) break;
    } catch (e) {
      last = e instanceof Error ? e.message : String(e);
    }
    if (attempt < 3) await sleep(attempt * 700);
  }
  return { ok: false as const, error: last };
}

export function buildPayload(input: {
  leadId: string;
  answers: Answers;
  kontakt: LeadPayload["kontakt"];
  nachricht?: string;
  score: LeadPayload["score"];
  imZielgebiet: boolean;
  tracking: Record<string, string>;
  consentText: string;
}): LeadPayload {
  const now = new Date().toISOString();
  const qualifizierung: LeadPayload["qualifizierung"] = {};
  for (const q of QUESTIONS) {
    const v = input.answers[q.id];
    if (v) qualifizierung[q.id] = { wert: v, label: labelFor(q.id, v) };
  }
  return {
    event: "lead.created",
    lead_id: input.leadId,
    created_at: now,
    quelle: "landingpage-erstgespraech",
    kanzlei: "Börnigen & Partners Steuerberatungsgesellschaft mbH",
    status: "qualifiziert",
    kontakt: input.kontakt,
    nachricht: input.nachricht,
    qualifizierung,
    score: input.score,
    im_zielgebiet: input.imZielgebiet,
    tracking: input.tracking,
    einwilligung: { datenschutz: true, zeitpunkt: now, text: input.consentText },
  };
}

/**
 * Liefert einen Lead an alle Kanäle aus:
 *  1. Kanzlei Brands OS (LEAD_WEBHOOK_URL) – Hauptkanal
 *  2. Backup-Webhook (LEAD_BACKUP_WEBHOOK_URL, z. B. Make/Zapier → Google Sheet) – optional
 *  3. E-Mail-Kopie (LEAD_EMAIL) – optional, nur wenn LEAD_EMAIL gesetzt ist
 *  4. Alarm-Mail an Kanzlei Brands (ALERT_EMAIL), falls ein Webhook scheitert
 *
 * `delivered` ist true, sobald mindestens ein Kanal den Lead sicher hat.
 */
export async function deliverLead(p: LeadPayload) {
  const main = process.env.LEAD_WEBHOOK_URL;
  const backup = process.env.LEAD_BACKUP_WEBHOOK_URL;
  const secret = process.env.LEAD_WEBHOOK_SECRET;

  const [mainRes, backupRes] = await Promise.all([
    main ? postWebhook(main, p, secret) : Promise.resolve(undefined),
    backup ? postWebhook(backup, p, secret) : Promise.resolve(undefined),
  ]);

  const k = p.kontakt;
  const q = p.qualifizierung;
  const webhookFailed = (main && !mainRes?.ok) || (backup && !backupRes?.ok);
  const status = [
    main ? `OS-Webhook: ${mainRes?.ok ? "übertragen" : `FEHLGESCHLAGEN (${mainRes && "error" in mainRes ? mainRes.error : "?"})`}` : "OS-Webhook: nicht konfiguriert",
    backup ? `Backup-Webhook: ${backupRes?.ok ? "übertragen" : "FEHLGESCHLAGEN"}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<h2 style="font-family:Arial,sans-serif;color:#1d1b1c">Neue Anfrage Erstgespräch – Klasse ${p.score.klasse}</h2>${table([
    ["Name", `${k.vorname} ${k.nachname}`],
    ["Unternehmen", k.firma],
    ["E-Mail", k.email],
    ["Telefon", k.telefon],
    ["PLZ", `${k.plz}${p.im_zielgebiet ? "" : " (außerhalb Zielgebiet)"}`],
    ["Erreichbarkeit", k.erreichbarkeit],
    ["Jahresumsatz", q.umsatz?.label],
    ["Rechtsform", q.rechtsform?.label],
    ["Branche", q.branche?.label],
    ["Mitarbeitende", q.mitarbeiter?.label],
    ["Gewünschte Leistungen", q.leistungen?.label],
    ["Wechselgrund", q.anlass?.label],
    ["Start", q.zeitpunkt?.label],
    ["Nachricht", p.nachricht],
    ["Score", `${p.score.punkte} Punkte (Klasse ${p.score.klasse})`],
    ["Kampagne", [p.tracking.utm_campaign, p.tracking.utm_content].filter(Boolean).join(" / ") || undefined],
    ["Lead-ID", p.lead_id],
    ["Übertragung", status],
  ])}`;

  // Standardweg: nur das OS (es benachrichtigt die Kanzlei selbst). Mail-Kopie nur, wenn ausdrücklich konfiguriert.
  const mailTo = list(process.env.LEAD_EMAIL, "");
  let mailOk = false;
  if (mailTo.length) {
    try {
      await sendMail({
        to: mailTo,
        subject: `${webhookFailed ? "⚠ " : ""}Neue Erstgespräch-Anfrage (${p.score.klasse}): ${k.firma} – ${k.vorname} ${k.nachname}`,
        html,
        replyTo: k.email,
        idempotencyKey: `lead-${p.lead_id}`,
      });
      mailOk = true;
    } catch (e) {
      console.error("[lead:mail]", p.lead_id, e);
    }
  }

  if (webhookFailed && process.env.ALERT_EMAIL) {
    try {
      await sendMail({
        to: list(process.env.ALERT_EMAIL, ""),
        subject: `⚠ Lead-Webhook fehlgeschlagen – bitte manuell ins OS übernehmen (${p.lead_id})`,
        html: `${html}<pre style="font-size:12px;white-space:pre-wrap">${JSON.stringify(p, null, 2).replace(/</g, "&lt;")}</pre>`,
        idempotencyKey: `alert-${p.lead_id}`,
      });
    } catch (e) {
      console.error("[lead:alert]", p.lead_id, e);
    }
  }

  // Strukturiertes Log als letzte Absicherung (Vercel → Logs / Log-Drain)
  console.info("[lead]", JSON.stringify({ lead_id: p.lead_id, main: mainRes, backup: backupRes, mailOk }));

  const delivered = Boolean(mainRes?.ok || backupRes?.ok || mailOk);
  return { delivered, main: mainRes, backup: backupRes, mailOk };
}
