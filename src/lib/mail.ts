import "server-only";
import { Resend } from "resend";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function table(rows: [string, string | undefined][]) {
  return `<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="color:#5f5a57;vertical-align:top">${esc(k)}</td><td style="color:#1d1b1c"><strong>${esc(v!).replace(/\n/g, "<br>")}</strong></td></tr>`,
    )
    .join("")}</table>`;
}

export const list = (env: string | undefined, fallback: string) =>
  (env ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Versendet eine E-Mail über Resend. Ohne RESEND_API_KEY (lokal / Vorschau) wird nur geloggt.
 * Wirft bei Fehlern, damit die Lead-API weiß, ob die Sicherungskopie angekommen ist.
 */
export async function sendMail({
  to,
  subject,
  html,
  replyTo,
  idempotencyKey,
}: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  idempotencyKey?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Live darf ohne Mail-Versand nicht "erfolgreich" melden – sonst gilt ein Lead fälschlich als gesichert
    if (process.env.VERCEL_ENV === "production") throw new Error("RESEND_API_KEY fehlt");
    console.info("[mail:dry-run]", { to, subject, replyTo });
    return { dryRun: true };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send(
    {
      from: process.env.MAIL_FROM ?? "Börnigen & Partners <onboarding@resend.dev>",
      to,
      subject,
      html,
      replyTo,
    },
    idempotencyKey ? { idempotencyKey } : undefined,
  );
  if (error) throw new Error(error.message);
  return { dryRun: false };
}
