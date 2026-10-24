"use client";

import { useEffect } from "react";

export const PENDING_LEAD_KEY = "bup-lead-pending";

/**
 * Feuert das Meta-Standard-Event „Lead“ auf der Danke-Seite – nur, wenn der Funnel gerade erfolgreich abgeschickt
 * wurde (Lead-ID liegt in der Sitzung). Direktaufrufe von /danke zählen so nicht als Lead.
 * eventID = lead_id → Meta dedupliziert mit dem Server-Event der Conversions API.
 */
export function LeadConversion() {
  useEffect(() => {
    let leadId: string | null = null;
    try {
      leadId = sessionStorage.getItem(PENDING_LEAD_KEY);
      sessionStorage.removeItem(PENDING_LEAD_KEY);
    } catch {
      return;
    }
    if (!leadId) return;
    const id = leadId;
    // Beim direkten Laden initialisiert das Layout das Pixel erst nach dieser Komponente → kurz warten
    let tries = 0;
    const timer = setInterval(() => {
      if (window.fbq) {
        window.fbq("track", "Lead", {}, { eventID: id });
        clearInterval(timer);
      } else if (++tries > 50) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);
  return null;
}
