# Allgemeinwissen – Arbeitsweise

PWA (Vite + React + TypeScript) für Julius' 90-Tage-Lernplan „Allgemeinwissen (kristalline Intelligenz)“.
Live: https://juliusnit.github.io/Allgemeinwissen/ · Repo: https://github.com/JuliusNit/Allgemeinwissen

## GitHub ist die Quelle der Wahrheit

- Vor der ersten Änderung: `git pull --rebase origin master`
- Nach jeder abgeschlossenen Änderung: committen und `git push origin master`, danach `npm run deploy`
  (baut und ersetzt den Branch `gh-pages` – der enthält nur Build-Ergebnisse)
- Kein Force-Push auf `master`. Secrets nie ins Repo.

## Aufbau

- `src/data/plan.ts` – kompletter Lehrplan: Bereiche (Farben), Blöcke, 90 Tage mit Teilthemen und
  `links` (frühere Sessions zum Anknüpfen). Phase-2-Teilthemen und Verknüpfungen wurden ergänzt, nicht von Julius vorgegeben.
  Videos: pro Teilthema ein ausgewähltes YouTube-Video aus `src/data/videos.ts` (per Suche gefunden, von Hand gewählt,
  per oEmbed auf „existiert + einbettbar“ geprüft; bevorzugt Studyflix, simpleclub, MrWissen2go, Terra X, Kurzgesagt).
- `src/data/lernzettel/NN.md` – Lernzettel je Session (Kasten „3 · Lernzettel“ zwischen Videos und Notizen, standardmäßig zu wie die Videos
  (`sheetOpen`, `videosOpen`); Antippen → Vollbild mit Teilen/Bild speichern (PNG über html-to-image)/PDF (Web: Drucken, App: Bild-PDF aus `src/lib/pdf.ts` übers Teilen-Menü); lädt lazy über `src/data/lernzettel.ts`). Geschrieben nach den Transkripten (YouTube-Untertitel) der Videos aus
  `videos.ts`, nach Thema gegliedert, nicht nach Video; max. 2 Seiten, Stichpunkte + Diagramme. Ohne Untertitel (nach Titel,
  Beschreibung, Fachwissen): 45-2, 63-1, 67-2, 76-2, 76-3, 85-0, 85-2. Wird ein Video getauscht, Lernzettel prüfen.
  Diagramme = Markdown-Codeblöcke ```kette/kreis/zeitstrahl/baum/gruppen/pyramide/schichten/kurve/balken
  (`src/components/Diagram.tsx`, Syntax im Kopfkommentar), Merkzeile mit `> …`.
  Fehlt ein Eintrag, gibt es einen Suchlink. Gespeicherte, unveränderte Suchlinks ersetzt `upgradeVideos` automatisch;
  Julius kann jedes Video über ✎ oder „anderes Video“ tauschen.
- `src/components/VideoWatch.tsx` + `src/lib/video.ts` – Videos laufen eingebettet (YouTube-IFrame-API über
  youtube-nocookie, Vimeo) unter `#/tag/N/video/ID[/Sekunden]`; Notizen am Rand mit Zeitmarke (`videoNotes`),
  Pause beim Tippen, letzte Position (`videoPos`). Suchlinks lassen sich nicht einbetten → dort Video wählen + Link einfügen.
- `src/lib/store.ts` – gesamter Zustand in localStorage (`allgemeinwissen-v1`), Export/Import für Gerätewechsel (ohne API-Key).
  Enthält auch Profil (Name, Bild), Kartenprotokoll, Wiederholungs-Stationen, Community-Nachrichten, Spezialisierungswahl.
- `src/lib/ai.ts` – OpenAI-kompatibler Endpunkt per fetch/SSE direkt aus dem Browser. Angemeldet geht jede Anfrage über den
  KI-Proxy `supabase/functions/ki` (Edge Function, Key als Secret `LLM_KEY`, nur für angemeldete Konten, Tageslimit
  `KI_DAILY_LIMIT` über `003_ki_limit.sql`) – auch wenn ein eigener Key gespeichert ist. Eigener Key (Profil → KI) nur ohne Konto,
  das Feld ist mit Konto und in der nativen App ausgeblendet. Standard: Qwen `qwen3.8-27b` auf
  `ai.inference2.corpus.music` (vLLM, CORS offen). **Key nie ins Repo.**
  Modi: Anknüpfen, Fragen, Verständnischeck (Ende über `[[SESSION_ABGESCHLOSSEN]]`, Bewertung je Antwort über
  `[[BEWERTUNG: richtig|teilweise|falsch | 1-5]]`), Lernzettel + Karten (json_schema), Stärkenberatung, Kanal-Chat.
