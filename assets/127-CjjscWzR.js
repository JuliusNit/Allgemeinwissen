var e=`## Gödels Unvollständigkeitssatz\r
\r
- Traum von **David Hilbert** (1920er): Die ganze Mathematik aus wenigen Axiomen ableiten – **vollständig** (jede wahre Aussage beweisbar) und **widerspruchsfrei**\r
- **Kurt Gödel** (1931, mit 25 Jahren) zeigt: unmöglich\r
\r
\`\`\`gruppen\r
1. Unvollständigkeitssatz\r
  in jedem widerspruchsfreien System, das die Arithmetik enthält, gibt es **wahre Aussagen, die sich nicht beweisen lassen**\r
2. Unvollständigkeitssatz\r
  ein solches System kann seine eigene **Widerspruchsfreiheit nicht beweisen**\r
\`\`\`\r
\r
- Trick: Gödel codiert Aussagen als **Zahlen** und baut einen Satz G, der sinngemäß sagt: „**Dieser Satz ist nicht beweisbar.**“ Wäre G beweisbar, wäre er falsch → Widerspruch. Also ist G nicht beweisbar – und genau deshalb wahr\r
- Folgen: Mathematik ist nie „fertig“; neue Axiome helfen, erzeugen aber neue unbeweisbare Sätze. Verwandt: **Turing** (1936) – es gibt kein Programm, das für jedes Programm entscheidet, ob es anhält (Halteproblem)\r
- Missbrauch: Gödel beweist **nicht**, dass „alles relativ“ ist oder dass Menschen Computern überlegen sind – er gilt nur für formale Systeme\r
\r
## Unendlichkeit: Hilberts Hotel\r
\r
- Ein Hotel mit **unendlich vielen** Zimmern, alle belegt. Ein neuer Gast kommt:\r
\r
\`\`\`kette\r
jeder Gast zieht von Zimmer n nach n + 1\r
Zimmer 1 wird frei → Platz für den Neuen\r
unendlich viele neue Gäste (ein Bus)?\r
jeder zieht von n nach 2n → alle **ungeraden** Zimmer frei\r
\`\`\`\r
\r
- Lehre: Bei unendlichen Mengen gilt „das Ganze ist größer als der Teil“ **nicht** mehr – es gibt genauso viele gerade Zahlen wie natürliche Zahlen (paarweise zuordnen: 1↔2, 2↔4, 3↔6 …)\r
- **Georg Cantor** (1874/1891): Es gibt **verschieden große Unendlichkeiten**\r
  - **abzählbar** unendlich: natürliche, ganze, sogar rationale Zahlen (Brüche)\r
  - **überabzählbar**: reelle Zahlen – Cantors **Diagonalargument** zeigt, dass jede Liste reeller Zahlen eine auslässt\r
- Kontinuumshypothese (gibt es eine Größe dazwischen?) ist mit den üblichen Axiomen weder beweis- noch widerlegbar (Gödel, Cohen) – passt zu Gödel\r
\r
## Paradoxien: Lügner und Russell\r
\r
- **Lügner-Paradox** (Antike, Epimenides „Alle Kreter lügen“): „**Dieser Satz ist falsch.**“ Ist er wahr, ist er falsch; ist er falsch, ist er wahr\r
- Ursache: **Selbstbezug** – derselbe Mechanismus, den Gödel nutzt\r
\r
\`\`\`kette\r
Menge aller Mengen, die sich **nicht** selbst enthalten: R\r
Enthält R sich selbst?\r
wenn ja → dann darf sie sich nicht enthalten\r
wenn nein → dann muss sie sich enthalten\r
**Widerspruch** | Russell 1901\r
\`\`\`\r
\r
- Alltagsfassung: **Barbier-Paradox** – Der Barbier rasiert alle Männer im Dorf, die sich nicht selbst rasieren. Rasiert er sich selbst?\r
- Russells Brief erschütterte 1902 Gottlob Freges Grundlegung der Mathematik kurz vor der Drucklegung\r
- Lösung: Mengenlehre mit strengeren Axiomen (**Zermelo-Fraenkel**), die „Menge aller Mengen“ verbieten; Typentheorie (Russell)\r
\r
> Selbstbezug sprengt Systeme: Er erzeugt Paradoxien – und zeigt, wo Logik und Mathematik grundsätzlich an Grenzen stoßen.\r
`;export{e as default};