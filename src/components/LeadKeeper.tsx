"use client";

import { useEffect } from "react";
import { captureTracking, flush } from "@/lib/outbox";

/** Merkt sich Kampagnen-Parameter und sendet ggf. hängengebliebene Anfragen nach. */
export function LeadKeeper() {
  useEffect(() => {
    captureTracking();
    flush();
  }, []);
  return null;
}
