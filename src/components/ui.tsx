import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const KANZLEI = {
  name: "Börnigen & Partners Steuerberatungsgesellschaft mbH",
  telefon: "+49 89 189 3538 0",
  telefonHref: "tel:+498918935380",
  email: "kanzlei@bup-steuerberater.de",
  standorte: [
    { ort: "Unterföhring", strasse: "Münchner Str. 123", plz: "85774 Unterföhring" },
    { ort: "Haar", strasse: "Münchener Str. 14", plz: "85540 Haar" },
  ],
  impressum: "https://bup-steuerberater.de/impressum/",
  datenschutz: "https://bup-steuerberater.de/datenschutzerklaerung/",
};

export const FUNNEL_HREF = "/erstgespraech";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase ${light ? "text-white/70" : "text-muted"}`}
    >
      <span className="h-px w-8 bg-red" aria-hidden />
      {children}
    </p>
  );
}

export function H2({ children, light, className = "" }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <h2
      className={`font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] ${light ? "text-white" : "text-ink"} ${className}`}
    >
      {children}
    </h2>
  );
}

export function CtaButton({
  children = "Kostenfreien Hebel-Check sichern",
  variant = "red",
  className = "",
}: {
  children?: React.ReactNode;
  variant?: "red" | "light";
  className?: string;
}) {
  const styles =
    variant === "red"
      ? "bg-red text-white hover:bg-red-600 shadow-[0_10px_30px_-10px_rgba(227,21,54,0.6)]"
      : "bg-white text-ink hover:bg-paper";
  return (
    <Link
      href={FUNNEL_HREF}
      className={`group inline-flex items-center justify-center gap-3 rounded-sm px-7 py-4 text-[15px] font-semibold tracking-wide transition-colors duration-200 ${styles} ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

export function CtaNote({ light }: { light?: boolean }) {
  return (
    <p className={`mt-4 text-sm ${light ? "text-white/60" : "text-muted"}`}>
      2 Minuten Vorab-Check · kostenfrei · ohne Wechselpflicht
    </p>
  );
}
