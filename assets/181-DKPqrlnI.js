var e=`## Mobilfunk: von 1G bis 5G\r
\r
\`\`\`gruppen\r
Prinzip\r
  Land in **Funkzellen** geteilt, jede mit einer Basisstation (Antenne)\r
  Handy funkt zur nächsten Station, beim Bewegen Übergabe an die nächste Zelle (**Handover**)\r
  Basisstationen sind per Glasfaser oder Richtfunk mit dem Kernnetz verbunden\r
Generationen\r
  **1G** (1980er): analog, nur Telefonie (C-Netz)\r
  **2G/GSM** (1992): digital, **SMS**\r
  **3G/UMTS** (2000er): mobiles Internet\r
  **4G/LTE** (2010): schnelles Internet, Videostreaming\r
  **5G** (ab 2019): bis zu 10–20 Gbit/s, sehr geringe Verzögerung (~1 ms), viele Geräte gleichzeitig\r
\`\`\`\r
\r
- 5G-Frequenzen: niedrige (weite Reichweite, durch Wände) und hohe (riesige Datenraten, kurze Reichweite → viele kleine Zellen)\r
- Anwendungen: Industrie 4.0, vernetzte Autos, Telemedizin, Massen von Sensoren (Internet der Dinge)\r
- **Strahlung**: nicht ionisierend, Grenzwerte weit unter Erwärmungsschwelle; Studienlage (u. a. Bundesamt für Strahlenschutz): kein Nachweis gesundheitlicher Schäden unterhalb der Grenzwerte; Verschwörungsmythos 5G-Corona 2020 widerlegt\r
- Politik: Huawei-Komponenten werden aus Sicherheitsgründen aus deutschen Kernnetzen entfernt\r
\r
## Glasfaser\r
\r
- Licht statt Strom: Daten als **Lichtpulse** durch einen haardünnen Glasfaden\r
\r
\`\`\`kette\r
Laser blinkt Milliarden Mal pro Sekunde (1 und 0)\r
Licht läuft durch den Glaskern\r
Mantel hat geringere Brechzahl → **Totalreflexion** | Licht bleibt gefangen, auch in Kurven\r
nach Dutzenden km nur wenig abgeschwächt\r
Empfänger wandelt Licht wieder in elektrische Signale\r
\`\`\`\r
\r
- Vorteile gegenüber Kupfer (DSL, Kabel): **riesige Bandbreite** (Terabit pro Faser mit vielen Farben gleichzeitig), kaum Verluste, unempfindlich gegen Störungen, symmetrisch schnell\r
- **Seekabel** tragen über 95 % des internationalen Datenverkehrs; Sabotage-Fälle in der Ostsee (2023/24) zeigen ihre Verwundbarkeit\r
- Deutschland hinkt beim Glasfaserausbau bis ins Haus (FTTH) hinterher (~35–40 % der Haushalte versorgt 2025, Ziel flächendeckend 2030)\r
\r
## Satelliten\r
\r
\`\`\`gruppen\r
Bahnen\r
  **LEO** (niedrig, 300–2000 km): Erdbeobachtung, ISS, **Starlink**; Umlauf ~90 min\r
  **MEO** (~20 000 km): Navigation (GPS, Galileo)\r
  **GEO** (geostationär, 35 786 km über dem Äquator): Umlauf = 24 h → steht scheinbar still; Fernsehen, Wetter (Meteosat)\r
Warum fallen sie nicht?\r
  sie fallen ständig – fliegen aber so schnell seitwärts (~7,8 km/s in LEO), dass die Erde sich unter ihnen wegkrümmt\r
Aufbau\r
  Solarpaneele, Akkus, Antennen, Steuerdüsen, Nutzlast (Kamera, Sender)\r
\`\`\`\r
\r
- Anwendungen: Navigation, Kommunikation, Wetter, Klimaforschung (Meeresspiegel, Eis), Landwirtschaft, Katastrophenhilfe, militärische Aufklärung\r
- **Satelliteninternet** (Starlink, >8000 Satelliten): Internet überall, auch im Ukrainekrieg entscheidend → Abhängigkeit von einer Firma; EU plant IRIS²\r
- Probleme: **Weltraumschrott** (über 30 000 verfolgte Teile; Kessler-Syndrom: Kettenreaktion von Kollisionen), Lichtverschmutzung für Astronomen\r
\r
> Ob Funk, Licht im Glas oder Satellit: Das Internet ist eine physische Infrastruktur – und damit verwundbar und politisch.\r
`;export{e as default};