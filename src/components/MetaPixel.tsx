"use client";

import { useEffect } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

/**
 * Meta-Pixel: lädt auf jeder Seite und feuert PageView – ohne Einwilligungsabfrage
 * (bewusste Entscheidung von Kanzlei Brands, siehe docs/leads-webhook.md).
 * Ohne NEXT_PUBLIC_META_PIXEL_ID passiert nichts.
 */
export function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID || window.fbq) return;
    // Offizielles Meta-Basis-Snippet
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
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
  }, []);
  return null;
}
