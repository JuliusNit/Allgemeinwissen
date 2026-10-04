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
  Videos: pro Teilthema ein YouTube-**Suchlink** (bewusst keine ungeprüften Direktlinks); Julius ersetzt sie in der App über ✎.
- `src/components/VideoWatch.tsx` + `src/lib/video.ts` – Videos laufen eingebettet (YouTube-IFrame-API über
  youtube-nocookie, Vimeo) unter `#/tag/N/video/ID[/Sekunden]`; Notizen am Rand mit Zeitmarke (`videoNotes`),
  Pause beim Tippen, letzte Position (`videoPos`). Suchlinks lassen sich nicht einbetten → dort Video wählen + Link einfügen.
- `src/lib/store.ts` – gesamter Zustand in localStorage (`allgemeinwissen-v1`), Export/Import für Gerätewechsel (ohne API-Key).
  Enthält auch Profil (Name, Bild), Kartenprotokoll, Wiederholungs-Stationen, Community-Nachrichten, Spezialisierungswahl.
- `src/lib/ai.ts` – OpenAI-kompatibler Endpunkt per fetch/SSE direkt aus dem Browser. Standard: Qwen `qwen3.8-27b` auf
  `ai.inference2.corpus.music` (vLLM, CORS offen). **Key nie ins Repo** – Julius trägt ihn unter Profil → KI ein.
  Modi: Anknüpfen, Fragen, Verständnischeck (Ende über `[[SESSION_ABGESCHLOSSEN]]`, Bewertung je Antwort über
  `[[BEWERTUNG: richtig|teilweise|falsch | 1-5]]`), Lernzettel + Karten (json_schema), Stärkenberatung, Kanal-Chat.
- `src/lib/stats.ts` – wertet Marker + Zeitstempel aus (richtig, Antwortzeit, Präzision) je Session/Überthema.
- `src/lib/path.ts` – Lernpfad: 90 Tage + Wiederholungs-Station nach je 4 Sessions (Begründung im Kommentar).
- `src/lib/srs.ts` – vereinfachtes SM-2 für Karteikarten.
- `src/lib/ink.ts`, `components/Ink.tsx`, `Icons.tsx`, `Coin.tsx` – Tusche-Optik: exakte Formen, Strichbreite je nach Richtung.
- Design: schwarz auf weiß, Schraffur statt Flächen, Farbe nur grün/rot in der Statistik. Navigation unten:
  [frei] · Austausch · Home (Lernpfad) · Statistik · Profil.
- `src/lib/cloud.ts` + `supabase/schema.sql` – Austausch-Chat über Supabase (anonyme Anmeldung, RLS, Realtime).
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
