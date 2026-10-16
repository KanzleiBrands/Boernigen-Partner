import { Container, KANZLEI } from "@/components/ui";

export function Footer() {
  return (
    <footer className="bg-ink pt-14 pb-28 text-sm text-white/60 sm:pb-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-white.svg" alt="Börnigen & Partners Steuerberater" className="h-9 w-auto" />
            <p className="mt-5 max-w-sm leading-relaxed">
              Digitale Steuerberatung für inhabergeführte Unternehmen im Raum München – persönlich, proaktiv und auf
              Augenhöhe.
            </p>
          </div>
          {KANZLEI.standorte.map((s) => (
            <div key={s.ort}>
              <p className="font-semibold text-white">Büro {s.ort}</p>
              <p className="mt-2 leading-relaxed">
                {s.strasse}
                <br />
                {s.plz}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {KANZLEI.name}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${KANZLEI.email}`} className="hover:text-white">
              {KANZLEI.email}
            </a>
            <a href={KANZLEI.impressum} className="hover:text-white">
              Impressum
            </a>
            <a href={KANZLEI.datenschutz} className="hover:text-white">
              Datenschutz
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
