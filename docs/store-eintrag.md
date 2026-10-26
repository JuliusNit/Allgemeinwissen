# Store-Eintrag – Entwurf (App Store + Google Play)

Stand: 16.10.2026 · gehört zu Pflichtpunkt 9 in `docs/launch-und-premium.md`.
Alles hier ist ein **Vorschlag**: Julius prüft und trägt es in App Store Connect bzw. der Play Console ein.
Ändert sich der Datenfluss, gleichzeitig nachziehen: `ios/App/App/PrivacyInfo.xcprivacy`, `src/data/legal.ts`, dieses Dokument.

## 1 · Eckdaten

| | |
|---|---|
| App-ID / Bundle-ID / Paketname | `de.allgemeinwissen.app` (**Vorschlag – vor dem ersten Hochladen bestätigen**, danach nicht mehr änderbar; ändern in `capacitor.config.ts`, `ios/…/project.pbxproj`, `android/app/build.gradle`, URL-Schema in `src/lib/native.ts`, `Info.plist`, `AndroidManifest.xml`) |
| Version | 1.0 (Build 1) |
| Sprache | Deutsch |
| Kategorie | Bildung (zweite: Nachschlagewerke) |
| Preis | kostenlos (Premium kommt später als In-App-Kauf) |
| Geräte | iPhone + iPad (das Xcode-Projekt erlaubt beides → iPad-Screenshots 13″ nötig). Nur iPhone: in Xcode „Supported Destinations“ auf iPhone beschränken |
| Datenschutz-URL | https://juliusnit.github.io/Allgemeinwissen/#/datenschutz (erst nach Rechtsprüfung, Platzhalter füllen) |
| Support-URL | https://juliusnit.github.io/Allgemeinwissen/#/impressum (Kontakt) |
| Konto löschen (Google Play verlangt einen Web-Link) | https://juliusnit.github.io/Allgemeinwissen/#/profil → Konto → „Konto löschen“, alternativ per Mail an die Adresse aus dem Impressum |
| Zugang für die Prüfung | Testkonto (E-Mail + Passwort) in „App-Prüfungsinformationen“ eintragen. Hinweis: „Ohne Konto starten“ zeigt den Lernpfad ohne Anmeldung. |

## 2 · Texte

**Name (30):** Allgemeinwissen – 90 Tage
**Untertitel (30, nur Apple):** Lernplan mit KI & Karteikarten
**Kurzbeschreibung (80, Google Play):** 90 Tage Allgemeinwissen: Videos, Lernzettel, KI-Check und Karteikarten.
**Stichwörter (100, nur Apple, ohne Leerzeichen):** `lernen,quiz,bildung,karteikarten,lernplan,geschichte,biologie,physik,schule,abitur,gedächtnis`
**Werbetext (170, Apple, jederzeit änderbar):** Jeden Tag eine Session: anschauen, verstehen, wiederholen. In 90 Tagen baust du ein Allgemeinwissen auf, das bleibt.

**Beschreibung:**

> Allgemeinwissen ist ein Lernplan über 90 Tage – von Geschichte, Politik und Wirtschaft über Physik, Chemie und Biologie bis Kunst, Musik und Philosophie.
>
> SO FUNKTIONIERT ES
> • Jeden Tag eine Session: ausgewählte Erklärvideos, ein kompakter Lernzettel mit Grafiken und deine eigenen Notizen mit Zeitmarke.
> • Anknüpfen: Die KI verbindet das neue Thema mit dem, was du schon gelernt hast.
> • Verständnischeck: Erst wenn du „verstanden“ sagst, stellt die KI drei bis fünf Fragen – keine reinen Wiedergabefragen, sondern Verstehen und Übertragen. Bei Fehlern erklärt sie nach.
> • Karteikarten mit Wiederholung im richtigen Abstand (Spaced Repetition) und Wiederholungs-Stationen im Lernpfad.
> • Prüfungsmodus: Die App schlägt vor, welches Thema du wieder auffrischen solltest.
> • Statistik je Bereich und ein Wochenrückblick mit deinem Wissensindex.
>
> PASST ZU DEINEM STAND
> Schule, Studium oder Beruf: Stoff, den du schon kennst, wird zur kurzen Wiederholung – du startest direkt mit Neuem.
>
> DRAN BLEIBEN
> • Tägliche Erinnerung zur Wunschzeit – keine, wenn du heute schon fertig bist.
> • Streak und Lernpfad zeigen, wie weit du bist.
> • Lernzettel als Bild oder PDF teilen und speichern.
>
> ENTDECKEN
> Wissenshäppchen als kurze Filme von rund zwei Minuten: gezeichnete Animationen, Fotos und Ton erklären ein Phänomen, am Ende das Wichtigste kurz gesagt und die Quellen. Die Reihenfolge passt sich an das an, was dich interessiert.
>
> OHNE KONTO NUTZBAR
> Lernpfad, Videos, Lernzettel und Karteikarten funktionieren ohne Anmeldung. Ein Konto brauchst du nur für die KI und die Sicherung deines Fortschritts.
>
> Keine Werbung, kein Tracking.

**Neu in dieser Version:** Erste Version.

## 3 · Screenshots

- iPhone 6,9″ (1320 × 2868) – Pflicht; Apple skaliert für kleinere Geräte herunter. iPad 13″ (2064 × 2752), falls iPad bleibt.
- Google Play: mind. 2 Telefon-Screenshots (z. B. 1080 × 1920), Feature-Grafik 1024 × 500, Icon 512 × 512 (`assets/icon-only.png` verkleinern).
- Vorschlag Reihenfolge: Lernpfad (Home) · Themenkarte · Session mit Video + Notizen · Lernzettel · Verständnischeck · Karteikarten · Statistik.
- Am einfachsten im Simulator/Emulator mit vorbereitetem Fortschritt; Statusleiste aufgeräumt (`xcrun simctl status_bar … override`).

