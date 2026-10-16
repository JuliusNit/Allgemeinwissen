var e=`## Popper: Wissen ist Vermutungswissen

- **1919**: Newtons Gravitationstheorie galt seit über 200 Jahren als sicherstes Wissen. Einstein sagte voraus, dass die Sonne Sternenlicht um **1,75 Bogensekunden** ablenkt → Sonnenfinsternis-Expedition (Brasilien, Príncipe) bestätigt es → Newton musste korrigiert werden
- **Karl Popper** (1902–1994), damals 17: Wenn selbst Newton fallen kann, gibt es **kein sicheres Wissen**, nur **Vermutungswissen**, das sich der Wahrheit annähert

| | Induktion („Kübeltheorie“) | Falsifikation (Popper) |
|---|---|---|
| Vorgehen | Beobachtungen sammeln → Gesetz ableiten | kühne Hypothese aufstellen → **aktiv versuchen, sie zu widerlegen** |
| Problem / Stärke | 1 Mio. weiße Schwäne beweisen nicht „alle Schwäne sind weiß“ | **ein schwarzer Schwan** (Australien) widerlegt es sofort |
| Wissenschaftlich ist … | was oft bestätigt wurde | was **widerlegbar** ist und Widerlegungsversuchen standhält |

\`\`\`kreis
Problem, Beobachtung
Hypothese | kühn und prüfbar
Vorhersage | „wenn wahr, dann …“
Experiment | Versuch der Widerlegung
Ergebnis | bewährt oder verworfen
Mitte: kritischer Rationalismus
\`\`\`

> Eine Theorie, die **nichts** verbietet, kann nicht scheitern – und ist deshalb nicht wissenschaftlich.

- Popper politisch: **offene Gesellschaft** (Kritik erlaubt, Fehler korrigierbar) vs. **geschlossene Gesellschaft** (Tabus, Dogmen, Herrscher „von Gottes Gnaden“; Galilei vor dem Kirchengericht)
- Kritik an **Utopien** (Platons Philosophenstaat, Marx, NS): Wer das Endziel der Geschichte zu kennen glaubt, duldet keine Kritik → totalitär
- stattdessen **Stückwerk-Technik**: kleine Reformen, testen, aus Fehlern lernen (wie ein Gärtner, nicht mit dem Bulldozer)
- Spätwerk „Alles Leben ist Problemlösen“: Wissenschaft setzt die Evolution fort – Versuch und Irrtum von der Amöbe bis Einstein

## Kontrollierte Studien

\`\`\`kette
Teilnehmer
→ randomisiert: Zufall teilt ein
Wirkstoffgruppe · Kontrollgruppe (Placebo) | doppelblind: weder Patient noch Arzt wissen, wer was bekommt
→ Ergebnisse vergleichen
Unterschied = Wirkung des Mittels
\`\`\`

| Merkmal | bedeutet | schützt vor |
|---|---|---|
| **Kontrollgruppe** | Vergleich mit Gruppe ohne Behandlung | „Es wäre sowieso besser geworden“ |
| **placebokontrolliert** | Vergleichsgruppe bekommt Scheinmedikament | **Placeboeffekt** (Besserung durch Erwartung) |
| **randomisiert** | zufällige Zuteilung, nicht nach Gefühl des Arztes | unbewusster Auswahl, versteckten Unterschieden |
| **doppelblind** | Patient **und** Arzt kennen die Gruppe nicht | Erwartungen bei Patient und Bewertung |

- bei schweren Krankheiten (Krebs) wäre Placebo unethisch → Vergleich mit der bisherigen Standardtherapie
- Goldstandard: **RCT** (randomized controlled trial)

## Evidenzpyramide

\`\`\`pyramide
Pfeil: Aussagekraft
Metaanalyse | Studien statistisch zusammengerechnet
Systematisches Review | alle Studien nach festen Regeln gesichtet
RCT | randomisierte kontrollierte Studie
Kohortenstudie | Gruppe über Jahre beobachtet (Panel)
Querschnittstudie | Befragung zu einem Zeitpunkt
Fallbericht, Expertenmeinung | Einzelperson, Einzelfall
\`\`\`

- je weiter oben, desto weniger Zufall und Verzerrung; viele Studien → niemand kann alles lesen → Reviews und Metaanalysen fassen zusammen
- Grenzen der Metaanalyse: nur so gut wie die Studien darin (*garbage in, garbage out*); Auswahl und Gewichtung der Studien prägen das Ergebnis
- Kausalität ohne RCT: Rauchen → Lungenkrebs wurde durch **viele unabhängige, wiederholte** Beobachtungsstudien gesichert

## Peer Review und Replikationskrise

- **Peer Review**: Fachkollegen prüfen eine Studie vor der Veröffentlichung – filtert grobe Fehler, garantiert aber keine Wahrheit
- **Replikation** = Experiment unabhängig wiederholen; erst wenn es klappt, ist ein Befund belastbar

\`\`\`balken
Krebsstudien bei Amgen reproduziert: 11 | nur 11 % von über 50
Forscher sehen „deutliche Krise“: 52 | 52 %
Forscher sehen „leichte Krise“: 38 | 38 %
\`\`\`

- Gründe:
  - **Betrug** und **p-Hacking** (Daten so lange auswerten, bis etwas „signifikant“ ist)
  - **Analyse-Freiheit**: 29 Teams, gleiche Daten zu roten Karten → 20 fanden einen Effekt, 9 keinen
  - **Zufall**: kleine Stichproben, Ausreißer → **Regression zur Mitte** beim Wiederholen
  - **Publikationsdruck**: Neues zählt, Wiederholungen und Nullergebnisse kaum
- warum p < 0,05 wenig beweist – 1000 Studien, nur 100 echte Effekte:

\`\`\`balken
echte Treffer: 60 | 60 (bei 60 % Trefferquote)
Fehlalarme (5 % von 900): 45 | 45 → 43 % der „Funde“ falsch
\`\`\`

- Lösungen: Replikationen finanzieren, **Nullergebnisse veröffentlichen**, Daten offenlegen, Studien **vorab registrieren**, strengere Schwelle (p < 0,005)
- Beispiel Power Posing: 2010 viral (TED-Talk mit über 40 Mio. Aufrufen), Replikationen scheiterten, Debatte läuft weiter

> Replikationskrise heißt nicht „Wissenschaft ist kaputt“, sondern: **Selbstkorrektur funktioniert** – eine einzelne Studie ist nie das letzte Wort.
`;export{e as default};