import { Check, CheckCheck } from "lucide-react";

/** Hero: So fühlt sich proaktive Beratung an – eine (beispielhafte) Nachricht des Beraters im November. */
export function AdvisorMessage({ avatar }: { avatar?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-[0_24px_50px_-20px_rgba(29,27,28,0.35)] sm:p-5">
      <div className="flex items-center gap-3">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="size-10 rounded-full object-cover object-top" />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-ink font-serif text-sm text-white">
            JB
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Ihr Berater</p>
          <p className="text-xs text-grey">Börnigen &amp; Partners · 14. Nov., 9:12</p>
        </div>
        <span className="rounded-full bg-red px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          Neu
        </span>
      </div>
      <p className="mt-3 rounded-lg rounded-tl-sm bg-paper p-3.5 text-[15px] leading-relaxed text-ink">
        Ihre Hochrechnung für dieses Jahr ist fertig. <strong className="font-semibold">Zwei Hebel</strong> sollten wir
        vor dem 31.12. noch ziehen – Tantieme und Investitionszeitpunkt. Passt Ihnen Donnerstag?
      </p>
      <p className="mt-2 flex items-center justify-end gap-1 text-[11px] text-grey">
        Gelesen <CheckCheck className="size-3.5 text-red" aria-hidden />
      </p>
    </div>
  );
}

/** Wechsel-Grafik: Wer macht was – Ihr Teil vs. unser Teil. */
export function SwitchGraphic() {
  const ours = [
    "Kündigung bei Ihrer bisherigen Kanzlei",
    "Übernahme der DATEV-Daten",
    "Buchhaltung & Lohnhistorie übertragen",
    "Laufende Fristen sichern",
    "Abstimmung mit dem Finanzamt",
    "Einrichtung DATEV Unternehmen online",
  ];
  return (
    <div className="grid gap-5 md:grid-cols-[0.8fr_1.4fr]">
      <div className="flex flex-col rounded-sm border border-line bg-white p-7">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Ihr Teil</p>
        <div className="mt-6 flex flex-1 flex-col justify-end gap-2">
          {["2 Minuten Vorab-Check", "30 Minuten Gespräch", "Eine Unterschrift"].map((t) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-sm border border-line bg-paper px-4 py-3 text-[15px] font-medium text-ink"
            >
              <Check className="size-4 shrink-0 text-red" aria-hidden />
              {t}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col rounded-sm bg-ink p-7 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] text-red uppercase">Unser Teil</p>
        <div className="mt-6 grid flex-1 gap-2 sm:grid-cols-2">
          {ours.map((t) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.05] px-4 py-3 text-[15px]"
            >
              <Check className="size-4 shrink-0 text-red" aria-hidden />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
