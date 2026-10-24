# Leads ins Kanzlei Brands OS übertragen – und keinen verlieren

## Ablauf

```
Browser (Vorab-Check)
  │ 1. Lead wird ZUERST lokal gespeichert (localStorage-Outbox, feste lead_id)
  │ 2. POST /api/lead  – bis zu 3 Versuche
  ▼
/api/lead (Vercel, Region fra1)
  │ prüft Pflichtfelder + Kriterien, berechnet Score (A/B/C) und Zielgebiet
  ├─► Kanzlei Brands OS        LEAD_WEBHOOK_URL         (3 Versuche, 8 s Timeout, HMAC-signiert)
  ├─► Backup-Webhook (opt.)    LEAD_BACKUP_WEBHOOK_URL  (z. B. Make/Zapier → Google Sheet)
  ├─► E-Mail-Kopie (opt.)      LEAD_EMAIL               (nur wenn gesetzt – Standard: aus, das OS benachrichtigt die Kanzlei)
  └─► Alarm-Mail               ALERT_EMAIL              (nur wenn ein Webhook scheitert, inkl. JSON)
  ▼
Antwort 200, sobald mindestens EIN Kanal den Lead sicher hat → Browser löscht die Outbox
Antwort 502, wenn alle Kanäle scheitern → Lead bleibt im Browser und wird beim nächsten Seitenaufruf erneut gesendet
```

## Einrichtung in Vercel (Environment Variables)

| Variable | Pflicht | Inhalt |
|---|---|---|
| `LEAD_WEBHOOK_URL` | ja | Eingehender Webhook des Kanzlei Brands OS |
| `LEAD_WEBHOOK_SECRET` | empfohlen | Gemeinsames Geheimnis für die HMAC-Signatur |
| `LEAD_WEBHOOK_TOKEN` | optional | Falls das OS einen `Authorization: Bearer …`-Header erwartet |
| `LEAD_BACKUP_WEBHOOK_URL` | empfohlen | Zweites, unabhängiges Ziel (Make/Zapier-Webhook → Google Sheet / Airtable) |
| `LEAD_EMAIL` | optional | E-Mail-Kopie jedes Leads (mehrere mit Komma). Leer = keine Mail, nur OS |
| `RESEND_API_KEY` | nur mit Mail | Für `LEAD_EMAIL`/`ALERT_EMAIL` (Absender-Domain in Resend verifizieren) |
| `MAIL_FROM` | nur mit Mail | z. B. `Kanzlei Brands <leads@kanzlei-brands.de>` |
| `ALERT_EMAIL` | empfohlen | Postfach bei Kanzlei Brands, das bei Webhook-Fehlern alarmiert wird |
| `NEXT_PUBLIC_BOOKING_URL` | optional | Kalender-Link (z. B. Calendly/OS-Terminbuchung) – wird auf `/danke` eingebettet |
| `NEXT_PUBLIC_SITE_URL` | optional | Live-Domain, Standard: `https://boernigen-partner.kanzleianfrage.de` |

**Minimal-Setup:** nur `LEAD_WEBHOOK_URL`. Das OS informiert die Kanzlei selbst per Mail. Ist `LEAD_EMAIL` gesetzt, aber `RESEND_API_KEY` fehlt, schlägt die Mail auf der Produktivumgebung bewusst fehl (statt „erfolgreich“ zu melden).

## Was das OS empfängt

`POST` mit `Content-Type: application/json` und diesen Headern:

| Header | Zweck |
|---|---|
| `Idempotency-Key` | = `lead_id`. Bei Wiederholungen identisch → im OS als Dubletten-Schlüssel verwenden |
| `X-Signature` | `sha256=<hex>` = HMAC-SHA256 über `"<X-Signature-Timestamp>.<raw body>"` mit `LEAD_WEBHOOK_SECRET` |
| `X-Signature-Timestamp` | Unix-Sekunden; Anfragen älter als 5 Minuten verwerfen |
| `Authorization` | nur wenn `LEAD_WEBHOOK_TOKEN` gesetzt ist |

