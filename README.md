# Allgemeinwissen – 90-Tage-Lernplan

PWA für den Lernplan „Allgemeinwissen (kristalline Intelligenz)“.

- **Heute**: aktuelle Session mit Anknüpfen (KI ordnet auf Zeitstrahl/Karte ein), ★-Pflichtvideos, Notizen,
  eigene Fragen, Verständnischeck nach „verstanden“ (3–5 Fragen, eine nach der anderen) und automatischer Zusammenfassung
- **Plan**: alle 90 Tage nach Blöcken mit Status
- **Landkarte**: Fortschritt je Überthema
- **Wiederholen**: Spaced-Repetition-Karteikarten (entstehen beim Abschluss jeder Session) + alle Zusammenfassungen
- **Einstellungen**: Anthropic-API-Key, Modell, Export/Import für den Gerätewechsel

Lehrplan-Inhalte: `src/data/plan.ts`. Alle Daten liegen lokal im Browser (localStorage).

```bash
npm install
npm run dev      # Entwicklung
npm run build    # Produktion nach dist/ (statisch, überall hostbar)
node scripts/icons.mjs   # Icons neu erzeugen
```

## Veröffentlichen

```bash
npm run deploy   # baut und pusht dist/ auf den Branch gh-pages
```

Live: https://juliusnit.github.io/Allgemeinwissen/
