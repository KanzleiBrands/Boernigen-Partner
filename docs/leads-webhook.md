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
| `NEXT_PUBLIC_SITE_URL` | optional | Live-Domain, z. B. `https://erstgespraech.bup-steuerberater.de` |

**Minimal-Setup:** nur `LEAD_WEBHOOK_URL`. Das OS informiert die Kanzlei selbst per Mail. Ist `LEAD_EMAIL` gesetzt, aber `RESEND_API_KEY` fehlt, schlägt die Mail auf der Produktivumgebung bewusst fehl (statt „erfolgreich“ zu melden).

## Was das OS empfängt

`POST` mit `Content-Type: application/json` und diesen Headern:

| Header | Zweck |
|---|---|
| `Idempotency-Key` | = `lead_id`. Bei Wiederholungen identisch → im OS als Dubletten-Schlüssel verwenden |
| `X-Signature` | `sha256=<hex>` = HMAC-SHA256 über `"<X-Signature-Timestamp>.<raw body>"` mit `LEAD_WEBHOOK_SECRET` |
| `X-Signature-Timestamp` | Unix-Sekunden; Anfragen älter als 5 Minuten verwerfen |
| `Authorization` | nur wenn `LEAD_WEBHOOK_TOKEN` gesetzt ist |

Beispiel-Body (echter Testlauf):

```json
{
  "event": "lead.created",
  "lead_id": "31f09714-5add-4e94-9b98-a550e76cd01b",
  "created_at": "2026-10-14T15:32:38.203Z",
  "quelle": "landingpage-erstgespraech",
  "kanzlei": "Börnigen & Partners Steuerberatungsgesellschaft mbH",
  "status": "qualifiziert",
  "vorname": "Max", "nachname": "Muster", "firma": "Muster Consulting GmbH",
  "email": "max@example.com", "telefon": "0171 1234567",
  "kontakt": {
    "vorname": "Max", "nachname": "Muster", "firma": "Muster Consulting GmbH",
    "email": "max@example.com", "telefon": "0171 1234567", "plz": "81675",
    "erreichbarkeit": "Vormittags (8–12 Uhr)"
  },
  "nachricht": "Holding geplant",
  "qualifizierung": {
    "umsatz":      { "wert": "1m-2-5m", "label": "1 – 2,5 Mio. €" },
    "rechtsform":  { "wert": "gmbh", "label": "GmbH / UG" },
    "branche":     { "wert": "beratung", "label": "Beratung & Dienstleistung" },
    "mitarbeiter": { "wert": "10-49", "label": "10 – 49" },
    "leistungen":  { "wert": ["komplett"], "label": "Alles aus einer Hand" },
    "anlass":      { "wert": ["erreichbarkeit", "nicht-proaktiv"], "label": "Antworten dauern zu lange, Keine proaktiven Gestaltungsvorschläge" },
    "zeitpunkt":   { "wert": "sofort", "label": "So bald wie möglich" }
  },
  "score": { "punkte": 11, "klasse": "A" },
  "im_zielgebiet": true,
  "tracking": {
    "utm_source": "meta", "utm_campaign": "bup-erstgespraech", "utm_content": "angle1-video",
    "fbclid": "…", "landing_url": "https://…", "referrer": "…", "user_agent": "…"
  },
  "einwilligung": { "datenschutz": true, "zeitpunkt": "2026-10-14T15:32:38.203Z", "text": "Ich bin einverstanden, …" }
}
```

**Kontaktfelder doppelt:** `vorname`, `nachname`, `firma`, `email` und `telefon` stehen zusätzlich auf oberster Ebene. Das Kanzlei Brands OS erkennt Kontaktfelder nur dort automatisch (`AUTO_DETECT` in `src/lib/webhook-ingest.ts` des OS) – ohne sie erscheint der Lead als „Unbenannt · Keine E-Mail · Kein Telefon“. `kontakt` bleibt für andere Empfänger erhalten.

**Das OS muss:** mit `2xx` antworten, sobald der Lead gespeichert ist (nicht erst nach weiterer Verarbeitung), und `lead_id` als eindeutigen Schlüssel nutzen. `4xx` wird nicht wiederholt (Konfigurationsfehler → Alarm-Mail), `5xx`/`408`/`429`/Timeout werden wiederholt.

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

**Wöchentlicher Abgleich (5 Minuten):** Anzahl Leads in Meta (Event `Lead`) ↔ Google Sheet (Backup) ↔ OS. Weichen die Zahlen ab, über die `lead_id` den fehlenden Lead finden.

## Testen vor dem Livegang

1. In Vercel die Variablen setzen (zuerst in „Preview“).
2. Auf der Preview-URL den Vorab-Check mit Testdaten durchlaufen.
3. Prüfen: Lead im OS? Mail im Postfach? Zeile im Sheet?
4. Ausfalltest: `LEAD_WEBHOOK_URL` testweise auf eine falsche URL setzen → Lead muss trotzdem per Mail + Backup ankommen und die Alarm-Mail ausgelöst werden.
5. Disqualifizierung testen (z. B. „Unter 500.000 €“): Es dürfen **keine** Kontaktdaten abgefragt und **kein** Lead gesendet werden.

## Meta-Tracking (Conversion-Optimierung)

- Der Funnel feuert nach erfolgreicher Übertragung `fbq('track', 'Lead', {}, { eventID: lead_id })` – **sofern der Meta-Pixel auf der Seite geladen ist**. Der Pixel ist noch nicht eingebaut, weil dafür ein Cookie-Consent-Banner nötig ist (TTDSG/DSGVO). Empfehlung: Consent-Tool (z. B. Usercentrics/Cookiebot) + Pixel, zusätzlich serverseitig die Conversions API mit derselben `lead_id` als `event_id` (Deduplizierung).
- Disqualifizierte Besucher lösen `lead_disqualified` im `dataLayer` aus, **nicht** `Lead` – so lernt Meta nur auf passende Unternehmer.
- Wer zusätzlich Meta-Lead-Formulare (Instant Forms) nutzt: Diese Leads kommen nicht über diese Seite. Dafür in Make/Zapier „Facebook Lead Ads → Webhook OS“ einrichten und dasselbe JSON-Format verwenden.
