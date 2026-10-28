var e=`## Mittelwert, Median, Modus\r
\r
\`\`\`gruppen\r
Arithmetisches Mittel\r
  Summe ÷ Anzahl\r
  empfindlich gegen **Ausreißer**\r
Median\r
  der **mittlere** Wert der sortierten Reihe (bei gerader Anzahl: Mittel der beiden mittleren)\r
  robust gegen Ausreißer\r
Modus (Modalwert)\r
  der **häufigste** Wert\r
  auch für Kategorien (häufigste Lieblingsfarbe)\r
\`\`\`\r
\r
- Beispiel Einkommen: 9 Menschen verdienen 3000 €, einer 300 000 € → Mittelwert **32 700 €**, Median **3000 €**. Deshalb nennt die Statistik beim Einkommen meist den Median\r
- Faustregel: Liegt der Mittelwert weit über dem Median, ist die Verteilung **rechtsschief** (wenige sehr große Werte: Einkommen, Vermögen, Follower)\r
- „Der Durchschnittsdeutsche“ existiert oft nicht: Mittel aus 1 und 3 Kindern ist 2 – niemand hat vielleicht genau 2\r
\r
## Normalverteilung und Standardabweichung\r
\r
- **Standardabweichung σ**: typischer Abstand der Werte vom Mittelwert – misst die **Streuung** (zwei Klassen mit Schnitt 3,0 können völlig verschieden sein)\r
- **Normalverteilung** (Gaußsche Glockenkurve): entsteht, wenn viele kleine, unabhängige Einflüsse zusammenwirken (Körpergröße, Messfehler, IQ)\r
\r
\`\`\`kurve\r
x: Abstand vom Mittelwert in σ\r
y: Häufigkeit\r
_: -3 0.4, -2 5.4, -1 24.2, 0 39.9, 1 24.2, 2 5.4, 3 0.4\r
xmarken: -3, -2, -1, 0, 1, 2, 3\r
\`\`\`\r
\r
| Bereich | Anteil der Werte |\r
|---|---|\r
| Mittelwert ± 1σ | ~68 % |\r
| ± 2σ | ~95 % |\r
| ± 3σ | ~99,7 % |\r
\r
- Beispiel IQ: Mittel 100, σ = 15 → 68 % zwischen 85 und 115, 95 % zwischen 70 und 130\r
- Nicht alles ist normalverteilt: Einkommen, Stadtgrößen, Erdbebenstärken folgen eher „Potenzgesetzen“ mit langen Schwänzen – dort sind Extremwerte viel häufiger als die Glocke erwarten lässt\r
\r
## Grafiken, die täuschen\r
\r
\`\`\`gruppen\r
Abgeschnittene y-Achse\r
  Achse startet nicht bei 0 → kleiner Unterschied wirkt riesig (Balken von 50 % und 52 % wie halb und voll)\r
Gestauchte oder gestreckte Achsen\r
  flache oder steile Kurve, je nach gewünschter Botschaft\r
Ausgewählter Zeitraum\r
  nur das Stück zeigen, das passt (Rosinenpicken)\r
3D- und Flächenbilder\r
  doppelte Höhe einer Figur = vierfache Fläche, achtfaches Volumen\r
Absolute statt relative Zahlen\r
  „mehr Unfälle in Bayern“ – Bayern hat auch mehr Einwohner\r
Zwei y-Achsen\r
  zwei Kurven scheinbar parallel → falscher Zusammenhang\r
Kreisdiagramm, das nicht 100 % ergibt\r
\`\`\`\r
\r
- Prüffragen: Wo beginnt die Achse? Welcher Zeitraum, welche Quelle? Absolut oder pro Kopf? Was fehlt?\r
- „Mit Statistik lügen“ (Darrell Huff, 1954) – meist wird nicht gelogen, sondern **geschickt gezeigt**\r
\r
> Eine Zahl ohne Streuung, Bezugsgröße und Achse ist keine Information, sondern eine Behauptung.\r
`;export{e as default};