// Datenschutzerklaerung + Impressum (Routen #/datenschutz, #/impressum, views/LegalView.tsx).
// ENTWURF nach dem tatsaechlichen Datenfluss der App, nicht rechtlich geprueft. Persoenliche Angaben stehen als
// **[PLATZHALTER: …]** im Text und muessen vor dem Launch ersetzt werden. Aendert sich der Datenfluss
// (neuer Anbieter, neue Tabelle, Tracking), hier nachziehen.

export const LEGAL_DATE = '17.10.2026'

export const DATENSCHUTZ = `## 1 · Verantwortlicher

**[PLATZHALTER: Vor- und Nachname]**
**[PLATZHALTER: Straße und Hausnummer, PLZ Ort]**
E-Mail: **[PLATZHALTER: E-Mail-Adresse]**

Fragen zum Datenschutz und alle Anträge (Auskunft, Löschung …) an diese Adresse.

## 2 · Überblick

- Die App lässt sich **ohne Konto** nutzen; dann bleibt der Lernfortschritt auf deinem Gerät.
- Ein **Konto** brauchst du für die KI und die Sicherung deines Fortschritts. Dann liegen Konto, Profil und Fortschritt auf dem App-Server (Supabase).
- Keine Werbung, kein Tracking, keine Analyse-Werkzeuge, keine Cookies zu Werbe- oder Statistikzwecken.

## 3 · Bereitstellung der App (Hosting)

Die Web-Version wird über **GitHub Pages** (GitHub Inc., USA) ausgeliefert. Beim Aufruf verarbeitet GitHub technisch nötige Verbindungsdaten (IP-Adresse, Zeitpunkt, abgerufene Datei, Browser). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (sichere Auslieferung). Übermittlung in die USA auf Grundlage des EU-US Data Privacy Framework bzw. von Standardvertragsklauseln.

Die App für iPhone und Android kommt über den **App Store** (Apple) bzw. **Google Play** (Google). Für Download und Updates gelten deren Datenschutzbestimmungen; Absturzberichte und Nutzungsstatistiken des Stores bekommen wir nur, wenn du sie in den Einstellungen deines Geräts freigibst, und nur ohne Bezug zu deiner Person.

## 4 · Speicher auf deinem Gerät

Im Speicher der App bzw. des Browsers (localStorage) liegen:

- Lernfortschritt: Sessions, Notizen, Video-Notizen und -Positionen, Karteikarten, Chatverläufe mit der KI, Prüfungsergebnisse, Wissensstand
- „Entdecken“: gemerkte Wissenshäppchen und wie weit und wie lange du sie angesehen hast – nur, um die Reihenfolge der Häppchen an deine Interessen anzupassen
- ob der Ton in „Entdecken“ an oder aus ist
- Name und Profilbild
- ein eigener KI-Schlüssel, falls du ohne Konto einen einträgst (verlässt das Gerät nur in Richtung der eingetragenen KI-Adresse)
- mit Konto: die Anmeldung (Sitzungs-Token von Supabase)
- in der App: die tägliche Erinnerung (an/aus, Uhrzeit). Sie wird nur auf dem Gerät geplant, ohne Server.

Dieser Speicher ist für die Funktion der App unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst ihn jederzeit löschen: Profil → „Fortschritt löschen“ oder über die Browser-Einstellungen.

## 5 · Konto (Supabase)

Anbieter des App-Servers: **Supabase Inc.**, **[PLATZHALTER: Anschrift laut Supabase-Vertrag (DPA)]**. Serverstandort: **[PLATZHALTER: Region des Supabase-Projekts, z. B. Frankfurt (eu-central-1)]**. Mit Supabase besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO): **[PLATZHALTER: AVV/DPA abgeschlossen am …]**.

Gespeichert werden:

- **Konto:** E-Mail-Adresse, Passwort (nur verschlüsselt als Hash), Name, Wissensstand, Geburtsjahr, Zeitpunkte von Registrierung und Anmeldung
- **Profil:** Name, Profilbild, Rolle
- **Fortschritt:** derselbe Lernfortschritt wie unter 4 (ohne KI-Schlüssel und Einstellungen), damit er nach einem Gerätewechsel oder einer Neuinstallation wieder da ist
- **Austausch:** derzeit nicht verfügbar (siehe 7). Nachrichten, Freundschaften, Blockierungen und Meldungen aus der Zeit davor bleiben gespeichert, bis du dein Konto löschst
- **KI-Nutzung:** Anzahl der KI-Anfragen pro Tag (für das Tageslimit), keine Inhalte

Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Nutzungsvertrag). Die Daten bleiben gespeichert, bis du dein Konto löschst.

## 6 · KI-Funktionen

Für Anknüpfen, Fragen, Verständnischeck, Lernzettel, Karteikarten, Prüfungsmodus, und Stärkenberatung schickt die App Text an ein Sprachmodell:

- **Inhalt:** dein Chatverlauf in der jeweiligen Funktion, deine Notizen und Antworten, Titel und Teilthemen der Session, dein Vorname
- **Weg:** mit Konto über den App-Server (Supabase Edge Function), ohne Konto mit eigenem Schlüssel direkt aus dem Browser
- **Anbieter des Modells:** Server unter ai.inference2.corpus.music – Betreiber: **[PLATZHALTER: Name und Anschrift des Betreibers]**, Standort: **[PLATZHALTER: Land/Region]**, Speicherung der Anfragen beim Anbieter: **[PLATZHALTER: z. B. keine Speicherung / Löschung nach … Tagen]**, Auftragsverarbeitungsvertrag: **[PLATZHALTER]**

Schreib in KI-Chats keine Daten, die du nicht weitergeben möchtest (z. B. Gesundheitsdaten, Daten anderer Personen). KI-Antworten können falsch sein.

Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.

## 7 · Austausch

Der Austausch (Kanäle, Freunde, Direktnachrichten) ist derzeit nicht verfügbar; die App zeigt keine Nachrichten mehr an und verschickt keine. Früher gespeicherte Daten werden mit dem Konto gelöscht (siehe 11).

## 8 · Fotos in „Entdecken“

Die Fotos stammen von Wikimedia Commons und liegen in der App selbst; beim Ansehen wird keine Verbindung zu Wikimedia aufgebaut.

## 9 · Videos (YouTube, Vimeo)

Lernvideos sind eingebettet. Erst wenn du ein Video öffnest, lädt die App den Player von **YouTube** im erweiterten Datenschutzmodus (youtube-nocookie.com; Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland) bzw. von **Vimeo** (Vimeo.com Inc., USA, mit „Do Not Track“). Dabei erhält der Anbieter deine IP-Adresse und technische Daten; beim Abspielen kann er Cookies oder ähnliche Speicher setzen und Daten in die USA übermitteln (EU-US Data Privacy Framework). Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO bzw. § 25 Abs. 1 TDDDG – durch das Öffnen des Videos. Datenschutz bei Google: policies.google.com/privacy, bei Vimeo: vimeo.com/privacy.

## 10 · Kinder und Jugendliche

Die App richtet sich auch an Schülerinnen und Schüler ab Klasse 5. Beim Anlegen eines Kontos fragt sie das Geburtsjahr ab. **[PLATZHALTER: Regelung zur Einwilligung der Eltern nach Art. 8 DSGVO für Konten unter 16 – rechtlich klären]**

## 11 · Löschung

- **Konto löschen:** Profil → Konto → „Konto löschen“. Damit werden Konto, Profil, Fortschritt, Geburtsjahr, Nachrichten, Freundschaften, Blockierungen und eigene Meldungen sofort vom Server gelöscht, außerdem der Fortschritt auf dem Gerät.
- **Ohne Konto:** Profil → „Fortschritt löschen“ oder Browserdaten löschen.
- **Sicherung:** Profil → „Exportieren“ lädt deinen Fortschritt als Datei herunter (Datenübertragbarkeit).

## 12 · Deine Rechte

Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Eine Einwilligung kannst du jederzeit für die Zukunft widerrufen. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, z. B. **[PLATZHALTER: zuständige Aufsichtsbehörde]**.

Stand: ${LEGAL_DATE} · Entwurf`

