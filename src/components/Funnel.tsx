"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, Phone } from "lucide-react";
import { QUESTIONS, isDisqualified, type Answers, type Option } from "@/lib/funnel";
import { getTracking, newLeadId, send } from "@/lib/outbox";
import { getMetaCookies } from "@/lib/meta-cookies";
import { KANZLEI } from "@/components/ui";

const STATE_KEY = "bup_funnel_state";
const CONSENT_TEXT =
  "Ich bin einverstanden, dass Börnigen & Partners meine Angaben zur Bearbeitung meiner Anfrage und zur Kontaktaufnahme per Telefon oder E-Mail verarbeitet. Die Einwilligung kann ich jederzeit widerrufen.";

type Kontakt = {
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  plz: string;
  erreichbarkeit: string;
};

const emptyKontakt: Kontakt = { vorname: "", nachname: "", firma: "", email: "", telefon: "", plz: "", erreichbarkeit: "" };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function Funnel() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [kontakt, setKontakt] = useState<Kontakt>(emptyKontakt);
  const [nachricht, setNachricht] = useState("");
  const [consent, setConsent] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "failed" | "rejected">("idle");
  const [dq, setDq] = useState<Option | undefined>();
  const [restored, setRestored] = useState(false);

  // Zwischenstand in der Sitzung sichern – ein Reload kostet keinen Lead
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(STATE_KEY) ?? "null");
      if (s) {
        /* eslint-disable react-hooks/set-state-in-effect -- einmalige Wiederherstellung aus sessionStorage */
        setStep(s.step ?? 0);
        setAnswers(s.answers ?? {});
        setKontakt({ ...emptyKontakt, ...s.kontakt });
        setNachricht(s.nachricht ?? "");
        setLeadId(s.leadId ?? newLeadId());
      } else setLeadId(newLeadId());
    } catch {
      setLeadId(newLeadId());
    }
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify({ step, answers, kontakt, nachricht, leadId }));
    } catch {
      /* ignorieren */
    }
  }, [restored, step, answers, kontakt, nachricht, leadId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, dq]);

  const total = QUESTIONS.length + 1;
  const q = QUESTIONS[step];
  const progress = Math.round(((step + (dq ? 1 : 0)) / total) * 100);

  const choose = (opt: Option) => {
    if (!q) return;
    if (q.multi) {
      const cur = (answers[q.id] as string[] | undefined) ?? [];
      const next = cur.includes(opt.value) ? cur.filter((v) => v !== opt.value) : [...cur, opt.value];
      setAnswers({ ...answers, [q.id]: next });
      return;
    }
    const next = { ...answers, [q.id]: opt.value };
    setAnswers(next);
    if (opt.dq) {
      window.dataLayer?.push({ event: "lead_disqualified", grund: `${q.id}:${opt.value}` });
      setTimeout(() => setDq(opt), 180);
      return;
    }
    setTimeout(() => setStep((s) => s + 1), 220);
  };

  const multiDone = q?.multi && ((answers[q.id] as string[] | undefined)?.length ?? 0) > 0;

  const kontaktValid = useMemo(
    () =>
      kontakt.vorname.trim() &&
      kontakt.nachname.trim() &&
      kontakt.firma.trim() &&
      /^\S+@\S+\.\S+$/.test(kontakt.email) &&
      kontakt.telefon.replace(/\D/g, "").length >= 6 &&
      /^\d{5}$/.test(kontakt.plz) &&
      consent,
    [kontakt, consent],
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kontaktValid || isDisqualified(answers)) return;
    const honeypot = (new FormData(e.currentTarget).get("website") as string) || "";
    setStatus("sending");
    const body = {
      leadId,
      answers,
      kontakt,
      nachricht,
      consent: true,
      consentText: CONSENT_TEXT,
      tracking: getTracking(),
      website: honeypot,
      // Für die Conversions API (Zuordnung zum Anzeigen-Klick)
      meta: { ...getMetaCookies(), eventSourceUrl: window.location.href },
    };
    const r = await send(leadId, body);
    if (r === "ok") {
      // Standard-Event „Lead“ – gleiche eventID wie das Server-Event (Conversions API) → Meta dedupliziert
      window.fbq?.("track", "Lead", {}, { eventID: leadId });
      window.dataLayer?.push({ event: "lead_submitted", lead_id: leadId });
      try {
        sessionStorage.removeItem(STATE_KEY);
      } catch {
        /* ignorieren */
      }
      router.push(`/danke?n=${encodeURIComponent(`${kontakt.vorname} ${kontakt.nachname}`)}`);
      return;
    }
    setStatus(r);
  }

  if (dq) return <Disqualified option={dq} onBack={() => { setDq(undefined); setAnswers((a) => ({ ...a, [q!.id]: undefined })); }} />;

  return (
    <div>
      {/* Fortschritt */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold tracking-[0.14em] text-muted uppercase">
          <span>
            Schritt {Math.min(step + 1, total)} von {total}
          </span>
          <span>{progress} %</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-200">
          <div className="h-full bg-red transition-all duration-500 ease-out" style={{ width: `${Math.max(progress, 4)}%` }} />
        </div>
      </div>

      {q ? (
        <div key={q.id} className="animate-[fadeIn_.35s_ease-out]">
          <h1 className="font-serif text-3xl leading-tight font-medium text-balance text-ink sm:text-[2.2rem]">
            {q.title}
          </h1>
          {q.subtitle && <p className="mt-3 text-muted">{q.subtitle}</p>}
          <div className={`mt-8 grid gap-3 ${q.options.length > 6 ? "sm:grid-cols-2" : ""}`}>
            {q.options.map((o) => {
              const a = answers[q.id];
              const selected = Array.isArray(a) ? a.includes(o.value) : a === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => choose(o)}
                  aria-pressed={selected}
                  className={`flex min-h-14 items-center gap-4 rounded-sm border px-5 py-3.5 text-left text-[15px] font-medium transition-all duration-150 ${
                    selected
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink hover:border-ink/40 hover:bg-paper"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center border ${q.multi ? "rounded-[3px]" : "rounded-full"} ${
                      selected ? "border-white bg-white text-ink" : "border-grey"
                    }`}
                  >
                    {selected && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                  </span>
                  {o.label}
                </button>
              );
            })}
          </div>
          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
              >
                <ArrowLeft className="size-4" aria-hidden /> Zurück
              </button>
            ) : (
              <span />
            )}
            {q.multi && (
              <button
                type="button"
                disabled={!multiDone}
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-sm bg-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Weiter <ArrowRight className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="animate-[fadeIn_.35s_ease-out]" noValidate>
          <p className="inline-flex items-center gap-2 rounded-sm bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">
            <Check className="size-4" aria-hidden /> Ihr Unternehmen passt zu unserem Betreuungsprofil.
          </p>
          <h1 className="mt-5 font-serif text-3xl leading-tight font-medium text-balance text-ink sm:text-[2.2rem]">
            Wohin dürfen wir Ihren Terminvorschlag senden?
          </h1>
          <p className="mt-3 text-muted">
            Ein Steuerberater aus unserem Team meldet sich persönlich bei Ihnen – in der Regel innerhalb eines Werktags.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Field label="Vorname" name="vorname" autoComplete="given-name" value={kontakt.vorname} onChange={(v) => setKontakt({ ...kontakt, vorname: v })} />
            <Field label="Nachname" name="nachname" autoComplete="family-name" value={kontakt.nachname} onChange={(v) => setKontakt({ ...kontakt, nachname: v })} />
            <Field className="sm:col-span-2" label="Unternehmen" name="firma" autoComplete="organization" value={kontakt.firma} onChange={(v) => setKontakt({ ...kontakt, firma: v })} />
            <Field label="E-Mail" name="email" type="email" autoComplete="email" value={kontakt.email} onChange={(v) => setKontakt({ ...kontakt, email: v })} />
            <Field label="Telefon" name="telefon" type="tel" autoComplete="tel" value={kontakt.telefon} onChange={(v) => setKontakt({ ...kontakt, telefon: v })} />
            <Field
              label="PLZ Unternehmenssitz"
              name="plz"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={kontakt.plz}
              onChange={(v) => setKontakt({ ...kontakt, plz: v.replace(/\D/g, "").slice(0, 5) })}
            />
            <label className="block">
              <span className="text-sm font-medium text-ink-700">Am besten erreichbar</span>
              <select
                value={kontakt.erreichbarkeit}
                onChange={(e) => setKontakt({ ...kontakt, erreichbarkeit: e.target.value })}
                className="mt-1.5 h-12 w-full rounded-sm border border-line bg-white px-4 text-[15px] text-ink outline-none focus:border-ink"
              >
                <option value="">Egal</option>
                <option>Vormittags (8–12 Uhr)</option>
                <option>Mittags (12–14 Uhr)</option>
                <option>Nachmittags (14–18 Uhr)</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink-700">
                Was sollen wir vorab wissen? <span className="text-grey">(optional)</span>
              </span>
              <textarea
                value={nachricht}
                onChange={(e) => setNachricht(e.target.value)}
                rows={3}
                maxLength={2000}
                className="mt-1.5 w-full rounded-sm border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-ink"
                placeholder="z. B. geplante Holding, anstehende Betriebsprüfung, Wechselzeitpunkt …"
              />
            </label>
            {/* Honeypot gegen Spam-Bots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-[var(--color-ink)]"
            />
            <span>
              {CONSENT_TEXT} Weitere Informationen in der{" "}
              <a href={KANZLEI.datenschutz} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                Datenschutzerklärung
              </a>
              .
            </span>
          </label>

          {status === "failed" && (
            <div role="alert" className="mt-6 rounded-sm border border-red/30 bg-red-50 p-5 text-sm leading-relaxed text-ink">
              <strong>Die Übertragung hat gerade nicht geklappt.</strong> Ihre Angaben sind in diesem Browser gesichert
              und werden automatisch erneut gesendet. Sie können es auch direkt noch einmal versuchen oder uns anrufen:{" "}
              <a href={KANZLEI.telefonHref} className="font-semibold underline">
                {KANZLEI.telefon}
              </a>
              .
            </div>
          )}
          {status === "rejected" && (
            <div role="alert" className="mt-6 rounded-sm border border-red/30 bg-red-50 p-5 text-sm text-ink">
              Bitte prüfen Sie Ihre Angaben – einige Pflichtfelder sind unvollständig.
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted hover:text-ink"
            >
              <ArrowLeft className="size-4" aria-hidden /> Zurück
            </button>
            <button
              type="submit"
              disabled={!kontaktValid || status === "sending"}
              className="inline-flex items-center justify-center gap-3 rounded-sm bg-red px-7 py-4 text-[15px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(227,21,54,0.6)] transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Wird gesendet …
                </>
              ) : status === "failed" ? (
                "Erneut senden"
              ) : (
                <>
                  Kostenfreien Hebel-Check anfragen <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-grey">
            <Lock className="size-3.5" aria-hidden /> SSL-verschlüsselt · Verschwiegenheitspflicht nach § 57 StBerG
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="mt-1.5 h-12 w-full rounded-sm border border-line bg-white px-4 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function Disqualified({ option, onBack }: { option: Option; onBack: () => void }) {
  const umsatz = option.value === "unter-500k";
  return (
    <div className="animate-[fadeIn_.35s_ease-out]">
      <h1 className="font-serif text-3xl leading-tight font-medium text-balance text-ink sm:text-[2.2rem]">
        Vielen Dank für Ihr Interesse.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-700">
        {umsatz
          ? "Unser Betreuungsmodell ist auf Unternehmen ab etwa 500.000 € Jahresumsatz ausgerichtet. Damit Sie die Betreuung erhalten, die zu Ihrer Unternehmensgröße passt, nehmen wir in diesem Bereich derzeit keine neuen Mandate an."
          : `Für Unternehmen mit der Angabe „${option.label}“ können wir leider keine Betreuung anbieten, die unserem eigenen Qualitätsanspruch gerecht wird. Deshalb nehmen wir in diesem Bereich keine neuen Mandate an.`}
      </p>
      <p className="mt-4 leading-relaxed text-muted">
        Wir möchten Ihnen keine Zeit mit einem Gespräch rauben, das am Ende nicht zu einer Zusammenarbeit führen kann.
        Wir wünschen Ihnen viel Erfolg bei der Suche nach der passenden Kanzlei.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden /> Angabe korrigieren
        </button>
        <a href={KANZLEI.telefonHref} className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
          <Phone className="size-4" aria-hidden /> Rückfragen: {KANZLEI.telefon}
        </a>
      </div>
    </div>
  );
}