Der Body enthält **nur die Angaben aus dem Formular** (lesbar beschriftet, leere Felder werden weggelassen). Dazu kommt `einwilligung` als Nachweis der Datenschutz-Einwilligung (Zeitpunkt in deutscher Zeit). Technik-, Tracking- und Score-Felder gehen bewusst nicht ans OS. Sie stehen nur im Vercel-Log und in der optionalen Mail-Kopie. Die Lead-ID kommt ausschließlich als `Idempotency-Key`-Header.

Beispiel-Body:

```json
{
  "vorname": "Max",
  "nachname": "Muster",
  "firma": "Muster Consulting GmbH",
  "email": "max@example.com",
  "telefon": "0171 1234567",
  "erreichbarkeit": "Vormittags (8–12 Uhr)",
  "jahresumsatz": "1 – 2,5 Mio. €",
  "rechtsform": "GmbH / UG",
  "branche": "Beratung & Dienstleistung",
  "mitarbeiter": "10 – 49",
  "wechselgrund": "Antworten dauern zu lange, Keine proaktiven Gestaltungsvorschläge",
  "nachricht": "Holding geplant",
  "einwilligung": "Ja, 24.10.2026 um 15:43 Uhr"
}
```

**Kontaktfelder auf oberster Ebene:** Das Kanzlei Brands OS erkennt `vorname`, `nachname`, `firma`, `email` und `telefon` nur dort automatisch (`AUTO_DETECT` in `src/lib/webhook-ingest.ts` des OS). Die übrigen Felder erscheinen im OS unter „Zusätzliche Angaben“.

**Das OS muss:** mit `2xx` antworten, sobald der Lead gespeichert ist (nicht erst nach weiterer Verarbeitung), und den `Idempotency-Key`-Header (= Lead-ID) als eindeutigen Schlüssel nutzen. `4xx` wird nicht wiederholt (Konfigurationsfehler → Alarm-Mail), `5xx`/`408`/`429`/Timeout werden wiederholt.

Signaturprüfung im OS (Node-Beispiel):

```js
import { createHmac, timingSafeEqual } from "node:crypto";
const ts = req.headers["x-signature-timestamp"];
const expected = "sha256=" + createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET).update(`${ts}.${rawBody}`).digest("hex");
const ok = Math.abs(Date.now() / 1000 - Number(ts)) < 300 &&
  timingSafeEqual(Buffer.from(expected), Buffer.from(req.headers["x-signature"]));
```

## Die 5 Sicherungsebenen – warum kein Lead verloren geht

1. **Browser-Outbox:** Der Lead liegt im Browser, bevor er gesendet wird. Netzabbruch, Server-Fehler oder geschlossener Tab → beim nächsten Aufruf der Seite wird automatisch nachgesendet (14 Tage). Gleiche `lead_id` → keine Dubletten.
2. **Wiederholungen:** 3 Versuche im Browser × 3 Versuche zum OS mit steigender Wartezeit. Kurze Ausfälle des OS (Deploy, Neustart) werden überbrückt.
3. **Zwei unabhängige Webhooks:** OS + Backup (Make/Zapier → Google Sheet). Fällt das OS länger aus, liegt der Lead trotzdem vollständig im Sheet.
4. **E-Mail-Kopie (optional):** Mit `LEAD_EMAIL` geht jeder Lead zusätzlich per Mail raus – mit Score im Betreff und Übertragungsstatus. Standardmäßig aus, weil das OS die Kanzlei benachrichtigt.
5. **Alarm + Log:** Scheitert ein Webhook, geht eine Alarm-Mail mit dem kompletten JSON an Kanzlei Brands (manuell im OS nachtragen). Zusätzlich steht jeder Lead als `[lead]`-Zeile in den Vercel-Logs.

**Wöchentlicher Abgleich (5 Minuten):** Anzahl Leads in Meta (Event `Lead`) ↔ Google Sheet (Backup) ↔ OS. Weichen die Zahlen ab, den fehlenden Lead über E-Mail oder Name finden (die `lead_id` steht im Vercel-Log).

