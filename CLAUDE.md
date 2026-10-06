# Allgemeinwissen – Arbeitsweise

PWA (Vite + React + TypeScript) für Julius' 90-Tage-Lernplan „Allgemeinwissen (kristalline Intelligenz)“.
Live: https://juliusnit.github.io/Allgemeinwissen/ · Repo: https://github.com/JuliusNit/Allgemeinwissen

## GitHub ist die Quelle der Wahrheit

- Vor der ersten Änderung: `git pull --rebase origin master`
- Nach jeder abgeschlossenen Änderung: committen und `git push origin master`, danach `npm run deploy`
  (baut und ersetzt den Branch `gh-pages` – der enthält nur Build-Ergebnisse)
- Kein Force-Push auf `master`. Secrets nie ins Repo.

## Aufbau

- `src/data/plan.ts` – kompletter Lehrplan: Bereiche (Farben), Blöcke, 90 Tage mit Teilthemen und
  `links` (frühere Sessions zum Anknüpfen). Phase-2-Teilthemen und Verknüpfungen wurden ergänzt, nicht von Julius vorgegeben.
  Videos: pro Teilthema ein ausgewähltes YouTube-Video aus `src/data/videos.ts` (per Suche gefunden, von Hand gewählt,
  per oEmbed auf „existiert + einbettbar“ geprüft; bevorzugt Studyflix, simpleclub, MrWissen2go, Terra X, Kurzgesagt).
  Fehlt ein Eintrag, gibt es einen Suchlink. Gespeicherte, unveränderte Suchlinks ersetzt `upgradeVideos` automatisch;
  Julius kann jedes Video über ✎ oder „anderes Video“ tauschen.
- `src/components/VideoWatch.tsx` + `src/lib/video.ts` – Videos laufen eingebettet (YouTube-IFrame-API über
  youtube-nocookie, Vimeo) unter `#/tag/N/video/ID[/Sekunden]`; Notizen am Rand mit Zeitmarke (`videoNotes`),
  Pause beim Tippen, letzte Position (`videoPos`). Suchlinks lassen sich nicht einbetten → dort Video wählen + Link einfügen.
- `src/lib/store.ts` – gesamter Zustand in localStorage (`allgemeinwissen-v1`), Export/Import für Gerätewechsel (ohne API-Key).
  Enthält auch Profil (Name, Bild), Kartenprotokoll, Wiederholungs-Stationen, Community-Nachrichten, Spezialisierungswahl.
- `src/lib/ai.ts` – OpenAI-kompatibler Endpunkt per fetch/SSE direkt aus dem Browser. Ohne eigenen Key geht jede Anfrage über den
  KI-Proxy `supabase/functions/ki` (Edge Function, Key als Secret `LLM_KEY`, nur für angemeldete Konten, Tageslimit
  `KI_DAILY_LIMIT` über `003_ki_limit.sql`). Standard: Qwen `qwen3.8-27b` auf
  `ai.inference2.corpus.music` (vLLM, CORS offen). **Key nie ins Repo** – Julius trägt ihn unter Profil → KI ein.
  Modi: Anknüpfen, Fragen, Verständnischeck (Ende über `[[SESSION_ABGESCHLOSSEN]]`, Bewertung je Antwort über
  `[[BEWERTUNG: richtig|teilweise|falsch | 1-5]]`), Lernzettel + Karten (json_schema), Stärkenberatung, Kanal-Chat.
- `src/lib/stats.ts` – wertet Marker + Zeitstempel aus (richtig, Antwortzeit, Präzision) je Session/Überthema.
- `src/lib/path.ts` – Lernpfad je Wissensstand (`buildPath(level)`): zuerst Grundwiederholung (je Schulfach eine Station `g-<fach>`
  mit KI-Grundcheck; die Schulstoff-Sessions hängen an der Station statt im Pfad), Trennlinie, dann der neue Stoff mit
  Abruf-Station nach je 4 Sessions, „Auffrischung“ (`g-auffrischung`) am Blockende nahe der Mitte, am Ende
  Abschlusswiederholung (`w-ende`, unsicherste Karten) + Grundwissen-Check (`g-abschluss`). Begründung im Kommentar.
  Ansicht der Stationen: `src/views/BasisView.tsx` (Route `#/wiederholung/g-…`), Chat in `basis` im Zustand.
- `src/lib/srs.ts` – vereinfachtes SM-2 für Karteikarten.
- `src/lib/ink.ts`, `components/Ink.tsx`, `Icons.tsx`, `Coin.tsx` – Tusche-Optik: exakte Formen, Strichbreite je nach Richtung.
- Design: schwarz auf weiß, Schraffur statt Flächen, Farbe nur grün/rot in der Statistik. Navigation unten:
  Prüfung · Austausch · Home (Lernpfad) · Statistik · Profil.
- **Regel keine Erklärtexte (gilt für jede Änderung):** Keine hellgrauen Hinweis-/Erklärzeilen (`muted small` o. ä.), die
  beschreiben, was die Oberfläche ohnehin zeigt – keine Legenden („Grün = …“), Bedienhinweise („Antippen öffnet …“),
  Untertitel, die die Überschrift umschreiben, oder Methodik-Erklärungen. Erlaubt bleiben nur echte Information:
  Metadaten (Tag, Fach, Datum), Leer-/Ladezustände, Fehlermeldungen, Quellenangaben.