- `src/lib/stats.ts` – wertet Marker + Zeitstempel aus (richtig, Antwortzeit, Präzision) je Session/Überthema.
- `src/lib/path.ts` – Lernpfad je Wissensstand (`buildPath(level)`): beginnt direkt mit dem neuen Stoff, Abruf-Station nach je
  4 Sessions, am Ende Abschlusswiederholung (`w-ende`, unsicherste Karten). Schulstoff-Sessions stehen nicht im Pfad und zählen
  als gelernt (`dayDone`: Statistik, Prüfung) erst nach dem Grundcheck ihres Fachs. Grundwissen optional über „Auffrischen“ im Anknüpfen-Kasten einer Session, die per `links` auf
  Schulstoff-Sessions verweist (`refreshChat`, nur deren Stoff, heutiges Thema tabu; Ergebnis in `refresh`), von dort
  „Grundcheck <Fach>“ = Station `g-<fach>` (`basisStations`, nicht im Pfad). Begründung im Kommentar.
  Angezeigt wird nie die Plan-Tagesnummer (nur interne ID), sondern die Position im Pfad: „Session N“ (`sessionNo`),
  in der Session „Session x von y“, Stationen „Session a–b“ (`sessionRange`); sonst nur der Titel, auch in KI-Prompts.
  Ansicht der Stationen: `src/views/BasisView.tsx` (Route `#/wiederholung/g-…`), Chat in `basis` im Zustand. Lehrplan-Kasten zeigt je Jgst.
  die Videos der Stationssessions (gleiche Jgst. laut `SCHOOL_GRADE`), abspielbar unter `#/wiederholung/g-…/video/Tag/ID[/Sek.]`.
- `src/lib/srs.ts` – vereinfachtes SM-2 für Karteikarten.
- `src/lib/ink.ts`, `components/Ink.tsx`, `Icons.tsx`, `Coin.tsx` – Tusche-Optik: exakte Formen, Strichbreite je nach Richtung.
- Design: schwarz auf weiß, Schraffur statt Flächen, Farbe nur grün/rot in der Statistik. Navigation unten:
  Prüfung · Entdecken · Home (Lernpfad) · Statistik · Profil.
- **Entdecken** (`#/entdecken[/id]`, `src/views/FeedView.tsx`, lazy): Wissenshäppchen wie kurze Videos. Inhalte in
  `src/data/bites/*.ts` (50 Stück, je Überthema, vorab geschrieben, mit Quellen und Stempel belegt/umstritten/hype),
  Typen + Lader in `src/data/feed.ts`. Ablauf je Häppchen: Begrüßung (Bild per Kreis aufgedeckt, Wörter fliegen ein) →
  Aufhänger → 3 Absätze (alter blendet aus, neuer ein; **fett** = Tusche-Unterstrich) → Stempel → Zusammenfassung mit
  Merken / Session / Bild- und Quellennachweis. Läuft von selbst (Lesezeit je Wortzahl), links/rechts wischen oder tippen =
  vor/zurück, hoch/runter = nächstes/voriges Häppchen, Finger halten = Pause; Desktop: Pfeiltasten, Mausrad.
  Bilder: echte Fotos (keine Gemälde, kein Filter) mit freier Lizenz von Wikimedia Commons, `scripts/feed-images.mjs` lädt
  sie nach `public/feed/*.webp` (max. 900 px), Urheber + Lizenz in `src/data/bites/img.ts` – CC BY/BY-SA verlangen den
  Nachweis, der am Ende jedes Häppchens steht. Ton: `src/lib/sound.ts`, alles live per Web Audio (Musik je `mood`,
  Geräuschkulisse je `ambience`, Effekte zu jeder Bewegung), freigeschaltet beim ersten Antippen (`unlockAudio`),
  an/aus oben rechts (`feedSound`, Geräte-Einstellung). Reihenfolge: `src/lib/feed.ts` (Recherche und Gewichte im
  Kopfkommentar): Gefallen je Häppchen aus Sehdauer relativ zur Länge, Fortschritt, Zurückwischen, Halten, Merken,
  Session-Sprung, schnellem Wegwischen (`feed.log`); Interesse je Überthema = Regler „Was hat dir gefallen?“ als
  Startwert + Feed-Verhalten + Lernverhalten (eigene Fragen, Notizen, Antwortlänge, Präzision, Reaktion auf Fehler,
  freiwillige Prüfungen; richtig/falsch nur leicht), alles relativ zum eigenen Schnitt. Erst ein anderes Thema als die
  letzte Session, dann eins daraus, Zufall nach Unsicherheit, jede 4. Stelle erkunden, nie 3× dasselbe Überthema.
  Premium-Funktion: ohne Premium 3 neue Häppchen am Tag (`feed.daily`), danach Premium-Kasten; Premium gibt es noch
  nicht zu kaufen – `isPremium` ist bis dahin nur für Editor und `npm run dev` offen. `feed` gehört zu `PROGRESS_KEYS`.
