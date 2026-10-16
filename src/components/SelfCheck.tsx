"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/ui";

export type Pain = { quote: string; text: string };

/** Interaktiver Selbsttest: Besucher hakt ab, was auf ihn zutrifft – Ergebnis zieht zum CTA. */
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
      ? { t: "Haken Sie ab, was auf Sie zutrifft.", d: "Ehrlich sein lohnt sich – niemand außer Ihnen sieht das Ergebnis." }
      : n === 1
        ? { t: "1 Warnsignal.", d: "Noch kein Grund zur Sorge – aber ein Grund, einmal genauer hinzusehen." }
        : n <= 3
          ? {
              t: `${n} Warnsignale. Ihr Unternehmen ist Ihrer Kanzlei wahrscheinlich entwachsen.`,
              d: "Hier liegt mit hoher Wahrscheinlichkeit Gestaltungsspielraum brach. Der Steuer-Hebel-Check zeigt Ihnen, wo.",
            }
          : {
              t: `${n} Warnsignale. Sie zahlen für Verwaltung – und verschenken Gestaltung.`,
              d: "Jeder Monat, der so weiterläuft, kostet Sie Spielraum, den Sie nicht zurückbekommen. Lassen Sie uns sprechen.",
            };

  return (
    <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
        {pains.map((p, i) => {
          const on = checked.has(i);
          return (
            <li key={p.quote} className="bg-white">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                className={`flex h-full w-full gap-4 p-6 text-left transition-colors sm:p-7 ${on ? "bg-red-50" : "hover:bg-paper"}`}
              >
                <span
                  className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-sm border-2 transition-colors ${on ? "border-red bg-red text-white" : "border-line bg-white"}`}
                  aria-hidden
                >
                  {on && <Check className="size-4" strokeWidth={3} />}
                </span>
                <span>
                  <span className="block font-serif text-lg leading-snug text-ink">„{p.quote}“</span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-muted">{p.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="rounded-sm bg-ink p-8 text-white lg:sticky lg:top-28">
        <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">Ihr Ergebnis</p>
        <p className="mt-3 font-serif text-6xl leading-none" aria-live="polite">
          {n}
          <span className="text-2xl text-white/40"> / {pains.length}</span>
        </p>
        <p className="mt-5 text-lg leading-snug font-semibold">{verdict.t}</p>
        <p className="mt-3 leading-relaxed text-white/70">{verdict.d}</p>
        {n >= 2 && (
          <CtaButton className="mt-7 w-full">Hebel-Check sichern</CtaButton>
        )}
      </div>
    </div>
  );
}
