# Allgemeinwissen – Testbericht, App-Store-Launch, Premium-Plan

Stand: 14.10.2026

## 1 · Testbericht

Getestet im lokalen Dev-Server (mobil, 375 × 812) mit frischem Zustand und mit vorbereitetem Fortschritt (9 Sessions fertig, 27 Karten fällig).
`tsc` ohne Fehler, `oxlint` nur Warnungen, Build ok, Dev-Key nicht im Build.

| Bereich | Ergebnis |
|---|---|
| Einführung (6 Folien), Überspringen | ok |
| Onboarding lokal (Name, Wissensstand Schule/Klasse) | ok |
| Onboarding mit Server (Konto anlegen / Anmelden) | Formular ok, nicht abgeschickt (kein Testkonto angelegt) |
| Home-Lernpfad, Münzen, Stationen | ok |
| Themenkarte `#/thema/N` | ok, baut sich erst nach ~1–2 s auf (vorher leer) |
| Session: Anknüpfen (KI) | ok |
| Videos eingebettet, Notiz mit Zeitmarke, „Gesehen · weiter“ | ok |
| Lernzettel + Vollbild (Teilen / Bild / PDF) | Anzeige ok; Teilen/Bild/PDF nicht ausgelöst |
| Verständnischeck (KI, Bewertung je Antwort) | ok |
| Wiederholungs-Station, Karten (Nochmal/Schwer/Gut/Leicht) | ok |
| Prüfungsmodus (Vorschlag + Themenliste) | ok |
| Statistik (Bereiche, Aufklappen mit Kreis) | ok |
| Wochenrückblick | ok |
| Austausch lokal + @KI | ok |
| Profil (Wissensstand, Stärken, Nach 90 Tagen, KI, Sicherung) | ok |

**Behoben (Commit dieser Session):**
- Profil „Nach den 90 Tagen“ zeigte immer „Noch 90 Sessions“, auch bei 77 Sessions im Pfad → zählt jetzt den eigenen Pfad.
- Kanal-Chat-KI sollte Sessions mit „Tag-Nummer“ nennen und bekam interne Kürzel (`[BIO – …]`) → nur noch Titel.

**Offen (Fehler / Schwächen):**
1. **Keine Error-Boundary:** Ein Renderfehler in irgendeiner Komponente = weißer Bildschirm. Für eine Store-App Pflicht (Review-Abbruch = Ablehnung).
2. **KI-Sachfehler:** Anknüpfen behauptete, eine Zelle sei „Millionen mal kleiner als ein Sandkorn“ (tatsächlich ~10–100×). Qwen 27B ist für eine bezahlte Lern-App knapp; Fakten in Prompts stärker an Lernzettel binden.
3. **`is_ki` setzt der Client:** Jeder angemeldete Nutzer kann eine Nachricht als „KI“ posten (RLS prüft das nicht). Lösung: KI-Antworten im Chat über die Edge Function schreiben, `is_ki` per Policy nur für die Service-Role.
4. **Barrierefreiheit:** Eingabefelder im Konto-Formular ohne verknüpftes Label, Wissensstand-Knöpfe und Video-Knöpfe ohne zugänglichen Namen. VoiceOver liest „Taste“. Apple prüft das nicht hart, aber es kostet Bewertungen.
5. **Lernpfad:** Antippen der Beschriftung neben einer Münze öffnet nichts, nur die Münze selbst.
6. **Wiederholungs-Station** zeigt „noch 27“, weil zu den eigenen Karten bis zu 20 fällige anderer Sessions kommen – so gewollt, aber für Nutzer unerwartet.
7. **Regel „keine Erklärtexte“** an zwei Stellen verletzt: Leerzustand der Video-Notizen („Tippen, während das Video läuft …“) und Abschlusswiederholung („Alle Sessions gemischt – die unsichersten Karten zuerst …“).
8. **Bundle 729 kB** (230 kB gzip) in einem Stück – Intro, Diagramme, Symbole könnten nachgeladen werden. Für eine native App unkritisch, für die Web-Version spürbar.

## 2 · Was für den App Store fehlt

### Pflicht (sonst Ablehnung)