- **Profil** (`#/profil[/bereich]`): links immer das Menü (Ich · Konto · Wissensstand · Stärken · Nach Tag 90 · Gemerkt ·
  KI · Erinnerung (App) · Sicherung · Editor · Rechtliches), rechts der Bereich. „Ich“ = Bild, Name, Streak, Kennzahlen.
- **Regel keine Erklärtexte (gilt für jede Änderung):** Keine hellgrauen Hinweis-/Erklärzeilen (`muted small` o. ä.), die
  beschreiben, was die Oberfläche ohnehin zeigt – keine Legenden („Grün = …“), Bedienhinweise („Antippen öffnet …“),
  Untertitel, die die Überschrift umschreiben, oder Methodik-Erklärungen. Erlaubt bleiben nur echte Information:
  Metadaten (Tag, Fach, Datum), Leer-/Ladezustände, Fehlermeldungen, Quellenangaben.
- **Regel Tusche-Optik (gilt für jede Änderung):** Alles außer Schrift – Kästen, Knöpfe, Felder, Chips, Trennlinien,
  Icons – sieht aus wie die Münzen auf Home: kräftiger, handgezeichneter Tusche-Strich (Federwinkel + Pinsel-Druckwechsel),
  nie ein glatter CSS-Rand/-Schatten. Umsetzung:
  - Kästen: `Frame`/`InkBorder` (`components/Ink.tsx`), freie Formen: `InkPaths` mit Strichen aus `lib/ink.ts`.
  - Schraffur haftet immer an ihrer Form, nie am Bild: Bewegt/dreht sich etwas, über eine SVG-Gruppen-Transformation
    (dann wandert `url(#hatch)` mit). Sind Lage oder Größe in die Punkte eingerechnet, `LocalHatch` (`views/Intro.tsx`)
    mit Anker und Richtung der Form verwenden – sonst rutscht das Muster sichtbar durch.
  - Alle übrigen CSS-Ränder zeichnet `src/lib/pen.ts` automatisch als Tusche (liest Breite/Farbe/Radius/gestrichelt aus dem CSS,
    Strich = Randbreite × 1,45). Neues Element mit Rand → Selektor in `SELECTOR` ergänzen oder `data-pen` setzen.
    Schraffur-Hintergründe auf solchen Elementen über `--hatch` statt `background`. Knöpfe (`.btn`): weiß mit Tusche-Umriss und
    Münzrand darunter (`--pen-rim`, Schattenstriche wie auf Home), nie schwarz gefüllt, kein `box-shadow`; Hauptknopf (`.primary`) nur fette Schrift. CSS-`border`-Kurzform setzt `border-image` zurück – deshalb stehen
    Rand und Hintergrund-Position in `.pen` mit `!important` (sonst versetztes, gekacheltes Tusche-Bild = fette Ecke oben links).
- `src/views/TopicView.tsx` – Themenkarte `#/thema/N`: Knopf einer Session auf Home öffnet zuerst sie (Abruf-Stationen direkt).
  Thema in der Mitte, Teilthemen als Wirkungsgefüge im Bogen links → oben → rechts → unten mit Tusche-Pfeilen, vom letzten
  ein Pfeil zum breiten Knopf (abgerundetes Rechteck mit Münzrand, `CoinButton` in `Coin.tsx`) „Session starten/fortsetzen/öffnen“ → `#/tag/N` (Status läuft).
  Teilthema antippen öffnet sein Video. Beschriftung neben dem Thema wird bei langen Wörtern kleiner, nie überlappend
  (beim Ändern alle 90 Karten auf Überlappung prüfen). Symbole: `src/components/Symbols.tsx` (eigene Tusche-Symbole + alle
  Icons), Zuordnung je Teilthema in `src/data/symbols.ts` (passend zum Video, `0` = Kreis mit Abspielzeichen).
