import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "./globals.css";
import { LeadKeeper } from "@/components/LeadKeeper";
import { MetaPixel } from "@/components/MetaPixel";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://boernigen-partner.vercel.app"),
  title: "Steuerliche Zweitmeinung für Unternehmer | Börnigen & Partners Steuerberater",
  description:
    "Für Unternehmer im Raum München ab 500.000 € Umsatz: kostenfreies, vertrauliches Erstgespräch mit Börnigen & Partners – Lohn, Buchhaltung, Abschluss und proaktive Steuergestaltung aus einer Hand.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Börnigen & Partners Steuerberater",
  },
  robots: { index: false, follow: false }, // Kampagnen-Landingpage
};

export const viewport: Viewport = {
  themeColor: "#1d1b1c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body>
        {children}
        <LeadKeeper />
        <MetaPixel />
      </body>
    </html>
  );
}