| # | Punkt | Warum | Aufwand |
|---|---|---|---|
| 1 | **Native Hülle** (Capacitor) | PWAs kommen nicht in den App Store. Capacitor packt den Vite-Build in iOS/Android. | 1–2 Tage |
| 2 | **Mehr als eine Website** | Richtlinie 4.2 (Minimum Functionality): reine Web-Hüllen werden abgelehnt. Native Teile: Push-Erinnerungen, Teilen-Dialog, Haptik, ggf. Widget. | 2–3 Tage |
| 3 | **Konto löschen in der App** | Richtlinie 5.1.1(v), auch Google Play. Edge Function `delete-account` (Service-Role löscht `auth.users` → Kaskade). | ½ Tag |
| 4 | **Datenschutzerklärung + Impressum** | App Store Connect verlangt eine Datenschutz-URL; Impressum nach § 5 DDG bei kommerziellem Angebot. In der App verlinkt (Profil + Registrierung). | 1 Tag + ggf. Anwalt |
| 5 | **Melden / Blockieren im Austausch** | Richtlinie 1.2 (nutzergenerierte Inhalte): Filter, Melden, Blockieren, Kontaktmöglichkeit. Heute nur Löschen durch Editor. | 1–2 Tage |
| 6 | **Nutzung ohne Konto** | Richtlinie 5.1.1: Registrierung nur, wo nötig. Lernpfad, Videos, Lernzettel, Karten gehen ohne Konto (lokaler Modus existiert schon); Konto erst für KI und Austausch. | ½ Tag |
| 7 | **Minderjährige** | Zielgruppe ab Klasse 5 (≈ 10 Jahre). DSGVO Art. 8 (Deutschland: 16 Jahre), offener Chat mit Fremden, KI-Chat. Altersfrage beim Start; unter 16: Austausch nur mit Freunden, kein öffentlicher Kanal; Altersfreigabe im Store passend wählen. | 1 Tag + Rechtsklärung |
| 8 | **KI-Anbieter klären** | Lernende schicken Notizen und Antworten an `ai.inference2.corpus.music`. Für den Launch: Auftragsverarbeitungsvertrag, Serverstandort (EU), in der Datenschutzerklärung nennen. Datenschutz-Angaben im Store („Daten an Dritte“). | organisatorisch |
| 9 | **Privacy Manifest + Store-Angaben** | `PrivacyInfo.xcprivacy`, Datenschutz-Etiketten, Screenshots (6,9″ + 6,5″, iPad falls unterstützt), Support-URL, Beschreibung, Altersfragebogen. | 1 Tag |
| 10 | **Fortschritt im Konto speichern** | Heute nur localStorage: Handywechsel oder Neuinstallation = alles weg (Export/Import gibt es, findet aber kaum jemand). In einer nativen App kann iOS den WebView-Speicher bei Platzmangel leeren. Tabelle `progress` (JSON je Konto, RLS) + Sync beim Start/Schließen. | 2–3 Tage |

### Stark empfohlen

- **Error-Boundary + Absturzmeldungen** (Sentry o. ä., datensparsam).
- **Push-Erinnerung** „Deine Session wartet“ – wichtigster Hebel für einen 90-Tage-Plan (Capacitor Local Notifications, ohne Server).
- **Teilen / PDF nativ:** `window.print()` tut im iOS-WebView nichts, `navigator.share` mit Dateien ist unsicher → Capacitor Share + Filesystem.
- **Statusleiste oben:** `viewport-fit=cover` ist gesetzt, `.app` hat oben aber keinen `safe-area-inset-top` → im nativen Build prüfen, ob die Seitenköpfe unter die Uhr rutschen.
- **Supabase auf bezahlten Plan:** Free-Projekte pausieren bei Inaktivität, Backups fehlen.
- **Passwort-vergessen-Ablauf** im nativen Build testen (Deep Link statt Pages-URL als Site URL).
- **Inhalte für alle:** Wissensstand ist auf Gymnasium Bayern (LehrplanPLUS G9) zugeschnitten. Für den Store mindestens „anderes Bundesland / andere Schulart“ abfangen (grob nach Jahrgang statt Lehrplan).
- **Eigener-Key-Feld** im Store-Build ausblenden (verwirrt, und Apple könnte es als Umgehung des In-App-Kaufs werten, sobald es Premium gibt).

### Grobe Reihenfolge

1. Error-Boundary, Konto löschen, Datenschutz/Impressum, Melden/Blockieren, ohne Konto nutzbar (≈ 1 Woche)
2. Fortschritt-Sync, Minderjährigen-Regeln, KI-Anbieter-Vertrag
3. Capacitor + Push + natives Teilen, TestFlight mit 10–20 Testern
4. Store-Einträge, Review einreichen

Kosten: Apple Developer Program 99 $/Jahr, Google Play einmalig 25 $, Supabase Pro ab 25 $/Monat, dazu KI-Kosten je aktivem Nutzer.

## 3 · Premium-Plan

### Grundsatz

Kostenlos bleibt **der ganze Lernweg**: alle 90 Sessions, alle Videos, Lernzettel, Notizen, Karteikarten, Lernpfad mit Stationen, Grundstatistik, Wochenrückblick. Wer nie zahlt, kommt vollständig durch den Plan.
Premium kauft **Tiefe, Tempo und Komfort** – vor allem mehr und bessere KI, die echtes Geld kostet.

Zwei harte Grenzen:
- **Videos nie hinter die Bezahlschranke.** Es sind YouTube-Inhalte anderer; Geld für den Zugang zu verlangen widerspricht den YouTube-Bedingungen und wäre auch inhaltlich unfair.
- **Kein Datenverlust als Druckmittel.** Sicherung (Export) bleibt kostenlos; Premium macht sie nur automatisch.

### Aufteilung