- `src/views/ExamView.tsx` + `src/lib/exam.ts` – Prüfungsmodus `#/pruefung[/N]`: abgeschlossene Themen nach Dringlichkeit
  (Schwäche + Zeit seit letztem Abruf), oben Vorschlag, Münze fährt Kasten aus; Test = 1 Verständnis- + 1 Transferaufgabe
  (`examChat`), Ergebnisse in `exams`.
- `src/lib/recap.ts` + `components/WeekRecap.tsx` – Wochenrückblick: ab Montag beim ersten Öffnen von Home ein Kasten über die Vorwoche
  (Seiten: neu gelernt grob je Überthema · Wissensindex mit Zuwachs · nächste Stationen; Streak oben rechts; X oder letzte Seite
  schließt, `recapSeen` = Montag). Wissensindex = Anteil des Plans, der sitzt (gewichtet wie Prüfungsmodus) – bewusst kein IQ-Wert,
  Gc-Tests (WAIS) brauchen eine Normstichprobe.
- `src/lib/after90.ts` + `components/AfterNinety.tsx` – Weg nach Tag 90: Regler „Was hat dir gefallen?“ (4 Grobbereiche, `focus.likes`),
  Empfehlung per Regel (gern + Können → A breit / B spezialisieren / C Hybrid 70/30 + Erhaltungsmodus), Wahl in `focus.choice`
  (`breit` | `spezial:<Fach>` | `hybrid:<Fach>`). Großer Kasten oben auf Home, sobald Tag 90 fertig ist (danach eine Zeile), auch im Profil.
  Die eigentlichen Pfade A/B/C sind noch nicht gebaut.
- `src/views/Intro.tsx` – Einführung beim ersten Start: 6 animierte Folien (Tusche-Striche pro Bild aus einer Uhr je Folie,
  Bühne 340 × 430, Texte als HTML darüber): Blitz/Kristall mit Vergleich (✗ fluide / ✓ kristallin) → Kristall zerspringt
  zum Ring → Altersdiagramm zeichnet sich → die Kurven schlängeln aus dem Bild und legen sich als Kontur um den Blitz →
  erschöpfter Blitz läuft (trainierbar 1/5) → Muskel-Kristall mit Gesicht und Hantel (5/5) → Säule aus fallenden
  Bausteinen (je Baustein Schichten, damit nichts durchscheint) → Kreislauf Anschauen → Verstehen → Wiederholen →
  Auswerten mit Pfeilen + Logo → Aufruf „Erweitere auch du jetzt dein Wissen.“ mit Kristall in der Mitte und Konto-Knöpfen.
  Übergänge nur mit „Weiter“, nicht zurück/über die Punkte.
- `src/views/Onboarding.tsx` – erster Start: Einführung (`Intro`), dann Konto anlegen
  (E-Mail, Name, Geburtsjahr, Passwort mit Stärke-Skala – Pflicht nur 8+ Zeichen, sonst rote Meldung über „Registrieren“ – + Wiederholung) und Wissensstand.
  Unter „Registrieren“ und im Profil: Links auf `#/datenschutz` und `#/impressum` (`LegalLinks`). Konten ohne Geburtsjahr fragt `BirthYearOnly` einmal.
  Ohne Supabase nur Name + Wissensstand lokal. Mit Supabase auch „Ohne Konto starten“ (`guest` im Zustand, Name + Wissensstand lokal);
  Konto erst für KI und Sicherung (`AccountButton` in `components/NeedAccount.tsx` → `askAccount`, Fortschritt geht ins Konto über).
- `src/data/school.ts` – Wissensstand (Schule + Klasse / Studium / Ausbildung-Beruf), `SCHOOL_GRADE` (Jahrgangsstufe je Tag nach
  bayerischem LehrplanPLUS, Gymnasium G9) und `DAY_FACH` (Schulfach je Schulstoff-Tag). `src/data/lehrplan.ts` – Lernbereiche
  je Fach und Jgst. 5–13 aus lehrplanplus.bayern.de (gekürzt), Grundlage für Grundcheck und Stationsseite. Studium/Beruf: aller Schulstoff = Wiederholungstag; Schule Kl. G: Stoff < G.
  Wiederholungstage: in der Grundwiederholung (Station ihres Fachs), Videos optional, Prompts fragen Teilthemen ab und suchen Lücken.
