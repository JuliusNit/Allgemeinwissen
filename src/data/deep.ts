// Vertiefung nach Tag 90 (Phase 3): je Ueberthema 8 Sessions in Stufen – Grundmodelle (1–3), klassische Fragen (4–5),
// Streitfragen (6–7), eigenes Projekt (8). Die Wege nach Tag 90 (lib/after90.ts) waehlen daraus:
// A breit = Grundmodelle aller Faecher im Wechsel, B = alle 8 eines Fachs, C = Fach + jede 3. Session breit.
// Plan-Tage 91–186 (12 Bereiche × 8, Reihenfolge wie MAP_AREAS), Teilthemen nach den ausgewaehlten Videos (videos.ts).
import type { AreaId } from './plan'

export type Stage = 'grund' | 'klassik' | 'streit' | 'projekt'

export const STAGES: Record<Stage, string> = {
  grund: 'Grundmodelle',
  klassik: 'Klassische Fragen',
  streit: 'Streitfragen',
  projekt: 'Eigenes Projekt',
}

/** Stufe nach Position im Fach (0–7) */
export function stageAt(i: number): Stage {
  return i < 3 ? 'grund' : i < 5 ? 'klassik' : i < 7 ? 'streit' : 'projekt'
}

export const DEEP_FROM = 91
export const PER_AREA = 8

/** [Titel, Teilthemen, Verknuepfungen] je Fach; die 8. Session (Projekt) entsteht automatisch */
type Raw = [string, string, number[]]

