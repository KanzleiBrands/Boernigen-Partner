"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/ui";

export type Pain = { quote: string };

/** Interaktiver Selbsttest: Besucher tippt an, was zutrifft – das Ergebnis zieht zum CTA. */
export function SelfCheck({ pains }: { pains: Pain[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const n = checked.size;
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const verdict =
    n === 0
      ? "Niemand außer Ihnen sieht das Ergebnis."
      : n === 1
        ? "Ein Warnsignal. Ein Grund, genauer hinzusehen."
        : n <= 3
          ? "Ihr Unternehmen ist Ihrer Kanzlei entwachsen."
          : "Sie zahlen für Verwaltung – und verschenken Gestaltung.";

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {pains.map((p, i) => {
          const on = checked.has(i);
          return (
            <li key={p.quote}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                className={`flex min-h-16 w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-[17px] font-medium transition-all active:scale-[0.99] ${on ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink/30"}`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-colors ${on ? "bg-red text-white" : "ring-2 ring-line"}`}
                  aria-hidden
                >
                  {on && <Check className="size-4" strokeWidth={3} />}
                </span>
                „{p.quote}“
              </button>
            </li>
          );
        })}
      </ul>
      <div
        className={`mt-5 flex flex-col items-center gap-4 rounded-3xl p-6 text-center transition-colors sm:flex-row sm:text-left ${n >= 2 ? "bg-red text-white" : "bg-paper text-ink"}`}
        aria-live="polite"
      >
        <p className="text-5xl font-semibold tracking-tight tabular-nums">
          {n}
          <span className={`text-xl ${n >= 2 ? "text-white/60" : "text-grey"}`}>/{pains.length}</span>
        </p>
        <p className="flex-1 text-lg leading-snug font-semibold">{verdict}</p>
        {n >= 2 && (
          <CtaButton variant="light" className="w-full sm:w-auto">
            Hebel-Check sichern
          </CtaButton>
        )}
      </div>
    </div>
  );
}
