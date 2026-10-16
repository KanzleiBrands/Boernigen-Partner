/**
 * Einwilligung für Marketing-Cookies (Meta-Pixel + Conversions API).
 * Ohne ausdrückliche Zustimmung wird weder der Pixel geladen noch ein Server-Event an Meta gesendet.
 */

const KEY = "bup_consent_marketing";
export const CONSENT_EVENT = "bup-consent-change";

export type ConsentState = "granted" | "denied" | null;

export function getConsent(): ConsentState {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* privater Modus – gilt dann nur für diesen Seitenaufruf */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: v }));
}

/** Meta-Cookies für die Conversions API (Zuordnung Browser ↔ Server-Event). */
export function getMetaCookies() {
  const read = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  return { fbp: read("_fbp"), fbc: read("_fbc") };
}
