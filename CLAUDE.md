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
- `src/lib/store.ts` – gesamter Zustand in localStorage (`allgemeinwissen-v1`), Export/Import für Gerätewechsel (ohne API-Key).
- `src/lib/ai.ts` – Claude direkt aus dem Browser (`dangerouslyAllowBrowser`, Key vom Nutzer in den Einstellungen).
  Standardmodell `claude-opus-5-5`, Fallback `fallbacks: "default"` (Beta `server-side-fallback-2026-07-01`).
  Modi: Anknüpfen, Fragen, Verständnischeck (Ende über Marker `[[SESSION_ABGESCHLOSSEN]]`), Zusammenfassung + Karteikarten (Structured Output).
- `src/lib/srs.ts` – vereinfachtes SM-2 für Karteikarten.
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
