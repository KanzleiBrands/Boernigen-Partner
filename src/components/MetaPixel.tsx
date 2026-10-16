"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent, setConsent, type ConsentState } from "@/lib/consent";
import { KANZLEI } from "@/components/ui";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const OPEN_CONSENT_EVENT = "bup-consent-open";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

/** Offizielles Meta-Basis-Snippet, nur nach Einwilligung ausgeführt. */
function loadPixel(id: string) {
  if (window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", id);
  fbq("track", "PageView");
}

/**
 * Meta-Pixel + Cookie-Hinweis. Ohne NEXT_PUBLIC_META_PIXEL_ID passiert gar nichts
 * (kein Banner, kein Tracking). Mit ID: Banner bis zur Entscheidung, Pixel nur bei Zustimmung.
 */
export function MetaPixel() {
  const [consent, setState] = useState<ConsentState>("denied");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!PIXEL_ID) return;
    const c = getConsent();
    /* eslint-disable react-hooks/set-state-in-effect -- einmaliges Lesen aus localStorage */
    setState(c);
    setOpen(c === null);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (c === "granted") loadPixel(PIXEL_ID);
    const onChange = (e: Event) => {
      const v = (e as CustomEvent<"granted" | "denied">).detail;
      setState(v);
      setOpen(false);
      if (v === "granted") loadPixel(PIXEL_ID);
      // Widerruf: Pixel lässt sich nicht entladen – neu laden, damit er nicht weiterläuft
      else if (window.fbq) window.location.reload();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
    };
  }, []);

  if (!PIXEL_ID || !open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white shadow-[0_-8px_30px_rgba(29,27,28,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
        <p className="text-sm leading-relaxed text-muted sm:flex-1">
          Wir möchten messen, welche unserer Anzeigen Unternehmer erreichen. Dafür setzen wir mit Ihrer Einwilligung
          den Meta-Pixel ein; dabei werden Daten an Meta Platforms übermittelt, ggf. auch in die USA. Ohne
          Einwilligung funktioniert die Seite vollständig.{" "}
          <a href={KANZLEI.datenschutz} className="underline hover:text-ink">
            Datenschutz
          </a>
          {consent === "granted" && " · Aktuell: zugestimmt."}
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="flex-1 rounded-sm border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-paper sm:flex-none"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="flex-1 rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-800 sm:flex-none"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}

/** Link im Footer, um die Entscheidung jederzeit zu ändern. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  if (!PIXEL_ID) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
