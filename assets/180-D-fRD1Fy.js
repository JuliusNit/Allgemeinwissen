var e=`## Halbleiter\r
\r
- Stoffe zwischen Leiter (Metall) und Isolator (Glas): leiten **mal mehr, mal weniger** – steuerbar; wichtigster: **Silizium**\r
- Reines Silizium leitet kaum (alle Elektronen in Bindungen); Wärme oder Licht macht es leitfähiger\r
\r
\`\`\`gruppen\r
**Dotieren**: gezielt Fremdatome einbauen\r
  **n-Dotierung**: Phosphor (5 Außenelektronen) → überschüssige **Elektronen** (negativ)\r
  **p-Dotierung**: Bor (3 Außenelektronen) → fehlende Elektronen = **Löcher** (positiv)\r
pn-Übergang\r
  an der Grenze entsteht eine Sperrschicht\r
  Strom fließt nur in **eine** Richtung → **Diode**\r
  Anwendungen: Gleichrichter, LED (Licht beim Rekombinieren), Solarzelle (Licht erzeugt Strom)\r
\`\`\`\r
\r
## Transistor und Mikrochip\r
\r
- **Transistor** (Bardeen, Brattain, Shockley, Bell Labs **1947**, Nobelpreis 1956): elektronischer **Schalter** und Verstärker ohne bewegte Teile\r
\r
\`\`\`kette\r
drei Anschlüsse | Feldeffekttransistor: Source, Gate, Drain\r
kleine Spannung am **Gate**\r
öffnet oder sperrt den Kanal zwischen Source und Drain\r
an = 1, aus = 0 | Grundlage aller Bits und Logikgatter\r
\`\`\`\r
\r
- **Integrierter Schaltkreis** (Kilby, Noyce, 1958/59): viele Transistoren auf **einem** Chip\r
- **Mooresches Gesetz** (1965): Zahl der Transistoren auf einem Chip verdoppelt sich etwa alle **2 Jahre** – 1971 Intel 4004: 2300 Transistoren; heute: über **100 Milliarden**, Strukturen von wenigen Nanometern (Atome ~0,1 nm)\r
\r
\`\`\`kette\r
Quarzsand → hochreines Silizium, zu Kristall gezogen\r
in hauchdünne **Wafer** geschnitten\r
**Fotolithografie**: Muster mit Licht belichten | EUV-Belichtung von ASML (Niederlande), Optik von Zeiss\r
ätzen, dotieren, Schichten auftragen | Hunderte Schritte, Reinraum\r
testen, zersägen, verpacken\r
\`\`\`\r
\r
- Geopolitik: Hochmoderne Chips fast nur von **TSMC (Taiwan)**; Exportkontrollen USA–China; EU-Chipgesetz, Fabriken in Dresden („Silicon Saxony“, TSMC/ESMC)\r
\r
## GPS\r
\r
- **Global Positioning System** (US-Militär, seit 1995 voll, für Zivil frei seit 2000); Alternativen: **Galileo** (EU), GLONASS (Russland), BeiDou (China)\r
\r
\`\`\`kette\r
~30 Satelliten in ~20 200 km Höhe, je 4+ immer sichtbar\r
jeder sendet Signal mit genauer **Zeit** (Atomuhren) und Position\r
Empfänger misst die **Laufzeit** jedes Signals | Lichtgeschwindigkeit: 1 Mikrosekunde = 300 m\r
Abstand zu jedem Satelliten → Kugeln schneiden sich\r
mindestens **4 Satelliten**: drei für den Ort, einer für den Uhrfehler des Handys\r
\`\`\`\r
\r
- Genauigkeit: wenige Meter, mit Korrekturdaten Zentimeter (Landwirtschaft, Vermessung)\r
- **Relativitätstheorie** nötig: Satellitenuhren gehen durch geringere Schwerkraft schneller (+45 µs/Tag) und durch Geschwindigkeit langsamer (−7 µs/Tag) → ohne Korrektur ~10 km Fehler pro Tag\r
- Anwendungen: Navigation, Zeitsignal für Börsen, Stromnetze, Mobilfunk; Risiko: **Störsender** (Jamming) und gefälschte Signale (Spoofing) – häufig im Ostseeraum seit 2022\r
\r
> Ein Sandkorn voll Silizium, Milliarden Schalter, Uhren im All – moderne Technik beruht auf Physik, die man nicht sieht.\r
`;export{e as default};