## 4 · App Store: Datenschutz-Angaben („App-Datenschutz“)

**Tracking:** Nein. Keine Daten werden zum Tracking genutzt, keine Werbe- oder Analyse-SDKs.

Erfasste Daten – alle **mit der Identität verknüpft**, **nicht für Tracking**, Zweck jeweils nur **App-Funktionalität**.
Gilt nur mit Konto; ohne Konto verlässt nichts das Gerät außer Video-Aufrufen (siehe unten).

| Kategorie in App Store Connect | Was genau | Wohin |
|---|---|---|
| Kontaktinformationen → E-Mail-Adresse | Anmeldung, Konto-Mails | Supabase |
| Kontaktinformationen → Name | Anzeigename im Profil | Supabase |
| Kennungen → Nutzer-ID | Konto-ID | Supabase |
| Nutzerinhalte → Fotos oder Videos | Profilbild (verkleinert) | Supabase |
| Nutzerinhalte → Andere Nutzerinhalte | Lernfortschritt, Notizen, Chatverläufe mit der KI, gemerkte Wissenshäppchen | Supabase; KI-Texte an den KI-Anbieter |
| Nutzungsdaten → Produktinteraktion | Wie weit/lange Wissenshäppchen angesehen wurden (nur Reihenfolge in „Entdecken“) | Supabase |
| Nutzungsdaten → Produktinteraktion | Zähler der KI-Anfragen pro Tag (Tageslimit), keine Inhalte | Supabase |
| Sonstige Daten | Geburtsjahr (Altersangabe beim Konto) | Supabase |

Nicht erfasst: Standort, Kontakte, Gesundheit, Finanzen, Browserverlauf, Suchverlauf, Diagnosedaten (kein Absturz-SDK), Werbedaten.

Zu klären, bevor die Angaben abgeschickt werden:
- **KI-Anbieter** (`ai.inference2.corpus.music`): Mit Auftragsverarbeitungsvertrag ist er Dienstleister, kein „Dritter“ – sonst müssen die Nutzerinhalte als „an Dritte weitergegeben“ markiert werden (Pflichtpunkt 8).
- **YouTube/Vimeo:** Die eingebetteten Player laden erst beim Öffnen eines Videos (youtube-nocookie, Vimeo mit „Do Not Track“). Apple fragt nach Daten, die die App bzw. eingebundener Partner-Code sammelt; die Player sind Webseiten der Anbieter, kein eingebautes SDK. In der Datenschutzerklärung stehen sie (Abschnitt 8).

`PrivacyInfo.xcprivacy` (im Xcode-Projekt eingetragen) enthält dieselben Datentypen, `NSPrivacyTracking = false`, keine Tracking-Domains und die Gründe für
UserDefaults (`CA92.1`, nur eigene App) und Datei-Zeitstempel (`C617.1`, Dateien im App-Container – Filesystem-Plugin beim Speichern der Lernzettel).

## 5 · Google Play: Datensicherheit

- Daten werden **erhoben**, **nicht geteilt** (Supabase und KI-Anbieter sind Auftragsverarbeiter – Vertrag Voraussetzung, siehe oben).
- Verschlüsselung bei der Übertragung: **ja** (HTTPS).
- Löschung: **ja**, in der App (Profil → Konto) und über den Web-Link oben.
- Datentypen: Persönliche Infos → Name, E-Mail-Adresse, Nutzer-IDs, Sonstige Infos (Geburtsjahr) · Fotos → Fotos (Profilbild) · App-Aktivitäten → App-Interaktionen (KI-Zähler, angesehene Wissenshäppchen), Andere nutzergenerierte Inhalte (Fortschritt, Notizen, KI-Chats).
  Zweck jeweils „App-Funktionalität“ und „Kontoverwaltung“, Erhebung optional (nur mit Konto).
- Android-Sicherung: `allowBackup` ist an – der App-Speicher (Fortschritt) kann in der Google-Sicherung des Nutzers landen. Gehört nicht zu „erhoben“ (geht nicht an uns).

## 6 · Altersfreigabe

**Vorschlag App Store: 13+.** Ausschlaggebend ist der KI-Chat (freier Text). Der Austausch mit anderen Nutzern ist seit 17.10.2026 ausgeblendet – damit entfallen „Nachrichten und Chat“ und nutzergenerierte Inhalte anderer. Inhalte selbst: Lernstoff, keine Gewalt, kein Glücksspiel, kein offener Webzugang (externe Links öffnen nur Videoseiten).
Im Fragebogen ehrlich ankreuzen: Nutzer-Interaktion nein (solange der Austausch aus ist), KI-Assistent ja, Altersprüfung über Geburtsjahr ja.

**Google Play (IARC):** Fragebogen ausfüllen; erwartbar USK ab 12 bzw. „Nutzer interagieren“.
**Zielgruppe in der Play Console:** ab 13 angeben. Unter 13 greift das Families-Programm (strengere Regeln für KI-Chat, Nachrichten, Datenerhebung) – passt erst nach der Rechtsklärung zu Art. 8 DSGVO.

**Entscheidung offen (Julius):** Die Inhalte zielen ab Klasse 5 (≈ 10 Jahre). Mit 13+ können jüngere Kinder die App nur mit Zustimmung der Eltern laden (Bildschirmzeit/Family Link). Für unter 13 bräuchte es einen Kindermodus ohne KI-Freitext.

## 7 · Export-Compliance

`ITSAppUsesNonExemptEncryption = false` steht in `Info.plist` (nur HTTPS des Systems) – App Store Connect fragt dann nicht bei jedem Build.
