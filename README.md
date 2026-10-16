# Börnigen & Partners – Erstgespräch-Funnel

Kampagnen-Landingpage für Mandatsakquise (Unternehmer ab 500.000 € Umsatz, Raum München).
Next.js 16 · Tailwind CSS 4 · Hosting auf Vercel (Region fra1)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

| Seite | Zweck |
|---|---|
| `/` | Landingpage |
| `/erstgespraech` | Vorab-Check (Vorqualifizierung, 6 Schritte) |
| `/danke` | Bestätigung (+ optional Kalender) – Conversion-URL für Meta |
| `/api/lead` | Nimmt Leads an und verteilt sie an OS-Webhook, Backup und E-Mail |

- Kriterien der Vorqualifizierung ändern: [`src/lib/funnel.ts`](src/lib/funnel.ts)
- Lead-Übertragung & Ausfallsicherheit: [`docs/leads-webhook.md`](docs/leads-webhook.md)
- Meta-Werbung (5 Ad Angles, Texte, Creatives): [`docs/ad-angles.md`](docs/ad-angles.md)
- Projekt-Briefing (Kundenfakten, Entscheidungen): [`docs/briefing.md`](docs/briefing.md)

## Vor dem Livegang mit der Kanzlei klären

- [ ] Telefonnummer: Website nennt +49 89 189 3538 0, Impressum +49 89 950 3801 – welche gilt?
- [ ] Portraits Jan & Petra Börnigen als `public/img/team/jan-boernigen.jpg` und `public/img/team/petra-boernigen.jpg` ablegen (Hochformat 4:5, ca. 800×1000 px) – erscheinen dann automatisch, sonst Initialen
- [ ] Partner-Status und Tool-Liste bestätigen: Personio Expert Partner, HRworks Partner – welche weiteren HR-/Bewerbermanagement- und Buchhaltungs-Tools sollen namentlich auf die Seite? (`src/components/Visuals.tsx`, `HR_TOOLS`)
- [ ] Zusagen der neuen Copy bestätigen lassen: „Digital-Check“ im Gespräch, „Vorsysteme sparen Ihrer Buchhaltung Stunden“, „Ihre 3 wichtigsten Hebel“ im Gespräch, Nachzahlungs-Frühwarnung, Ehrlichkeits-Versprechen, „Kündigung/DATEV-Übernahme/Fristen übernehmen wir“, „jedes Mandat wird persönlich aufgenommen“
- [ ] Mandanten-Zitate freigeben lassen (stammen aus dem Onboarding-Formular)
- [ ] Zusage „Rückmeldung innerhalb eines Werktags“ bestätigen
- [ ] Datenschutzerklärung der Hauptseite um das Anfrageformular und die Weitergabe an Kanzlei Brands OS / Resend ergänzen
- [x] Meta-Pixel/Conversions API eingebaut (⚠️ ohne Einwilligungsabfrage, siehe Anleitung) – nur noch `NEXT_PUBLIC_META_PIXEL_ID` + `META_CAPI_TOKEN` in Vercel setzen ([Anleitung](docs/leads-webhook.md#meta-pixel--conversions-api-lead-event))
- [ ] Datenschutzerklärung der Kanzlei um Meta-Pixel + Conversions API ergänzen
