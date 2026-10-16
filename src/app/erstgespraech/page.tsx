import type { Metadata } from "next";
import { Check, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Funnel } from "@/components/Funnel";
import { Container, KANZLEI } from "@/components/ui";

export const metadata: Metadata = {
  title: "Steuer-Hebel-Check sichern | Börnigen & Partners Steuerberater",
};

export default function ErstgespraechPage() {
  return (
    <>
      <Header minimal />
      <main className="min-h-[calc(100svh-5rem)] bg-paper">
        <Container className="grid gap-12 py-10 sm:py-16 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div className="rounded-sm border border-line bg-white p-6 sm:p-10 lg:p-12">
            <Funnel />
          </div>
          <aside className="space-y-6 lg:pt-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Ihr Steuer-Hebel-Check</p>
              <ul className="mt-4 space-y-3 text-[15px] text-ink-700">
                {["30 Minuten mit einem Steuerberater", "Ihre 3 wichtigsten Hebel – auch was vor dem 31.12. noch geht", "Kostenfrei, ohne Wechselpflicht", "Telefon, Video oder vor Ort"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-red" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4 border-t border-line pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/datev-digitale-kanzlei-2023.png" alt="DATEV Digitale Kanzlei 2023" className="size-14" />
              <p className="text-sm leading-snug text-muted">5× in Folge als „Digitale Kanzlei“ von DATEV ausgezeichnet</p>
            </div>
            <div className="flex gap-3 border-t border-line pt-6 text-sm leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ink" aria-hidden />
              <p>
                Lieber direkt sprechen?{" "}
                <a href={KANZLEI.telefonHref} className="font-semibold text-ink underline-offset-2 hover:underline">
                  {KANZLEI.telefon}
                </a>
              </p>
            </div>
          </aside>
        </Container>
      </main>
    </>
  );
}