export const IMPRESSUM = `## Angaben gemäß § 5 DDG

**[PLATZHALTER: Vor- und Nachname]**
**[PLATZHALTER: Straße und Hausnummer]**
**[PLATZHALTER: PLZ Ort]**
**[PLATZHALTER: Land]**

## Kontakt

E-Mail: **[PLATZHALTER: E-Mail-Adresse]**
Telefon: **[PLATZHALTER: Telefonnummer oder zweiter schneller Kontaktweg]**

## Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV

**[PLATZHALTER: Vor- und Nachname, Anschrift wie oben]**

## Inhalte

Lehrplan, Lernzettel und Texte der App: **[PLATZHALTER: Name]**. Die eingebetteten Lernvideos stammen von Dritten (u. a. YouTube-Kanäle von Studyflix, simpleclub, MrWissen2go, Terra X, Kurzgesagt); für deren Inhalt sind die jeweiligen Anbieter verantwortlich. KI-Antworten werden automatisch erzeugt und können Fehler enthalten. Fotos in „Entdecken“: Wikimedia Commons, Urheber und Lizenz stehen am Ende jedes Häppchens.

## Haftung für Links und eingebettete Inhalte

Für Inhalte externer Seiten und Videos sind deren Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden betroffene Links und Videos entfernt.

Stand: ${LEGAL_DATE} · Entwurf`