- Rollen: `user` (Standard) und `editor` (nur per SQL vergeben, Trigger schützt die Spalte). Nur der Editor ändert
  Videolisten (✎, ★, + Video, „anderes Video“) – gespeichert in `day_videos` für alle; darf außerdem jede Chat-Nachricht löschen.
- Austausch (**vorerst ausgeblendet**, 17.10.2026: kein Knopf, `#/chat` führt auf Home; Code, Tabellen und Edge Function
  `ki-chat` bleiben für später): Kanäle ohne „#“ (IDs bleiben Slugs), Freunde (Suche nach Name, Anfrage → annehmen) + Direktnachrichten
  (`messages.channel = 'dm'` + `recipient`, nur unter Freunden lesbar/schreibbar) – `supabase/004_freunde.sql`.
  Routen `#/chat/freunde`, `#/chat/dm-<konto-id>`. Melden + Blockieren (`supabase/005_melden_blockieren.sql`): „…“ an fremden
  Nachrichten → Melden (Grund) / Blockieren (Nachrichten ausgeblendet per RLS, Freundschaft endet); Liste „Blockiert“ unter Freunde;
  Meldungen sieht nur der Editor (`#/chat/meldungen`). `is_ki = true` dürfen Nutzer nicht schreiben – KI-Antworten im Austausch
  schreibt die Edge Function `ki-chat` (liest Verlauf selbst, streamt, speichert); ohne Server bleibt der Chat lokal wie bisher.
  Öffentliche Kanäle erst ab 16 (`supabase/006_fortschritt.sql`: `birth_years`, nach dem Eintragen fest, `over_16()` in der RLS von
  `messages` und in `ki-chat`; nur Jahr bekannt → erst ab Jahr − Geburtsjahr ≥ 17, ohne Geburtsjahr gesperrt). Darunter nur Freunde + DMs.
- Konto löschen (Profil → Konto, E-Mail eintippen): Edge Function `delete-account` löscht `auth.users` → Kaskade, danach `wipeAll()`.
  Edge Functions teilen CORS/Kontoprüfung über `supabase/functions/_shared/auth.ts`.
- `src/data/legal.ts` + `src/views/LegalView.tsx` – Datenschutzerklärung + Impressum (`#/datenschutz`, `#/impressum`, auch vor der
  Anmeldung: das Onboarding bleibt darunter versteckt offen). **Entwurf**, persönliche Angaben als `[PLATZHALTER: …]`, vor dem Launch
  rechtlich prüfen. Ändert sich der Datenfluss (Anbieter, Tabelle, Tracking), Text nachziehen.
