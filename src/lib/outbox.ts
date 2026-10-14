/**
 * Browser-seitige Absicherung: Jeder Lead wird VOR dem Absenden lokal gespeichert
 * und erst nach bestätigter Annahme durch den Server gelöscht. Scheitert die
 * Übertragung (Funkloch, Server down), wird beim nächsten Seitenaufruf erneut gesendet.
 * Die lead_id bleibt dabei gleich – der Server und das OS erkennen Dubletten.
 */

const KEY = "bup_lead_outbox";
const TRACKING_KEY = "bup_tracking";

export type OutboxEntry = { leadId: string; body: Record<string, unknown>; tries: number; firstTry: number };

const read = (): OutboxEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as OutboxEntry[];
  } catch {
    return [];
  }
};
const write = (entries: OutboxEntry[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* privater Modus – dann zählt nur der direkte Versand */
  }
};

export const newLeadId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

export function enqueue(leadId: string, body: Record<string, unknown>) {
  const entries = read().filter((e) => e.leadId !== leadId);
  entries.push({ leadId, body, tries: 0, firstTry: Date.now() });
  write(entries);
}

const remove = (leadId: string) => write(read().filter((e) => e.leadId !== leadId));

/** Ergebnis: "ok" (gesichert), "rejected" (Daten ungültig – nicht erneut senden), "failed" (später erneut) */
async function post(body: Record<string, unknown>): Promise<"ok" | "rejected" | "failed"> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (res.ok) return "ok";
    if (res.status === 400 || res.status === 422) return "rejected";
    return "failed";
  } catch {
    return "failed";
  }
}

/** Sendet mit bis zu 3 Versuchen. Bleibt bei Fehlschlag in der Outbox. */
export async function send(leadId: string, body: Record<string, unknown>) {
  enqueue(leadId, body);
  for (let i = 0; i < 3; i++) {
    const r = await post(body);
    if (r !== "failed") {
      remove(leadId);
      return r;
    }
    await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
  }
  return "failed" as const;
}

/** Offene Leads aus früheren Besuchen nachsenden (max. 14 Tage alt). */
export async function flush() {
  const entries = read().filter((e) => Date.now() - e.firstTry < 14 * 864e5);
  write(entries);
  for (const e of entries) {
    const r = await post(e.body);
    if (r !== "failed") remove(e.leadId);
  }
}

export const pendingCount = () => read().length;

/** First-Touch-Tracking (UTM, fbclid …) einmal pro Sitzung festhalten. */
export function captureTracking() {
  try {
    if (sessionStorage.getItem(TRACKING_KEY)) return;
    const p = new URLSearchParams(location.search);
    const t: Record<string, string> = { landing_url: location.href, referrer: document.referrer };
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ad_angle"]) {
      const v = p.get(k);
      if (v) t[k] = v;
    }
    sessionStorage.setItem(TRACKING_KEY, JSON.stringify(t));
  } catch {
    /* ignorieren */
  }
}

export function getTracking(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(TRACKING_KEY) ?? "{}");
  } catch {
    return {};
  }
}