| Funktion | Kostenlos | Premium |
|---|---|---|
| Lernpfad, Sessions, Videos, Lernzettel, Notizen | voll | voll |
| Karteikarten (SRS), Wiederholungs-Stationen | voll | voll |
| Anknüpfen + Verständnischeck je Session | 1 Session pro Tag (= Plantempo) | unbegrenzt, Sessions vorziehen |
| „Deine Fragen“ an die KI | 5 pro Session | unbegrenzt |
| KI-Modell | Standardmodell | stärkeres Modell + Denkmodus, Faktencheck gegen Lernzettel |
| Prüfungsmodus | 1 Test pro Woche | unbegrenzt, plus Prüfungssimulation über mehrere Themen |
| Statistik | Prozent je Bereich, Wochenrückblick | Verlauf über Zeit, Vergessenskurve je Thema, Antwortzeit/Präzision, Schwächen-Bericht |
| Fortschritt-Sync zwischen Geräten | manuell (Export/Import) | automatisch |
| Lernzettel | fertige Zettel, Bild/PDF | persönlicher Zettel aus eigenen Notizen und Fehlern im Check, Sammel-PDF aller Zettel |
| Karten | automatisch aus der Session | eigene Karten, KI-Karten aus Notizen, Karten zu Fehlern |
| Austausch | Kanäle, Freunde, @KI 3× pro Tag | @KI unbegrenzt, Lerngruppe mit gemeinsamem Ziel, Quiz-Duell mit Freunden |
| Nach Tag 90 | Erhaltungsmodus (Karten + Prüfung) | Pfade A/B/C als neue Sessions (Breit / Spezialisieren / Hybrid) |
| Eigene Themen | – | „Ich will X verstehen“ → KI baut eine Session mit Teilthemen, Videosuche, Lernzettel, Check |
| Hören | – | Lernzettel als Audio (Vorlesen) für Weg/Sport |
| Streak | normal | 2 Streak-Schutztage pro Monat |

### Was man reduzieren sollte

- **Statistik-Kennzahlen im Profil** („Präzision“, „Ø Zeit“) aus der kostenlosen Ansicht nehmen – für Einsteiger Rauschen, für Premium der Kern des Schwächen-Berichts.
- **Einführung** von 6 auf 4 Folien kürzen (Kreislauf + Aufruf zusammen) – der Weg zur ersten Session ist der wichtigste Moment.
- **Eigener-KI-Key** aus dem Store-Build entfernen (nur Web/Entwicklung).
- **Öffentliche Kanäle** zum Start auf wenige beschränken (Allgemein + 3–4 große Bereiche) – 15 leere Kanäle wirken tot und kosten Moderation.

### Preis

- Monatlich ca. 4,99 €, jährlich ca. 34,99 € (≈ 3 €/Monat), 7 Tage kostenlos testen.
- Optional „90-Tage-Pass“ einmalig ca. 14,99 € – passt zum Plan und senkt die Hürde für Leute, die kein Abo wollen.
- Schülerrabatt lohnt sich wegen der Zielgruppe; über Apple/Google nur als eigenes, günstigeres Produkt umsetzbar.
- Bezahlung zwingend über In-App-Kauf (Apple 3.1.1, Google Play Billing). Gebühr 15 % im Small-Business-Programm. RevenueCat erspart Belegprüfung und bündelt Web, iOS, Android.

### KI-Kosten im Blick

Eine Session braucht grob 4–8 KI-Aufrufe (Anknüpfen, Fragen, Check, Zusammenfassung + Karten) mit je einigen tausend Tokens Kontext, weil `sessionContext` alle abgeschlossenen Sessions mitschickt.
- Vor Premium messen: Tokens je Session aus `ki_usage` (Spalte für Tokens ergänzen).
- Kontext kürzen (nur verknüpfte Sessions statt aller), dann rechnet sich auch ein stärkeres Modell im Abo.
- Limits serverseitig in der Edge Function durchsetzen (Stufe aus der Abo-Tabelle), nie nur in der App.

### Umsetzung in Schritten

1. **Abo-Status:** Tabelle `entitlements` (Konto, Stufe, gültig bis), befüllt per RevenueCat-Webhook; `useAuth` liefert `plan: 'free' | 'premium'`.
2. **Limits:** Edge Function `ki` zählt je Art (Check, Fragen, Prüfung, Chat) statt pauschal 300/Tag; App zeigt beim Erreichen einen ruhigen Kasten mit „Premium“-Knopf (keine Erklärzeilen, siehe Regel).
3. **Premium-Kern zuerst:** Sync, unbegrenzte Fragen/Prüfung, stärkeres Modell – das ist mit wenig Code verkauft.
4. **Danach Neues:** Eigene Themen, Pfade nach Tag 90, Schwächen-Bericht, Audio.
5. **Bezahlseite** im Tusche-Stil: eine Seite, Vergleich in zwei Spalten, Testphase, Wiederherstellen-Knopf (Apple verlangt „Käufe wiederherstellen“).
