var e=`## Das Ziegenproblem (Monty-Hall-Problem)\r
\r
- Drei Türen: hinter einer ein Auto, hinter zweien Ziegen. Du wählst Tür 1. Der Moderator, **der weiß, wo das Auto ist**, öffnet eine andere Tür mit einer Ziege. Wechseln?\r
- Antwort: **Ja – Wechseln gewinnt mit 2/3**, Bleiben nur mit 1/3\r
\r
\`\`\`baum\r
erste Wahl\r
  Auto (1/3) | Moderator öffnet irgendeine Ziegentür\r
    bleiben: Auto ✓\r
    wechseln: Ziege\r
  Ziege A (1/3) | Moderator **muss** Ziege B zeigen\r
    bleiben: Ziege\r
    wechseln: Auto ✓\r
  Ziege B (1/3) | Moderator **muss** Ziege A zeigen\r
    bleiben: Ziege\r
    wechseln: Auto ✓\r
\`\`\`\r
\r
- Trick: Der Moderator gibt **Information** – er öffnet nie das Auto. Die 2/3 der beiden anderen Türen „wandern“ auf die verbleibende\r
- Intuition mit 100 Türen: Du wählst eine, der Moderator öffnet 98 Ziegentüren. Würdest du bleiben?\r
- 1990 löste Marilyn vos Savant es richtig in einer Zeitschrift – Tausende Leser, darunter Mathematiker, protestierten\r
\r
## Das Geburtstagsparadoxon\r
\r
- Wie viele Menschen braucht es, damit mit über 50 % **zwei** am selben Tag Geburtstag haben? Nur **23**\r
- Fehler der Intuition: Wir denken an „jemand hat **meinen** Geburtstag“ – gefragt sind aber **alle Paare**: bei 23 Personen 253 Paare\r
\r
\`\`\`kette\r
Gegenwahrscheinlichkeit: alle verschieden\r
1. Person: 365/365, 2.: 364/365, 3.: 363/365 …\r
bei 23 Personen: Produkt ≈ 0,49\r
→ mindestens ein Paar ≈ **51 %** | bei 50 Personen ≈ 97 %, bei 70 ≈ 99,9 %\r
\`\`\`\r
\r
- Nutzen: Kryptografie („Geburtstagsangriff“ auf Hashfunktionen), Zufälle richtig einschätzen („Was für ein Zufall!“ ist oft gar keiner)\r
\r
## Gesetz der großen Zahlen und Spielerfehlschluss\r
\r
- **Gesetz der großen Zahlen**: Je öfter ein Zufallsexperiment wiederholt wird, desto näher liegt die **relative Häufigkeit** an der Wahrscheinlichkeit\r
\r
\`\`\`kurve\r
x: Anzahl Würfe\r
y: Anteil Sechsen\r
Anteil: 1 0, 6 0.33, 12 0.08, 30 0.2, 60 0.15, 120 0.18, 300 0.16, 600 0.17\r
linie: y=0.167 | 1/6\r
glatt: nein\r
\`\`\`\r
\r
- Wichtig: Es gleichen sich die **Anteile** aus, nicht die absoluten Abweichungen; der Würfel „weiß“ nichts von früheren Würfen\r
- **Spielerfehlschluss** (Gambler's Fallacy): „Fünfmal Rot, jetzt muss Schwarz kommen!“ – falsch, jede Runde ist unabhängig. Monte Carlo 1913: 26-mal Schwarz hintereinander, Spieler verloren Millionen auf Rot\r
- Gegenstück **„heiße Hand“**: Glaube an Serien; beim Basketball teils doch leicht vorhanden\r
- Folgen im Alltag: Versicherungen und Casinos verdienen sicher, weil sie **viele** Fälle haben; kleine Stichproben schwanken stark (eine Schule mit 10 Schülern hat leichter extreme Durchschnitte)\r
\r
> Wahrscheinlichkeit ist kontraintuitiv: Zähle die Fälle sauber durch, statt dem Bauchgefühl zu trauen.\r
`;export{e as default};