- `src/components/ErrorBoundary.tsx` – um Onboarding und alle Views (`resetKey` = Hash, Routenwechsel versucht neu), Knopf „Neu laden“.
- `src/lib/cloud.ts` + `supabase/schema.sql` + `supabase/002_konten_rollen.sql` – Konten (E-Mail/Passwort, implicit flow – Bestätigungslink meldet auch in anderem Browser an; Site URL = Pages-Adresse),
  Austausch-Chat (RLS, Realtime), Editor-Inhalte. Name/Wissensstand/Geburtsjahr liegen in den user_metadata.
  Fortschritt im Konto (`progress`, 006): `PROGRESS_KEYS` in `store.ts` (ohne Einstellungen/API-Key, `content`, Profil, Geräte-Flags),
  `setState` stempelt `progressAt` bei jeder Änderung daran. Beim Anmelden `pullProgress`: neuerer Zeitstempel gewinnt, ein leerer
  Stand ersetzt nie einen mit Fortschritt, weniger abgeschlossene Sessions nur nach Rückfrage; danach Hochladen 5 s nach der letzten
  Änderung, beim Verlassen der Seite per `fetch` mit `keepalive`. Gast-Fortschritt geht so beim ersten Anmelden ins Konto über.
  Konfiguration beim Bauen aus der lokalen `.env` (gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` (Publishable Key).
  Ohne Werte läuft der Chat nur lokal – vor `npm run deploy` prüfen. `VITE_DEV_LLM_KEY` gilt nur für `npm run dev`
  und darf nie in den Build gelangen (nach dem Build `dist/` auf `sk-` prüfen).
- `src/components/Markdown.tsx` – eigener Renderer ohne innerHTML.
- `scripts/icons.mjs` – erzeugt PWA-Icons (public/, dunkel/orange) und die nativen Vorlagen (assets/, schwarz auf weiß);
  `scripts/deploy.mjs` – Deploy auf gh-pages.
- **Native App (Capacitor 8):** `capacitor.config.ts` (App-ID `de.allgemeinwissen.app` – Vorschlag, vor der ersten Einreichung
  bestätigen), Projekte `ios/` (Swift Package Manager, kein CocoaPods) und `android/` im Repo; `ios/App/App/public` und
  `android/app/src/main/assets/public` sind Build-Kopien (gitignored). `npm run cap:sync [-- ios|android]` = `scripts/native.mjs`:
  entfernt `dist/.git` (Rest vom Deploy), baut, prüft auf `sk-`, `npx cap sync`. `npm run cap:assets` erzeugt Icons/Splash neu
  (`@capacitor/assets` aus `assets/`). iOS-Build ohne Mac: `codemagic.yaml` (TestFlight), Android: Android Studio (`npm run cap:android`).
  Derselbe Web-Build läuft überall; Unterschiede nur über `NATIVE` aus `src/lib/native.ts` (`Capacitor.isNativePlatform()`), immer mit Web-Fallback:
  - Service Worker nur im Web (`main.tsx`, `injectRegister: false` in `vite.config.ts`).
  - `shareFile`/`saveFile`: Share + Filesystem statt `navigator.share`/Download (Lernzettel, Sicherung im Profil).
  - `haptic`: Karte bewertet (leicht), Session/Station abgeschlossen (Erfolg).
  - Statusleiste dunkel auf weiß, Seite reicht unter die Uhr. Abstände nur über `--sa-top/-bottom/-left/-right` aus `index.css`, nie
    `env(safe-area-inset-*)` direkt (Android-WebView < 140 liefert die Werte nur als `--safe-area-inset-*` von Capacitor).
  - Externe Links (`a[href]` mit fremder http-Adresse) per Klick-Abfang im In-App-Browser (`@capacitor/browser`), `openExternal`.
  - Erinnerung `src/lib/reminder.ts`: `reminder` im Zustand (Geräte-Einstellung, nicht im Konto), Profil → „Erinnerung“ nur in der App.
    Plant lokale Mitteilungen für 30 Tage; heute entfällt, wenn schon eine Session/Station fertig ist; neu geplant bei Start,
    Rückkehr in die App und Änderungen. Android: ungenaue Alarme (`SCHEDULE_EXACT_ALARM` im Manifest entfernt), Symbol `ic_stat_notify.xml`.
  - Konto-Mails: `redirectTo`/`emailRedirectTo` = `de.allgemeinwissen.app://auth` bzw. `…?reset=1` (Info.plist `CFBundleURLTypes`,
    AndroidManifest `intent-filter`); `openAuthLink` in `cloud.ts` löst `#access_token=…` (Umweg über Supabase /verify) oder
    `?token_hash=…` ein. Beide Adressen stehen in Supabase → Auth → Redirect URLs (`de.allgemeinwissen.app://**`).
  - `ios/App/App/PrivacyInfo.xcprivacy` (im Xcode-Projekt eingetragen) + `docs/store-eintrag.md` (Store-Texte, Datenschutz-Angaben,
    Altersfreigabe): bei geändertem Datenfluss beide und `legal.ts` nachziehen.

## Regeln aus dem Lernplan (in den Prompts umgesetzt)

- Verständnischeck erst nach „verstanden“, 3–5 Fragen, eine nach der anderen, nur Inhalt der ★-Pflichtvideos,
  keine reinen Wiedergabefragen; bei Fehlern erklären + Nachfrage zum gleichen Punkt.
- MIX-Tage (17, 30, 43, …): ganze Block-Abfrage, keine Videos. Tag 5 ist ein normaler Tag mit Videos.
- BIO (Phase 2) und PSY: Evidenzcheck „belegt vs. Hype“.
- Zusammenfassung nur Stichpunkte + Grafik (Tabelle/Text-Diagramm).

## Hinweise

- Claude Code blockiert das öffentliche Veröffentlichen (Repo öffentlich machen, Pages einschalten) – das erledigt Julius selbst.
- Tokens/Zugangsdaten nie selbst setzen; `gh auth login` macht Julius. Ebenso Apple-/Google-Konten, Zertifikate, Codemagic.
- Auf diesem Windows-Rechner: kein Xcode, kein Android SDK (nur Java 8) – native Builds nicht hier, keine JDK/SDK selbst installieren.
- Antworten an Julius auf Deutsch, knapp.
