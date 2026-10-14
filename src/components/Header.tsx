import Link from "next/link";
import { Phone } from "lucide-react";
import { Container, FUNNEL_HREF, KANZLEI } from "@/components/ui";

export function Header({ minimal }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" aria-label="Börnigen & Partners Steuerberater – Startseite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.svg" alt="Börnigen & Partners Steuerberater" className="h-10 w-auto sm:h-12" />
        </Link>
        <div className="flex items-center gap-6">
          <a
            href={KANZLEI.telefonHref}
            className="hidden items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink md:flex"
          >
            <Phone className="size-4 text-red" aria-hidden />
            {KANZLEI.telefon}
          </a>
          {!minimal && (
            <Link
              href={FUNNEL_HREF}
              className="hidden rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700 sm:inline-flex"
            >
              Erstgespräch anfragen
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
