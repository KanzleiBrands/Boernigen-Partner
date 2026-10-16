import "server-only";
import { createHash } from "node:crypto";
import type { LeadPayload } from "@/lib/leads";

const GRAPH_VERSION = "v21.0";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const norm = (v: string | undefined) => (v ?? "").trim().toLowerCase();

/** Telefon nach Meta-Vorgabe: nur Ziffern, mit Ländervorwahl (DE als Standard). */
function normPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+")) return d;
  if (d.startsWith("00")) return d.slice(2);
  if (d.startsWith("0")) d = `49${d.slice(1)}`;
  return d;
}

export type MetaContext = {
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
};

/**
 * Sendet das Standard-Event „Lead“ an die Meta Conversions API.
 * Nur aktiv, wenn NEXT_PUBLIC_META_PIXEL_ID + META_CAPI_TOKEN gesetzt sind. event_id = lead_id → Meta dedupliziert mit dem Browser-Pixel.
 * Fehler werden nur geloggt – die Lead-Übertragung hängt nie davon ab.
 */
export async function sendMetaLead(p: LeadPayload, ctx: MetaContext) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return;

  const k = p.kontakt;
  const user_data: Record<string, unknown> = {
    em: [sha256(norm(k.email))],
    ph: [sha256(normPhone(k.telefon))],
    fn: [sha256(norm(k.vorname))],
    ln: [sha256(norm(k.nachname))],
    zp: [sha256(norm(k.plz))],
    country: [sha256("de")],
    external_id: [sha256(p.lead_id)],
    client_ip_address: ctx.clientIp,
    client_user_agent: ctx.userAgent,
    fbp: ctx.fbp,
    fbc: ctx.fbc,
  };

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.parse(p.created_at) / 1000),
        event_id: p.lead_id,
        action_source: "website",
        event_source_url: ctx.eventSourceUrl,
        user_data,
        custom_data: { lead_klasse: p.score.klasse, im_zielgebiet: p.im_zielgebiet },
      },
    ],
  };
  // Zum Prüfen im Events Manager („Events testen“) – live wieder entfernen
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    if (!res.ok) console.error("[meta-capi]", p.lead_id, res.status, text.slice(0, 500));
    else console.info("[meta-capi]", p.lead_id, text.slice(0, 200));
  } catch (e) {
    console.error("[meta-capi]", p.lead_id, e instanceof Error ? e.message : e);
  }
}
