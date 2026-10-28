var e=`## Cyberangriffe und Hacker\r
\r
\`\`\`gruppen\r
Angriffsarten\r
  **Phishing**: gefälschte Mails/Seiten stehlen Zugangsdaten (Einfallstor Nr. 1)\r
  **Ransomware**: Daten verschlüsseln, Lösegeld fordern, oft mit Drohung zu veröffentlichen\r
  Ausnutzen von **Sicherheitslücken** (ungepatchte Software, „Zero-Days“)\r
  DDoS: Server mit Anfragen überfluten\r
  Social Engineering: Menschen manipulieren („CEO-Fraud“)\r
Angreifer\r
  Kriminelle Banden (größter Teil, Geschäftsmodell „Ransomware as a Service“)\r
  staatliche Gruppen (Spionage, Sabotage – z. B. Bundestagshack 2015, Russland zugeschrieben)\r
  Hacktivisten\r
Beispiele\r
  WannaCry 2017: weltweit Krankenhäuser lahmgelegt\r
  Uniklinik Düsseldorf 2020: Patientin stirbt auf dem Weg in eine andere Klinik\r
  Landkreis Anhalt-Bitterfeld 2021: Katastrophenfall wegen Cyberangriff\r
\`\`\`\r
\r
- **Ethische Hacker** (White Hats, Pentester): greifen im Auftrag an, um Lücken zu finden, bevor Kriminelle es tun; Bug-Bounty-Programme zahlen für gemeldete Lücken\r
- Schutz: Updates sofort, Zwei-Faktor, Passwortmanager, Backups offline, Mitarbeiter schulen, Netzwerke trennen; in Deutschland zuständig: **BSI**; Schaden durch Cyberangriffe für deutsche Firmen > 200 Mrd. € pro Jahr (Bitkom)\r
\r
## Gesichtserkennung\r
\r
\`\`\`kette\r
Kamerabild\r
Gesicht finden\r
Merkmale vermessen: Abstände von Augen, Nase, Mund, Kinnform | neuronales Netz macht daraus einen Zahlen-„Fingerabdruck“\r
mit Datenbank vergleichen\r
Treffer mit Wahrscheinlichkeit\r
\`\`\`\r
\r
- Anwendungen: Handy entsperren (1:1-Abgleich, harmlos), Grenzkontrollen, Fahndung, Zutritt\r
- Risiken: **Massenüberwachung** im öffentlichen Raum (China: flächendeckend, Uiguren), Fehlerkennungen mit Folgen (Unschuldige in den USA festgenommen), höhere Fehlerquoten bei dunkelhäutigen Menschen und Frauen, Firmen wie **Clearview AI** sammelten Milliarden Fotos aus dem Netz\r
- Rechtslage EU (AI Act): biometrische **Echtzeit-Fernidentifizierung** im öffentlichen Raum grundsätzlich **verboten**, Ausnahmen für schwere Straftaten mit richterlicher Genehmigung; Testprojekt Berlin Südkreuz (2017/18) umstritten\r
- Kernfrage: Anonymität im öffentlichen Raum ist Voraussetzung für Freiheit (Demonstrationen, Privatleben)\r
\r
## Technikfolgen abschätzen\r
\r
- **Technikfolgenabschätzung** (TA): systematisch untersuchen, welche Wirkungen eine Technik haben **könnte** – erwünschte und unerwünschte, frühzeitig, um Politik und Gesellschaft Entscheidungen zu ermöglichen\r
- Einrichtungen: **ITAS** am KIT (Armin Grunwald), Büro für Technikfolgen-Abschätzung beim Bundestag (TAB, seit 1990)\r
\r
\`\`\`gruppen\r
Das Dilemma (Collingridge, 1980)\r
  früh: Folgen noch unklar, aber Technik leicht zu steuern\r
  spät: Folgen klar, aber Technik schon fest etabliert und schwer zu ändern\r
Methoden\r
  Szenarien, Expertenbefragungen (Delphi), Bürgerkonferenzen, Risikoanalysen\r
  Fragen: Wer profitiert? Wer trägt Risiken? Was ist umkehrbar?\r
Beispiele\r
  Atomenergie, Gentechnik, Internet, autonomes Fahren, KI, Geoengineering\r
\`\`\`\r
\r
- Verwandt mit Hans Jonas' **Prinzip Verantwortung** (Vorsicht bei weitreichenden, unumkehrbaren Folgen) und dem **Vorsorgeprinzip** im Umweltrecht\r
- Kritik: Zukunft ist schwer vorherzusagen; Gefahr, Innovation zu bremsen; Gegenpol: „Innovationsprinzip“\r
\r
| Technik | Nutzen | Gefahr | Regel |\r
|---|---|---|---|\r
| Vernetzung | Effizienz, Komfort | Cyberangriffe | Sicherheit von Anfang an |\r
| Gesichtserkennung | Fahndung, Komfort | Massenüberwachung | enge Grenzen, Richtervorbehalt |\r
| neue Technik allgemein | Fortschritt | unbekannte Folgen | früh abschätzen, Bürger beteiligen |\r
\r
> Technik ist nie neutral: Ob sie schützt oder überwacht, hängt von Regeln ab, die wir festlegen, bevor sie selbstverständlich ist.\r
`;export{e as default};