- **Regel Tusche-Optik (gilt für jede Änderung):** Alles außer Schrift – Kästen, Knöpfe, Felder, Chips, Trennlinien,
  Icons – sieht aus wie die Münzen auf Home: kräftiger, handgezeichneter Tusche-Strich (Federwinkel + Pinsel-Druckwechsel),
  nie ein glatter CSS-Rand/-Schatten. Umsetzung:
  - Kästen: `Frame`/`InkBorder` (`components/Ink.tsx`), freie Formen: `InkPaths` mit Strichen aus `lib/ink.ts`.
  - Alle übrigen CSS-Ränder zeichnet `src/lib/pen.ts` automatisch als Tusche (liest Breite/Farbe/Radius/gestrichelt aus dem CSS,
    Strich = Randbreite × 1,45). Neues Element mit Rand → Selektor in `SELECTOR` ergänzen oder `data-pen` setzen.
    Schraffur-Hintergründe auf solchen Elementen über `--hatch` statt `background`. Knöpfe (`.btn`) haben wie Münzen einen
    Rand darunter (`--pen-rim`, Füllung `--pen-fill`); kein `box-shadow`/`transform` für 3D-Effekte.
- `src/views/ExamView.tsx` + `src/lib/exam.ts` – Prüfungsmodus `#/pruefung[/N]`: abgeschlossene Themen nach Dringlichkeit
  (Schwäche + Zeit seit letztem Abruf), oben Vorschlag, Münze fährt Kasten aus; Test = 1 Verständnis- + 1 Transferaufgabe
  (`examChat`), Ergebnisse in `exams`.
- `src/views/Onboarding.tsx` – erster Start: 5 Slides (fluide vs. kristalline Intelligenz), dann Konto anlegen
  (E-Mail, Name, Passwort mit Stärke – Pflicht: 8+ Zeichen, klein/groß, Zahl, Sonderzeichen – + Wiederholung) und Wissensstand.
  Ohne Supabase nur Name + Wissensstand lokal.
- `src/data/school.ts` – Wissensstand (Schule + Klasse / Studium / Ausbildung-Beruf), `SCHOOL_GRADE` (Jahrgangsstufe je Tag nach
  bayerischem LehrplanPLUS, Gymnasium G9) und `DAY_FACH` (Schulfach je Schulstoff-Tag). `src/data/lehrplan.ts` – Lernbereiche
  je Fach und Jgst. 5–13 aus lehrplanplus.bayern.de (gekürzt), Grundlage für Grundcheck und Stationsseite. Studium/Beruf: aller Schulstoff = Wiederholungstag; Schule Kl. G: Stoff < G.
  Wiederholungstage: in der Grundwiederholung (Station ihres Fachs), Videos optional, Prompts fragen Teilthemen ab und suchen Lücken.
- Rollen: `user` (Standard) und `editor` (nur per SQL vergeben, Trigger schützt die Spalte). Nur der Editor ändert
  Videolisten (✎, ★, + Video, „anderes Video“) – gespeichert in `day_videos` für alle; darf außerdem jede Chat-Nachricht löschen.
- Austausch: Kanäle ohne „#“ (IDs bleiben Slugs), Freunde (Suche nach Name, Anfrage → annehmen) + Direktnachrichten
  (`messages.channel = 'dm'` + `recipient`, nur unter Freunden lesbar/schreibbar) – `supabase/004_freunde.sql`.
  Routen `#/chat/freunde`, `#/chat/dm-<konto-id>`.
- `src/lib/cloud.ts` + `supabase/schema.sql` + `supabase/002_konten_rollen.sql` – Konten (E-Mail/Passwort, implicit flow – Bestätigungslink meldet auch in anderem Browser an; Site URL = Pages-Adresse),
  Austausch-Chat (RLS, Realtime), Editor-Inhalte. Name/Wissensstand liegen in den user_metadata, Fortschritt bleibt lokal.
  Konfiguration beim Bauen aus der lokalen `.env` (gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` (Publishable Key).
  Ohne Werte läuft der Chat nur lokal – vor `npm run deploy` prüfen. `VITE_DEV_LLM_KEY` gilt nur für `npm run dev`
  und darf nie in den Build gelangen (nach dem Build `dist/` auf `sk-` prüfen).
- `src/components/Markdown.tsx` – eigener Renderer ohne innerHTML.
- `scripts/icons.mjs` – erzeugt PWA-Icons; `scripts/deploy.mjs` – Deploy auf gh-pages.

## Regeln aus dem Lernplan (in den Prompts umgesetzt)

- Verständnischeck erst nach „verstanden“, 3–5 Fragen, eine nach der anderen, nur Inhalt der ★-Pflichtvideos,
  keine reinen Wiedergabefragen; bei Fehlern erklären + Nachfrage zum gleichen Punkt.
- MIX-Tage (17, 30, 43, …): ganze Block-Abfrage, keine Videos. Tag 5 ist ein normaler Tag mit Videos.
- BIO (Phase 2) und PSY: Evidenzcheck „belegt vs. Hype“.
- Zusammenfassung nur Stichpunkte + Grafik (Tabelle/Text-Diagramm).

## Hinweise

- Claude Code blockiert das öffentliche Veröffentlichen (Repo öffentlich machen, Pages einschalten) – das erledigt Julius selbst.
- Tokens/Zugangsdaten nie selbst setzen; `gh auth login` macht Julius.
- Antworten an Julius auf Deutsch, knapp.
