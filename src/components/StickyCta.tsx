"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNNEL_HREF } from "@/components/ui";

/**
 * Mobiler Sticky-Button: erst sichtbar, wenn der Hero (mit eigenem CTA) aus dem Bild gescrollt ist –
 * sonst stünden zwei Buttons direkt untereinander.
 */
export function StickyCta({ heroId }: { heroId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 sm:hidden ${show ? "translate-y-0" : "pointer-events-none translate-y-full"}`}
    >
      <Link
        href={FUNNEL_HREF}
        tabIndex={show ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red py-3.5 text-[15px] font-semibold text-white"
      >
        Kostenloses Erstgespräch sichern
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