export const DEEP_RAW: [AreaId, Raw[]][] = [
  ['GESCH', [
    ['Wie Historiker arbeiten: Quellen, Datierung, Erinnerung', 'Quellen & Quellenkritik · Archäologie & Altersbestimmung · Erinnerungskultur', [7, 18]],
    ['Herrschaft: Absolutismus, Stände, Parlament', 'Absolutismus: Ludwig XIV. · Ständegesellschaft · England: Glorious Revolution & Parlament', [31, 40]],
    ['Krisen des Spätmittelalters: Hanse, Pest, Bauernkrieg', 'Hanse & Fernhandel · Pest im 14. Jahrhundert · Bauernkrieg 1525', [31, 35]],
    ['Warum Europa? Handel, Kolonien, Industrie', 'Atlantischer Dreieckshandel & Sklaverei · Warum die Industrialisierung in England begann · Arm und Reich: Geografie als Ursache', [35, 44, 89]],
    ['Warum scheiterte die Weimarer Republik?', 'Versailles & Dolchstoßlegende · Hyperinflation & Weltwirtschaftskrise · Präsidialkabinette & 1933', [50, 57]],
    ['Kolonialismus und seine Folgen heute', 'Deutsche Kolonien & Völkermord an Herero und Nama · Berliner Konferenz & Grenzen Afrikas · Raubkunst & Rückgabe', [50, 73]],
    ['Geschichte als Streitfall: Erinnern und Missbrauchen', 'Vergangenheitsbewältigung in Deutschland · Denkmäler & Straßennamen im Streit · Geschichte als Propaganda', [57, 66, 87]],
  ]],
  ['PHIL', [
    ['Leib und Seele: Philosophie des Geistes', 'Leib-Seele-Problem & Dualismus · Bewusstsein & Qualia · Freier Wille vs. Determinismus', [38, 86]],
    ['Wissenschaftstheorie: Wann ist Wissen Wissenschaft?', 'Induktionsproblem · Popper: Falsifikation · Kuhn: Paradigmenwechsel', [12, 38]],
    ['Gott in der Philosophie: Beweise, Leid, Kritik', 'Gottesbeweise · Theodizee: Warum lässt Gott Leid zu? · Religionskritik: Feuerbach, Marx, Freud', [32, 85]],
    ['Was ist gerecht? Theorien der Gerechtigkeit', 'Gerechtigkeit bei Aristoteles · Rawls: Schleier des Nichtwissens · Leistung, Bedarf, Gleichheit', [46, 68]],
    ['Kritische Theorie und Postmoderne', 'Adorno & Horkheimer: Kulturindustrie · Habermas: Diskursethik · Foucault: Macht & Überwachung', [68, 85]],
    ['Angewandte Ethik: Tiere, Leben, Tod', 'Tierethik: Peter Singer · Sterbehilfe · Embryonen & Designerbabys', [46, 65]],
    ['Ethik der Technik: KI, Zukunft, Verantwortung', 'Maschinenethik & autonomes Fahren · Transhumanismus · Verantwortung für die Zukunft: Hans Jonas', [46, 70]],
  ]],
  ['PHY', [
    ['Mechanik vertieft: Kreise, Drehung, Schwingung', 'Kreisbewegung & Zentripetalkraft · Drehimpuls & Pirouetteneffekt · Schwingungen & Resonanz', [19, 27]],
    ['Wärme im Alltag: Pumpen, Strahlung, Zustände', 'Wärmepumpe & Kühlschrank · Wärmeleitung, Konvektion, Strahlung · Aggregatzustände & Phasenübergänge', [27, 79]],
    ['Elektromagnetische Wellen: von Funk bis Röntgen', 'Elektromagnetische Wellen · Das elektromagnetische Spektrum · Laser', [37, 49]],
    ['Quantenmechanik: die seltsame Welt der Quanten', 'Doppelspaltexperiment · Heisenbergsche Unschärferelation · Schrödingers Katze & Verschränkung', [49, 58]],
    ['Teilchenphysik: Woraus besteht alles?', 'Standardmodell der Teilchenphysik · Higgs-Teilchen & CERN · Antimaterie', [58, 84]],
    ['Offene Fragen: Schwarze Löcher, dunkle Energie, Multiversum', 'Schwarze Löcher · Dunkle Energie & beschleunigte Expansion · Stringtheorie & Multiversum', [49, 84]],
    ['Energie der Zukunft: Fusion, Endlager, Quantencomputer', 'Kernfusion & ITER · Atommüll & Endlager · Quantencomputer', [58, 79]],
  ]],
  ['BIO', [
    ['Mikroben: Bakterien, Viren, Mikrobiom', 'Bakterien & Viren im Vergleich · Darmflora & Mikrobiom · Stammzellen', [1, 53]],
    ['Evolution vertieft: Sex, Symbiose, Epigenetik', 'Sexuelle Selektion · Koevolution & Symbiose · Epigenetik', [10, 23]],
    ['Ökosysteme vertieft: Fotosynthese, Populationen, Invasoren', 'Fotosynthese · Räuber-Beute-Beziehung & Populationen · Invasive Arten', [33, 1]],
    ['Wie entstand das Leben?', 'Ursuppe & Miller-Urey-Experiment · RNA-Welt-Hypothese · Endosymbiontentheorie', [10, 33]],
    ['Krebs und Altern', 'Wie Krebs entsteht · Warum wir altern: Telomere · Krebstherapie: Chemo bis Immuntherapie', [23, 53]],
    ['Gentechnik: Pflanzen, Therapie, Klonen', 'Grüne Gentechnik · Gentherapie · Klonen', [23, 79]],
    ['Umwelt und Gesundheit im Faktencheck', 'Mikroplastik · Glyphosat & Insektensterben · Antibiotika in der Tierhaltung', [33, 53, 65]],
  ]],
  ['DENK', [
    ['Paradoxe der Wahrscheinlichkeit', 'Ziegenproblem · Geburtstagsparadoxon · Spielerfehlschluss & Gesetz der großen Zahlen', [25, 54]],
    ['Statistik lesen: Mittelwert, Streuung, Grafiken', 'Mittelwert, Median, Modus · Normalverteilung & Standardabweichung · Irreführende Grafiken', [25, 54]],
    ['Komplexe Systeme: Netzwerke, Emergenz, Pareto', 'Pareto-Prinzip · Netzwerkeffekte · Emergenz & Schwarmverhalten', [78, 33]],
    ['Gut begründen: Beweislast, Ockham, Bayes im Alltag', 'Ockhams Rasiermesser · Beweislast & außergewöhnliche Behauptungen · Bayes im Alltag: Tests richtig deuten', [36, 54]],
    ['Grenzen von Logik und Mathematik', 'Gödels Unvollständigkeitssatz · Unendlichkeit: Hilberts Hotel · Paradoxien: Lügner & Russell', [36, 22]],
    ['Pseudowissenschaft erkennen', 'Homöopathie im Faktencheck · Verschwörungstheorien · Wissenschaft vs. Pseudowissenschaft', [12, 87]],
    ['Daten und Macht: Big Data, Überwachung, Fairness', 'Big Data · Überwachung & Datenschutz · Algorithmen, die diskriminieren', [70, 87]],
  ]],
  ['WIRT', [
    ['Unternehmen und Börse', 'Rechtsformen & Unternehmen · Aktien & Börse · Bilanz & Gewinn', [11, 80]],
    ['Der Staat in der Wirtschaft: Schulden, Sozialstaat, Konjunktur', 'Staatsverschuldung & Schuldenbremse · Sozialstaat · Keynes vs. Friedman', [28, 47, 67]],
    ['Arbeitsmarkt: Arbeitslosigkeit, Mindestlohn, Tarif', 'Arten der Arbeitslosigkeit · Mindestlohn · Gewerkschaften & Tarifverträge', [11, 47]],
    ['Finanzkrisen: 1929, 2008, Euro', 'Weltwirtschaftskrise 1929 · Finanzkrise 2008 · Eurokrise', [28, 57]],
    ['Warum sind Länder reich oder arm?', 'Institutionen & Wohlstand · Entwicklungshilfe · Ungleichheit & Gini-Koeffizient', [47, 67]],
    ['Wirtschaft und Klima: CO₂-Preis, Wachstum, Verzicht', 'CO₂-Preis & Emissionshandel · Grünes Wachstum vs. Degrowth · Kosten des Klimawandels', [42, 71]],
    ['Neue Geldfragen: Krypto, Inflation, Grundeinkommen', 'Bitcoin & Kryptowährungen · Inflation 2022: Ursachen · Bedingungsloses Grundeinkommen', [28, 80]],
  ]],
  ['LIT', [
    ['Wie Texte funktionieren: Drama, Erzählen, Gedicht', 'Aufbau des Dramas · Erzählperspektive · Lyrik: Metrum & Reim', [48, 88]],
    ['Deutsche Klassiker: Lessing, Schiller, Büchner', 'Lessing: Nathan der Weise · Schiller: Die Räuber · Büchner: Woyzeck', [48, 40]],
    ['Märchen und Mythen der Welt', 'Grimms Märchen · Nordische Mythologie · Die Heldenreise', [20, 26]],
    ['Große Romane des 19. Jahrhunderts', 'Fontane: Effi Briest · Austen: Stolz und Vorurteil · Tolstoi: Anna Karenina', [48, 81]],
    ['Literatur der Moderne: Mann, Brecht, Hesse', 'Thomas Mann: Buddenbrooks · Brecht: episches Theater · Hesse: Der Steppenwolf', [81, 48]],
    ['Literatur nach 1945: Trümmer, Schuld, Erinnerung', 'Trümmerliteratur: Borchert · Gruppe 47 & Böll · Celan: Todesfuge', [57, 81]],
    ['Sprache im Streit: Gendern, Anglizismen, Jugendsprache', 'Gendern · Anglizismen & Sprachwandel · Jugendsprache', [88]],
  ]],
  ['KUL', [
    ['Bilder lesen: Analyse, Perspektive, Farbe', 'Bildanalyse · Zentralperspektive · Farbenlehre & Farbwirkung', [13, 60]],
    ['Große Meister: Leonardo, Rembrandt, Friedrich', 'Leonardo da Vinci · Rembrandt · Caspar David Friedrich', [13, 35]],
    ['Musik verstehen: Töne, Orchester, Oper', 'Tonleiter, Dur & Moll · Das Orchester · Die Oper', [51]],
    ['Was ist Kunst? Readymade, Gegenwart, Markt', 'Duchamp & das Readymade · Gegenwartskunst & documenta · Kunstmarkt: Warum Kunst Millionen kostet', [60]],
    ['Stadt und Architektur', 'Städtebau & Stadtplanung · Wolkenkratzer · Nachhaltiges Bauen', [34, 77]],
    ['Kunst und Politik: Verfemt, zensiert, benutzt', '„Entartete Kunst“ · Kunstfreiheit & Zensur · Propaganda im Film', [57, 60, 76]],
    ['Kultur digital: KI-Kunst, Streaming, Spiele', 'KI-Bilder & Urheberrecht · Streaming & Musikindustrie · Videospiele als Kunst', [70, 76]],
  ]],
  ['POL', [
    ['Wie ein Gesetz entsteht: Bundestag, Bundesrat, Parteien', 'Gesetzgebungsverfahren · Föderalismus & Bundesrat · Parteien in Deutschland', [5, 15]],
    ['Demokratie im Vergleich: Wahlsysteme, Volksentscheid, USA', 'Mehrheits- vs. Verhältniswahl · Direkte Demokratie · Das politische System der USA', [5, 15]],
    ['Strafrecht und Justiz', 'Grundlagen des Strafrechts · Aufbau der Gerichte · Ablauf eines Strafprozesses', [15, 75]],
    ['Menschenrechte: Erklärung, Gericht, Asyl', 'Allgemeine Erklärung der Menschenrechte · Internationaler Strafgerichtshof · Asylrecht', [15, 64]],
    ['Krieg und Frieden: Abschreckung, Terror, UN-Einsätze', 'Atomwaffen & Abschreckung · Terrorismus · Blauhelme & Friedensmissionen', [61, 64, 83]],
    ['Demokratie unter Druck: Populismus, Extremismus, Lobby', 'Populismus · Wehrhafte Demokratie & Parteiverbot · Lobbyismus', [15, 52]],
    ['Politische Streitfragen: Migration, Klima, Wehrpflicht', 'Migrationspolitik · Klimapolitik & Pariser Abkommen · Wehrpflicht', [71, 77, 83]],
  ]],
  ['PSY', [
    ['Wie wir lernen: Konditionierung und Vorbilder', 'Klassische Konditionierung · Operante Konditionierung · Lernen am Modell', [6, 55]],
    ['Wahrnehmung und Aufmerksamkeit', 'Optische Täuschungen · Selektive Aufmerksamkeit · Schlaf & Träume', [4, 63]],
    ['Kommunikation und Beziehungen', 'Kommunikationsmodelle: Watzlawick & Schulz von Thun · Liebe & Anziehung · Konflikte lösen', [41]],
    ['Berühmte Experimente der Psychologie', 'Stanford-Prison-Experiment · Marshmallow-Test · Little Albert', [16, 41]],
    ['Psychische Störungen: Schizophrenie, ADHS, Sucht', 'Schizophrenie · ADHS · Sucht', [55, 74]],
    ['Psychologie im Faktencheck', 'Replikationskrise der Psychologie · Persönlichkeitstests: MBTI im Faktencheck · Mythos Lerntypen', [12, 16]],
    ['Psyche und Gesellschaft: Social Media, Glück, Einsamkeit', 'Social Media & psychische Gesundheit · Glücksforschung · Einsamkeit', [74, 87]],
  ]],
  ['GEO', [
    ['Landschaften formen: Gletscher, Flüsse, Wüsten', 'Gletscher & Eiszeiten · Flüsse & Erosion · Wüsten', [9, 29]],
    ['Ozeane und Atmosphäre: Strömungen, Monsun, El Niño', 'Meeresströmungen & Golfstrom · Atmosphärische Zirkulation & Monsun · El Niño', [9, 71]],
    ['Ressourcen: Wasser, Boden, Rohstoffe', 'Wasser als Ressource · Boden · Seltene Erden & Rohstoffe', [29, 83]],
    ['Globaler Süden: Entwicklung und Ungleichheit', 'Nord-Süd-Gefälle · Entwicklung messen: HDI · Fairer Handel', [67, 77]],
    ['Naturgefahren: Tsunami, Hurrikan, Hochwasser', 'Tsunamis · Hurrikane · Hochwasser & Dürre', [29, 71]],
    ['Klima in Zukunft: Meeresspiegel, Anpassung, Geoengineering', 'Meeresspiegelanstieg · Anpassung an den Klimawandel · Geoengineering', [71, 77]],
    ['Stadt der Zukunft: Verkehr, Wohnen, Smart City', 'Verkehrswende · Gentrifizierung · Smart City', [77]],
  ]],
  ['TECH', [
    ['Wie Antriebe funktionieren: Motor, Akku, Flugzeug', 'Verbrennungsmotor · Elektroauto & Akku · Wie ein Flugzeug fliegt', [27, 45]],
    ['Chips und Ortung: Halbleiter, Transistor, GPS', 'Halbleiter · Transistor & Mikrochip · GPS', [37, 62]],
    ['Netze: Mobilfunk, Glasfaser, Satelliten', 'Mobilfunk & 5G · Glasfaser · Satelliten', [49, 70]],
    ['Software: Programmieren, Verschlüsselung, Blockchain', 'Programmieren: Grundlagen · Verschlüsselung · Blockchain', [62, 70]],
    ['Raumfahrt: Raketen, ISS, Mars', 'Wie Raketen fliegen · Die Internationale Raumstation · Mission zum Mars', [19, 84]],
    ['Wie gefährlich ist KI?', 'Risiken künstlicher Intelligenz · KI & Arbeitsmarkt · Deepfakes', [70, 87]],
    ['Technik und Sicherheit: Hacker, Überwachung, Folgen', 'Cyberangriffe & Hacker · Überwachungstechnik · Technikfolgen abschätzen', [70, 62]],
  ]],
]