## Testen vor dem Livegang

1. In Vercel die Variablen setzen (zuerst in „Preview“).
2. Auf der Preview-URL den Vorab-Check mit Testdaten durchlaufen.
3. Prüfen: Lead im OS? Mail im Postfach? Zeile im Sheet?
4. Ausfalltest: `LEAD_WEBHOOK_URL` testweise auf eine falsche URL setzen → Lead muss trotzdem per Mail + Backup ankommen und die Alarm-Mail ausgelöst werden.
5. Disqualifizierung testen (z. B. „Unter 500.000 €“): Es dürfen **keine** Kontaktdaten abgefragt und **kein** Lead gesendet werden.

## Meta-Pixel & Conversions API (Lead-Event)

Eingebaut und aktiv, sobald die Variablen gesetzt sind. Ohne `NEXT_PUBLIC_META_PIXEL_ID` kein Tracking.

> ⚠️ **Ohne Einwilligungsabfrage (bewusste Entscheidung Kanzlei Brands, 16.10.2026).** Pixel und Conversions API laufen für jeden Besucher, es gibt keinen Cookie-Banner. Das entspricht nicht § 25 TTDSG / DSGVO (Abmahn- und Bußgeldrisiko liegt bei der Kanzlei als Verantwortlicher). Ein Banner mit wirkungslosem „Ablehnen“ wurde bewusst **nicht** eingebaut, weil das Besucher täuschen würde. Eine einwilligungsbasierte Variante liegt in der Git-Historie (Commit `3ec3d48`).

| Variable | Wo finden | Hinweis |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Events Manager → Datenquellen → Pixel → Einstellungen („Pixel-ID“, nur Ziffern) | Wird beim Build eingebaut → nach dem Setzen **neu deployen** |
| `META_CAPI_TOKEN` | Events Manager → Pixel → Einstellungen → „Conversions API“ → „Zugriffsschlüssel generieren“ | Geheim; in Vercel als „Sensitive“ anlegen |
| `META_TEST_EVENT_CODE` | Events Manager → Pixel → „Events testen“ (z. B. `TEST12345`) | Nur zum Testen; danach löschen und neu deployen |

**Ablauf**
1. Jede Seite: Pixel lädt und feuert `PageView`.
2. Nach erfolgreicher Anfrage (Server hat den Lead gesichert):
   - Browser: `fbq('track', 'Lead', {}, { eventID: lead_id })`
   - Server: Conversions API `Lead` mit `event_id = lead_id`, gehashter E-Mail/Telefon/Name, IP, User-Agent, `_fbp`/`_fbc` (fehlt `_fbc`, wird es aus der gemerkten `fbclid` gebildet).
   - Meta dedupliziert beide über die gleiche ID → **ein** Lead im Werbeanzeigenmanager.
3. Disqualifizierte Besucher lösen nie `Lead` aus.
4. Fehler bei Meta beeinflussen die Lead-Übertragung nicht (Log `[meta-capi]` in Vercel).

**Testen:** `META_TEST_EVENT_CODE` setzen, neu deployen, Seite öffnen, Test-Anfrage senden → im Events Manager unter „Events testen“ erscheinen `PageView` und `Lead` (Browser **und** Server, „Dedupliziert“). Dann Code entfernen und neu deployen.

**Kampagne:** Optimierungsereignis `Lead` auf diesem Pixel wählen.

## Weitere Hinweise Meta

- Die Datenschutzerklärung der Kanzlei muss Meta-Pixel und Conversions API nennen (siehe Checkliste in der README).
- Disqualifizierte Besucher lösen `lead_disqualified` im `dataLayer` aus, **nicht** `Lead` – so lernt Meta nur auf passende Unternehmer.
- Wer zusätzlich Meta-Lead-Formulare (Instant Forms) nutzt: Diese Leads kommen nicht über diese Seite. Dafür in Make/Zapier „Facebook Lead Ads → Webhook OS“ einrichten und dasselbe JSON-Format verwenden.
