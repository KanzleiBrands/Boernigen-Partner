import type { Metadata } from "next";
import { CalendarCheck, FileSearch, PhoneCall } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container, Eyebrow, KANZLEI } from "@/components/ui";

export const metadata: Metadata = {
  title: "Vielen Dank | Börnigen & Partners Steuerberater",
};

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

export default async function DankePage({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
  // Voller Name statt nur Vorname – passt zur Anrede „Sie“ und kommt ohne Geschlechtsangabe aus
  const { n } = await searchParams;
  const name = n?.trim().slice(0, 80);
  return (
    <>
      <Header minimal />
      <main className="bg-paper">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Anfrage eingegangen</Eyebrow>
            <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-[-0.025em] text-balance text-ink sm:text-5xl">
              Vielen Dank{name ? `, ${name}` : ""}. Wir melden uns persönlich bei Ihnen.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-700">
              Ihre Anfrage liegt bei uns. Ein Steuerberater aus unserem Team prüft Ihre Angaben und meldet sich in der
              Regel innerhalb eines Werktags telefonisch oder per E-Mail.
            </p>

            {bookingUrl && (
              <div className="mt-10 overflow-hidden rounded-sm border border-line bg-white">
                <p className="border-b border-line px-6 py-4 font-semibold text-ink">
                  Sie möchten nicht warten? Wählen Sie direkt Ihren Wunschtermin:
                </p>
                <iframe src={bookingUrl} title="Terminbuchung" className="h-[720px] w-full" loading="lazy" />
              </div>
            )}

            <ol className="mt-14 grid gap-8 sm:grid-cols-3">
              {[
                { icon: FileSearch, t: "Vorbereitung", d: "Wir sehen uns Ihre Angaben an und bereiten das Gespräch gezielt vor." },
                { icon: PhoneCall, t: "Kontakt", d: "Wir rufen Sie an und stimmen einen Termin ab – Telefon, Video oder vor Ort." },
                { icon: CalendarCheck, t: "Erstgespräch", d: "20 Minuten, kostenlos: Sie erfahren, wo Sie Steuern und Zeit sparen können." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="border-t border-line pt-6">
                  <Icon className="size-6 text-red" aria-hidden />
                  <p className="mt-4 font-semibold text-ink">{t}</p>
                  <p className="mt-2 leading-relaxed text-muted">{d}</p>
                </li>
              ))}
            </ol>

            <div className="mt-14 rounded-sm border border-line bg-white p-7">
              <p className="font-semibold text-ink">Damit das Gespräch maximal nützlich wird</p>
              <p className="mt-2 leading-relaxed text-muted">
                Legen Sie, falls zur Hand, Ihren letzten Jahresabschluss und den letzten Steuerbescheid bereit. Das ist
                kein Muss – hilft uns aber, Ihnen konkretere Hinweise zu geben.
              </p>
              <p className="mt-5 text-sm text-muted">
                Fragen vorab? <a href={KANZLEI.telefonHref} className="font-semibold text-ink hover:underline">{KANZLEI.telefon}</a>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
