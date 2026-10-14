import { buildPayload, deliverLead } from "@/lib/leads";
import { QUESTIONS, inRegion, isDisqualified, leadScore, type Answers } from "@/lib/funnel";

export const maxDuration = 30;

// Schutz vor doppelter Zustellung, wenn der Browser nach einem Timeout erneut sendet
const seen = new Map<string, number>();

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "landing_url",
  "referrer",
  "ad_angle",
];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  if (body.website) return Response.json({ ok: true }); // Honeypot

  const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const leadId = str(body.leadId, 64);
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(leadId)) {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (seen.has(leadId)) return Response.json({ ok: true, leadId, duplicate: true });

  // Antworten nur mit bekannten Werten übernehmen
  const raw = (body.answers ?? {}) as Record<string, unknown>;
  const answers: Answers = {};
  for (const q of QUESTIONS) {
    const allowed = new Set(q.options.map((o) => o.value));
    const v = raw[q.id];
    if (q.multi && Array.isArray(v)) answers[q.id] = v.filter((x): x is string => typeof x === "string" && allowed.has(x));
    else if (typeof v === "string" && allowed.has(v)) answers[q.id] = v;
  }
  if (isDisqualified(answers)) {
    return Response.json({ ok: false, error: "Anfrage passt nicht zu den Kriterien." }, { status: 422 });
  }

  const c = (body.kontakt ?? {}) as Record<string, unknown>;
  const kontakt = {
    vorname: str(c.vorname, 80),
    nachname: str(c.nachname, 80),
    firma: str(c.firma, 160),
    email: str(c.email, 160),
    telefon: str(c.telefon, 40),
    plz: str(c.plz, 5),
    erreichbarkeit: str(c.erreichbarkeit, 80) || undefined,
  };
  if (
    !kontakt.vorname ||
    !kontakt.nachname ||
    !kontakt.firma ||
    !/^\S+@\S+\.\S+$/.test(kontakt.email) ||
    kontakt.telefon.replace(/\D/g, "").length < 6 ||
    body.consent !== true
  ) {
    return Response.json({ ok: false, error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
  }

  const t = (body.tracking ?? {}) as Record<string, unknown>;
  const tracking: Record<string, string> = {};
  for (const k of TRACKING_KEYS) if (str(t[k], 500)) tracking[k] = str(t[k], 500);
  const ua = request.headers.get("user-agent");
  if (ua) tracking.user_agent = ua.slice(0, 300);

  const payload = buildPayload({
    leadId,
    answers,
    kontakt,
    nachricht: str(body.nachricht, 2000) || undefined,
    score: leadScore(answers, kontakt.plz),
    imZielgebiet: inRegion(kontakt.plz),
    tracking,
    consentText: str(body.consentText, 600),
  });

  const result = await deliverLead(payload);
  if (!result.delivered) {
    // Kein Kanal hat den Lead – der Browser behält ihn und versucht es erneut
    return Response.json({ ok: false, error: "Übertragung fehlgeschlagen." }, { status: 502 });
  }

  seen.set(leadId, Date.now());
  if (seen.size > 500) seen.delete(seen.keys().next().value!);
  return Response.json({ ok: true, leadId, klasse: payload.score.klasse });
}
