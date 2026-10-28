var e=`## Programmiersprachen im Überblick\r
\r
- Computer verstehen nur **Maschinencode** (Nullen und Einsen); Programmiersprachen sind menschenlesbare Brücken dorthin\r
- Übersetzung: **Compiler** übersetzt vorab das ganze Programm (C, Rust, Go – schnell), **Interpreter** führt Zeile für Zeile aus (Python, JavaScript – flexibel)\r
\r
| Sprache | typischer Einsatz |\r
|---|---|\r
| **Python** | Einstieg, Datenanalyse, KI, Wissenschaft |\r
| **JavaScript / TypeScript** | Webseiten und Web-Apps (läuft im Browser) |\r
| HTML, CSS | Struktur und Aussehen von Webseiten (keine Programmiersprachen im engeren Sinn) |\r
| **Java, Kotlin** | Android-Apps, große Unternehmenssoftware |\r
| **C, C++** | Betriebssysteme, Spiele, Geräte, wo Tempo zählt |\r
| **C#** | Windows, Spiele (Unity) |\r
| **Swift** | Apps für iPhone und Mac |\r
| **SQL** | Datenbanken abfragen |\r
| Rust, Go | sichere, schnelle Systeme, Cloud |\r
\r
- Grundbausteine fast überall gleich: **Variablen**, Bedingungen (if), Schleifen (for/while), Funktionen, Datenstrukturen\r
- Paradigmen: imperativ (Schritt für Schritt), **objektorientiert** (Objekte mit Eigenschaften und Methoden), funktional\r
- Heute schreiben KI-Assistenten viel Code mit – Verstehen, Prüfen und Entwerfen bleiben menschliche Aufgaben\r
\r
## Verschlüsselung\r
\r
\`\`\`gruppen\r
Symmetrisch\r
  **ein** Schlüssel zum Ver- und Entschlüsseln (Cäsar-Chiffre, heute **AES**)\r
  schnell, aber: Wie tauscht man den Schlüssel sicher aus?\r
Asymmetrisch (Public-Key, 1976/77: Diffie-Hellman, **RSA**)\r
  **öffentlicher Schlüssel** zum Verschlüsseln (darf jeder kennen)\r
  **privater Schlüssel** zum Entschlüsseln (bleibt geheim)\r
  Bild: offenes Vorhängeschloss verschicken, nur der Empfänger hat den Schlüssel\r
  beruht auf Mathematik, die in eine Richtung leicht, rückwärts extrem schwer ist (große Primzahlen multiplizieren vs. Produkt zerlegen)\r
Hybrid (Praxis)\r
  asymmetrisch wird ein symmetrischer Sitzungsschlüssel ausgetauscht, dann schnell symmetrisch weiter\r
  so arbeitet **HTTPS** (Schloss im Browser), WhatsApp, Signal\r
\`\`\`\r
\r
- **Ende-zu-Ende-Verschlüsselung**: nur Sender und Empfänger können lesen, nicht einmal der Anbieter → Streit mit Behörden („Chatkontrolle“ der EU)\r
- **Digitale Signatur**: mit dem privaten Schlüssel „unterschreiben“, jeder kann mit dem öffentlichen prüfen, dass es echt und unverändert ist\r
- Bedrohung durch Quantencomputer → neue **Post-Quanten-Verfahren** (2024 standardisiert)\r
\r
## Passwörter, Hashes und Passkeys\r
\r
\`\`\`kette\r
Webseite speichert **nicht** dein Passwort, sondern seinen **Hash** | Einweg-Funktion: aus Hash nicht zurückrechenbar\r
beim Login wird deine Eingabe gehasht und verglichen\r
**Salt**: Zufallswert pro Nutzer → gleiche Passwörter ergeben verschiedene Hashes\r
langsame Hashfunktionen (bcrypt, Argon2) bremsen Angreifer beim Durchprobieren\r
\`\`\`\r
\r
- Gute Passwörter: **lang** (Länge schlägt Sonderzeichen), für jeden Dienst **anders** (sonst Credential Stuffing nach Datenlecks), am besten im **Passwortmanager**; regelmäßiges Ändern ohne Anlass empfiehlt das BSI nicht mehr\r
- **Zwei-Faktor-Authentisierung**: Wissen (Passwort) + Besitz (Handy, Sicherheitsschlüssel)\r
- **Passkeys** (seit 2022, FIDO-Standard): statt Passwort ein Schlüsselpaar – der private Schlüssel bleibt auf deinem Gerät, entsperrt per Fingerabdruck/Gesicht; der Server kennt nur den öffentlichen → nichts zu stehlen, **Phishing**-resistent (funktioniert nur auf der echten Seite)\r
\r
> Sicherheit im Netz beruht auf Mathematik: Einwegfunktionen, Schlüsselpaare – und darauf, dass Geheimnisse geheim bleiben.\r
`;export{e as default};