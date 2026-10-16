"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Tage bis zum 31.12. des laufenden Jahres – clientseitig, damit die statische Seite nicht veraltet. */
export function YearEndCountdown() {
  const days = useSyncExternalStore(
    subscribe,
    () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
    },
    () => null,
  );
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );

  return (
    <div className="inline-flex items-baseline gap-4 rounded-sm border border-white/15 bg-white/[0.04] px-6 py-5">
      <span className="font-serif text-6xl leading-none text-white tabular-nums sm:text-7xl">{days ?? "–"}</span>
      <span className="text-sm leading-snug text-white/70">
        Tage bis zum
        <br />
        <strong className="text-white">31. Dezember{year ? ` ${year}` : ""}</strong>
      </span>
    </div>
  );
}
