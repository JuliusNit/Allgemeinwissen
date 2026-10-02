// Lernplan – Allgemeinwissen. Inhalt 1:1 aus dem Plan, Teilthemen fuer Phase 2 ergaenzt.

export type AreaId =
  | 'BIO' | 'CHE' | 'NERV' | 'MIX'
  | 'GESCH' | 'GEO' | 'PHY' | 'TECH' | 'DENK' | 'WIRT'
  | 'POL' | 'PSY' | 'PHIL' | 'KUL' | 'LIT'

export interface Area {
  id: AreaId
  name: string
  color: string
  subtopics?: string
}

export const AREAS: Record<AreaId, Area> = {
  GESCH: { id: 'GESCH', name: 'Geschichte', color: '#c2410c', subtopics: 'Zeitstrahl · Hochkulturen · Griechenland · Rom · Mittelalter · Renaissance/Reformation · Aufklärung/Revolutionen · Industrialisierung · Imperialismus/WK I · Weimar/NS/WK II · Kalter Krieg · Deutschland nach 1945 · Nicht-westliche Welt · Muster der Geschichte' },
  PHIL: { id: 'PHIL', name: 'Philosophie & Religion', color: '#7c3aed', subtopics: 'Große Fragen · Antike/Stoa · Erkenntnis/Kant · Ethik · Politische Philosophie · Moderne/Existenzialismus · Abrahamitische Religionen · Asiatische Religionen' },
  PHY: { id: 'PHY', name: 'Physik & Kosmos', color: '#2563eb', subtopics: 'Größenordnungen · Newton · Energie/Thermodynamik · Elektrizität · Licht & Relativität · Atom/Periodensystem/Kernkraft · Kosmos' },
  BIO: { id: 'BIO', name: 'Leben & Körper', color: '#16a34a', subtopics: 'Evolution · Genetik · Stammbaum & Ökologie · Organsysteme · Immunsystem/Impfung · Gesundheit evidenzbasiert · Gehirn & menschliche Evolution' },
  DENK: { id: 'DENK', name: 'Denkwerkzeuge & Statistik', color: '#0891b2', subtopics: 'Lernen lernen · Wissenschaftliche Methode · Statistik I & II · Logik & Fehlschlüsse · Denkmodelle · Medienkompetenz' },
  WIRT: { id: 'WIRT', name: 'Wirtschaft & Geld', color: '#ca8a04', subtopics: 'Angebot/Nachfrage · Geld & Zentralbank · Marktversagen · Wirtschaftssysteme · Konjunktur & Handel · Persönliche Finanzen' },
  LIT: { id: 'LIT', name: 'Literatur, Mythen & Sprache', color: '#db2777', subtopics: 'Griechische Mythen · Bibel als Kulturtext · Literaturepochen · Weltliteratur I & II · Sprache & Rhetorik' },
  KUL: { id: 'KUL', name: 'Kunst, Architektur, Musik, Film', color: '#e11d48', subtopics: 'Stilepochen · Architektur · Malerei der Moderne · Musik Barock–Romantik · Musik 20. Jh. & Film' },
  POL: { id: 'POL', name: 'Staat, Recht & Weltpolitik', color: '#4f46e5', subtopics: 'Grundgesetz · Ideologien · EU & internationale Ordnung · Recht im Alltag · Geopolitik' },
  PSY: { id: 'PSY', name: 'Psychologie', color: '#9333ea', subtopics: 'Persönlichkeit & Intelligenz · Sozialpsychologie · Emotion/Stress/Motivation · Denkfehler · Entwicklung & psychische Gesundheit' },
  GEO: { id: 'GEO', name: 'Erde & Geografie', color: '#0d9488', subtopics: 'Weltkarte · Erdgeschichte/Plattentektonik · Wetter & Klima · Bevölkerung & Migration' },
  TECH: { id: 'TECH', name: 'Technik', color: '#64748b', subtopics: 'Große Erfindungen · Computer · Internet & KI · Energie & Biotech' },
  CHE: { id: 'CHE', name: 'Chemie', color: '#ea580c' },
  NERV: { id: 'NERV', name: 'Nervensystem', color: '#a21caf' },
  MIX: { id: 'MIX', name: 'Gemischte Wiederholung', color: '#78716c' },
}

/** Reihenfolge der Wissenslandkarte */
export const MAP_AREAS: AreaId[] = ['GESCH', 'PHIL', 'PHY', 'BIO', 'DENK', 'WIRT', 'LIT', 'KUL', 'POL', 'PSY', 'GEO', 'TECH']

export interface Block {
  id: number
  name: string
  from: number
  to: number
}

export const BLOCKS: Block[] = [
  { id: 0, name: 'Phase 1 – Wiederholung', from: 1, to: 5 },
  { id: 1, name: 'Block 1 – Gerüste bauen', from: 6, to: 17 },
  { id: 2, name: 'Block 2 – Anfänge: Antike & Naturgesetze', from: 18, to: 30 },
  { id: 3, name: 'Block 3 – Mittelalter bis Aufklärung', from: 31, to: 43 },
  { id: 4, name: 'Block 4 – Das lange 19. Jahrhundert', from: 44, to: 56 },
  { id: 5, name: 'Block 5 – Das 20. Jahrhundert', from: 57, to: 69 },
  { id: 6, name: 'Block 6 – Die Gegenwart verstehen', from: 70, to: 82 },
  { id: 7, name: 'Block 7 – Synthese', from: 83, to: 90 },
]

export interface Video {
  id: string
  title: string
  url: string
  star: boolean
}

export interface Day {
  day: number
  phase: 1 | 2
  block: number
  area: AreaId
  title: string
  subtopics: string[]
  /** fruehere Sessions, an die das Thema anknuepft */
  links: number[]
  /** Evidenzcheck "belegt vs. Hype" */
  evidence: boolean
}

type Raw = [number, AreaId, string, string, number[]]

const RAW: Raw[] = [
  // Phase 1
  [1, 'BIO', 'Zelle & Energie', 'Zellaufbau · Membran · Transportvorgänge · Enzyme · ATP', []],
  [2, 'CHE', 'Biomoleküle & Reaktionen', 'Kohlenhydrate · Fette · Proteine (Struktur) · Redox · Säure/Base', [1]],
  [3, 'BIO', 'Stoffwechsel & Gene', 'Glykolyse · Citratzyklus · Atmungskette · Proteinbiosynthese · Genregulation', [1, 2]],
  [4, 'NERV', 'Nerven & Hormone', 'Neuron · Aktionspotenzial · Synapse · Neurotransmitter · Hormone & Regelkreise (Blutzucker, Stress)', [1, 3]],
  [5, 'MIX', 'Physik, Immunsystem & Politik', 'Kraft & Energie · Leistung & Hebel · Immunsystem · Politisches System · Wahlen', [1, 2, 3, 4]],
  // Block 1
  [6, 'DENK', 'Lernen lernen: Gedächtnis, Spaced Repetition, Active Recall', 'Gedächtnismodelle (Kurz- & Langzeitgedächtnis) · Vergessenskurve & Spaced Repetition · Active Recall & Testeffekt · Interleaving & Elaboration', [4]],
  [7, 'GESCH', 'Zeitstrahl der Menschheit: Steinzeit bis heute im Überblick', 'Steinzeit & neolithische Revolution · Antike Hochkulturen bis Rom · Mittelalter bis frühe Neuzeit · Industrialisierung bis heute', []],
  [8, 'PHY', 'Größenordnungen: vom Atom bis zum Universum', 'Zehnerpotenzen & wissenschaftliche Schreibweise · Vom Atom zur Zelle · Vom Menschen zur Erde · Sonnensystem, Galaxie, Universum', [1]],
  [9, 'GEO', 'Weltkarte: Kontinente, Ozeane, Klimazonen, wichtige Länder', 'Kontinente & Ozeane · Klima- & Vegetationszonen · Gebirge, Flüsse & Wüsten · Wichtige Länder & Bevölkerungszentren', [7]],
  [10, 'BIO', 'Evolution: Variation, Selektion, Artbildung', 'Darwin & natürliche Selektion · Variation & Mutation · Artbildung & Isolation · Belege der Evolution (Fossilien, Homologie, DNA)', [3, 8, 9]],
  [11, 'WIRT', 'Grundmodell: Knappheit, Angebot & Nachfrage, Anreize', 'Knappheit & Opportunitätskosten · Angebot & Nachfrage · Preisbildung & Marktgleichgewicht · Anreize & Elastizität', [6]],
  [12, 'DENK', 'Wissenschaftliche Methode & Evidenzpyramide', 'Hypothese, Experiment & Falsifikation · Kontrollgruppe, Placebo & Doppelblindstudie · Evidenzpyramide: Fallbericht bis Metaanalyse · Peer Review & Replikationskrise', [6, 10]],
  [13, 'KUL', 'Kunst- & Stilepochen als Zeitleiste', 'Antike & Mittelalter: Romanik, Gotik · Renaissance & Barock · Klassizismus, Romantik, Realismus · Moderne Kunst im Überblick', [7]],
  [14, 'PHIL', 'Die großen Fragen der Philosophie & Hauptströmungen', 'Was ist Philosophie? Die vier Fragen Kants · Metaphysik & Erkenntnistheorie · Ethik & politische Philosophie · Philosophische Strömungen auf dem Zeitstrahl', [7, 13]],
  [15, 'POL', 'Grundgesetz, Rechtsstaat, Gewaltenteilung, Grundrechte', 'Grundgesetz: Entstehung & Aufbau · Grundrechte & Menschenwürde · Gewaltenteilung & Verfassungsorgane · Rechtsstaat & Bundesverfassungsgericht', [5]],
  [16, 'PSY', 'Persönlichkeit (Big Five) & Intelligenz (fluid vs. kristallin)', 'Big-Five-Persönlichkeitsmodell · Intelligenz, IQ & g-Faktor · Fluide vs. kristalline Intelligenz · Anlage vs. Umwelt: Zwillingsstudien', [4, 6, 12]],
  [17, 'MIX', 'Block 1: Zeitstrahl + Karte + Größenordnungen verknüpfen', 'Zeitstrahl-Abfrage · Weltkarten-Abfrage · Größenordnungen schätzen · Verknüpfungsfragen zwischen Bereichen', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]],
  // Block 2
  [18, 'GESCH', 'Frühe Hochkulturen: Mesopotamien, Ägypten, Indus, China', 'Neolithische Revolution & erste Städte · Mesopotamien: Keilschrift & Codex Hammurabi · Altes Ägypten: Nil, Pharaonen, Pyramiden · Induskultur & frühes China', [7, 9]],
  [19, 'PHY', 'Newton: Bewegung, Kraft, Gravitation', 'Newtons drei Gesetze · Kraft, Masse & Beschleunigung · Gravitation & Planetenbahnen · Impuls & Erhaltungssätze', [5, 8]],
  [20, 'LIT', 'Griechische Mythen & Sagen (Anspielungen verstehen)', 'Die Götter des Olymp · Helden: Herakles, Perseus, Theseus · Trojanischer Krieg & Odyssee · Mythen in unserer Sprache (Achillesferse, Pandora, Sisyphos)', [7, 14]],
  [21, 'GESCH', 'Antike I: Griechenland & Demokratie', 'Polis & Kolonisation · Athen: Demokratie unter Perikles · Sparta & Perserkriege · Alexander der Große & Hellenismus', [18, 20, 15]],
  [22, 'PHIL', 'Antike Philosophie: Sokrates, Platon, Aristoteles, Stoa', 'Vorsokratiker · Sokrates & die sokratische Methode · Platon: Ideenlehre & Höhlengleichnis · Aristoteles & die Stoa', [14, 21]],
  [23, 'BIO', 'Genetik: Vererbung, DNA, Mutation', 'Mendelsche Regeln · DNA-Struktur & Replikation · Mutationen & ihre Folgen · Vom Gen zum Merkmal', [3, 10]],
  [24, 'GESCH', 'Antike II: Rom – Republik, Kaiserreich, Untergang', 'Gründung Roms & Römische Republik · Caesar & das Ende der Republik · Kaiserzeit & Pax Romana · Untergang Westroms & Byzanz', [21, 22]],
  [25, 'DENK', 'Statistik I: Wahrscheinlichkeit, Risiko, Prozente', 'Wahrscheinlichkeit Grundlagen · Absolutes vs. relatives Risiko · Prozent vs. Prozentpunkte · Erwartungswert', [12]],
  [26, 'LIT', 'Die Bibel als Kulturtext: zentrale Geschichten', 'Schöpfung, Sündenfall & Sintflut · Abraham, Mose & Exodus · Jesus, Gleichnisse & Passion · Biblische Redewendungen im Alltag', [18, 20, 24]],
  [27, 'PHY', 'Energie & Thermodynamik (Energieerhaltung, Entropie)', 'Energieformen & Energieerhaltung · Wärme & Temperatur · Hauptsätze der Thermodynamik · Entropie & Wirkungsgrad', [1, 5, 19]],
  [28, 'WIRT', 'Geld, Inflation, Zinsen, Zentralbank', 'Funktionen des Geldes · Inflation & Deflation · Zinsen & Zinseszins · Zentralbank & Geldpolitik (EZB)', [11, 25]],
  [29, 'GEO', 'Erdgeschichte & Plattentektonik: Vulkane, Erdbeben', 'Erdzeitalter & geologische Zeitskala · Schalenaufbau der Erde · Plattentektonik · Vulkane & Erdbeben', [8, 9, 10]],
  [30, 'MIX', 'Block 2', 'Gemischte Abfrage Block 2 · Antike verknüpfen: Geschichte ↔ Mythen ↔ Philosophie · Naturgesetze: Newton ↔ Energie · Verknüpfungsfragen zwischen Bereichen', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]],
  // Block 3
  [31, 'GESCH', 'Mittelalter: Feudalismus, Kirche, islamische Welt, Kreuzzüge', 'Frankenreich & Karl der Große · Feudalismus & Lehnswesen · Kirche & Papsttum · Islamische Welt & Kreuzzüge', [24, 26]],
  [32, 'PHIL', 'Religionen I: Judentum, Christentum, Islam', 'Judentum · Christentum & Konfessionen · Islam: Entstehung & fünf Säulen · Gemeinsamkeiten der abrahamitischen Religionen', [26, 31]],
  [33, 'BIO', 'Stammbaum des Lebens & Ökologie (Kreisläufe, Ökosysteme)', 'Stammbaum des Lebens: die drei Domänen · Ökosysteme & Nahrungsnetze · Stoffkreisläufe: Kohlenstoff & Stickstoff · Biodiversität', [10, 23, 29]],
  [34, 'KUL', 'Architektur: Romanik bis Moderne erkennen', 'Antike Säulenordnungen · Romanik vs. Gotik · Renaissance & Barock · Moderne: Bauhaus bis heute', [13, 21, 31]],
  [35, 'GESCH', 'Renaissance, Reformation, Entdeckungsfahrten', 'Renaissance & Humanismus · Buchdruck · Luther & die Reformation · Entdeckungsfahrten & Kolonialismus', [31, 34, 13]],
  [36, 'DENK', 'Logik & Argumentationsfehler', 'Deduktion vs. Induktion · Gültige Argumente & Syllogismen · Fehlschlüsse: Strohmann, ad hominem · Fehlschlüsse: Dammbruch, falsche Dichotomie', [12, 22]],
  [37, 'PHY', 'Elektrizität & Magnetismus', 'Ladung, Strom & Spannung · Ohmsches Gesetz & Stromkreise · Magnetismus & Elektromagnetismus · Induktion, Generator & Motor', [4, 27]],
  [38, 'PHIL', 'Erkenntnistheorie: Rationalismus, Empirismus, Kant', 'Rationalismus: Descartes · Empirismus: Locke & Hume · Kants Synthese · Was ist Wissen?', [22, 36, 35]],
  [39, 'BIO', 'Organsysteme: Herz-Kreislauf, Atmung, Verdauung', 'Herz & Blutkreislauf · Atmung & Gasaustausch · Verdauung · Niere & Ausscheidung', [3, 27]],
  [40, 'GESCH', 'Aufklärung & Revolutionen (Amerika, Frankreich)', 'Aufklärung · Amerikanische Revolution · Französische Revolution · Napoleon', [35, 38, 15]],
  [41, 'PSY', 'Sozialpsychologie: Konformität, Gehorsam, Gruppen, Überzeugung', 'Konformität: Asch-Experiment · Gehorsam: Milgram-Experiment · Gruppendynamik & Gruppendenken · Überzeugung & Einstellungsänderung', [16, 36]],
  [42, 'WIRT', 'Märkte & Marktversagen: Externalitäten, Monopole', 'Externe Effekte · Öffentliche Güter · Monopole & Marktmacht · Informationsasymmetrie', [11, 28]],
  [43, 'MIX', 'Block 3', 'Gemischte Abfrage Block 3 · Mittelalter → Aufklärung als Kette · Epoche ↔ Baustil ↔ Philosoph · Verknüpfungsfragen zwischen Bereichen', [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]],
  // Block 4
  [44, 'GESCH', 'Industrialisierung & Nationalstaaten (inkl. dt. Einigung)', 'Industrielle Revolution in England · Soziale Frage · Nationalismus & Nationalstaaten · Deutsche Einigung 1871', [40, 27]],
  [45, 'TECH', 'Große Erfindungen: Buchdruck, Dampf, Strom, Medizin', 'Buchdruck · Dampfmaschine · Elektrizität & Glühbirne · Medizin: Hygiene, Narkose, Antibiotika', [35, 44, 37]],
  [46, 'PHIL', 'Ethik: Utilitarismus, Pflichtethik, Tugendethik', 'Utilitarismus: Bentham & Mill · Pflichtethik: Kant · Tugendethik: Aristoteles · Ethische Dilemmata: Trolley-Problem', [22, 38]],
  [47, 'WIRT', 'Wirtschaftssysteme: Kapitalismus, Sozialismus, soziale Marktwirtschaft', 'Kapitalismus: Adam Smith · Sozialismus & Planwirtschaft: Marx · Soziale Marktwirtschaft · Wirtschaftssysteme im Vergleich', [42, 44]],
  [48, 'LIT', 'Literaturepochen (Barock bis Moderne)', 'Barock · Aufklärung & Sturm und Drang · Klassik & Romantik · Realismus bis Moderne', [13, 40]],
  [49, 'PHY', 'Licht, Wellen & Relativitätstheorie', 'Wellen & Schwingungen · Licht: Welle und Teilchen · Spezielle Relativitätstheorie · Allgemeine Relativitätstheorie', [19, 37]],
  [50, 'GESCH', 'Imperialismus & Erster Weltkrieg', 'Imperialismus · Bündnissysteme & Julikrise · Verlauf des Ersten Weltkriegs · Versailler Vertrag', [44, 47]],
  [51, 'KUL', 'Musikgeschichte I: Barock, Klassik, Romantik', 'Barockmusik: Bach & Vivaldi · Wiener Klassik: Haydn, Mozart, Beethoven · Romantik: Schubert & Wagner · Formen: Sinfonie, Sonate, Oper', [13, 34, 48]],
  [52, 'POL', 'Politische Ideologien: Liberalismus, Konservatismus, Sozialismus, Nationalismus', 'Liberalismus · Konservatismus · Sozialismus · Nationalismus', [40, 44, 47]],
  [53, 'BIO', 'Immunsystem, Infektionen, Impfung, Antibiotika', 'Angeborenes Immunsystem · Adaptives Immunsystem · Impfung · Antibiotika & Resistenzen', [5, 10, 45]],
  [54, 'DENK', 'Statistik II: Korrelation vs. Kausalität, Stichproben, Bayes', 'Korrelation vs. Kausalität · Stichproben & Verzerrungen · Signifikanz & p-Wert · Satz von Bayes', [12, 25]],
  [55, 'PSY', 'Emotion, Stress & Motivation', 'Emotionstheorien · Stress & Stressreaktion · Intrinsische vs. extrinsische Motivation · Belohnungssystem & Dopamin', [4, 41]],
  [56, 'MIX', 'Block 4', 'Gemischte Abfrage Block 4 · 19. Jahrhundert: Industrie ↔ Ideologien ↔ Kunst · Wissenschaft: Licht, Immunsystem, Statistik · Verknüpfungsfragen zwischen Bereichen', [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]],
  // Block 5
  [57, 'GESCH', 'Weimar, Nationalsozialismus, Zweiter Weltkrieg', 'Weimarer Republik · Aufstieg der NSDAP · NS-Diktatur & Holocaust · Zweiter Weltkrieg', [50, 52]],
  [58, 'PHY', 'Atom, Periodensystem, Quanten & Kernkraft', 'Atommodelle · Periodensystem · Quantenphysik Grundlagen · Kernspaltung & Kernfusion', [2, 8, 49]],
  [59, 'LIT', 'Weltliteratur I: Homer, Dante, Shakespeare, Cervantes', 'Homer: Ilias & Odyssee · Dante: Göttliche Komödie · Shakespeare · Cervantes: Don Quijote', [20, 35, 48]],
  [60, 'KUL', 'Malerei der Moderne: Impressionismus bis Pop Art', 'Impressionismus · Expressionismus & Kubismus · Surrealismus & Abstraktion · Pop Art', [13, 51]],
  [61, 'GESCH', 'Kalter Krieg & Dekolonisierung', 'Blockbildung & Eiserner Vorhang · Kubakrise & Wettrüsten · Dekolonisierung · Zerfall der Sowjetunion', [57, 52]],
  [62, 'TECH', 'Computer: Bits, Logikgatter, Programme', 'Bits & Binärsystem · Logikgatter · Von-Neumann-Architektur · Programme & Algorithmen', [37, 36]],
  [63, 'PSY', 'Kognitive Verzerrungen & System 1/2', 'System 1 & System 2 (Kahneman) · Ankereffekt & Verfügbarkeitsheuristik · Bestätigungsfehler · Verlustaversion', [36, 41, 54]],
  [64, 'POL', 'EU, UNO, NATO, Völkerrecht', 'Europäische Union · Vereinte Nationen · NATO · Völkerrecht', [15, 57, 61]],
  [65, 'BIO', 'Gesundheit evidenzbasiert: Ernährung, Bewegung, Schlaf', 'Ernährung: was ist belegt? · Bewegung & Sport · Schlaf · Gesundheitsmythen & Hype erkennen', [12, 39, 54]],
  [66, 'GESCH', 'Deutschland nach 1945: Teilung, Wiedervereinigung', 'Besatzungszonen & Teilung · BRD & Wirtschaftswunder · DDR & Mauerbau · Friedliche Revolution & Wiedervereinigung', [57, 61, 47]],
  [67, 'WIRT', 'Konjunktur, BIP, Globalisierung & Handel', 'BIP & Wirtschaftswachstum · Konjunkturzyklen · Freihandel & komparativer Vorteil · Globalisierung', [28, 47]],
  [68, 'PHIL', 'Politische Philosophie: Hobbes, Locke, Rousseau, Marx', 'Hobbes: Leviathan · Locke: Naturrechte · Rousseau: Gesellschaftsvertrag · Marx: Klassenkampf', [40, 46, 52]],
  [69, 'MIX', 'Block 5', 'Gemischte Abfrage Block 5 · 20. Jahrhundert als Kette · Wissenschaft & Technik: Atom, Computer · Verknüpfungsfragen zwischen Bereichen', [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]],
  // Block 6
  [70, 'TECH', 'Internet & KI: wie sie funktionieren', 'Wie das Internet funktioniert · Web, Server & Verschlüsselung · Maschinelles Lernen · Neuronale Netze & Sprachmodelle', [4, 62]],
  [71, 'GEO', 'Wetter, Klima & Klimawandel sachlich', 'Wetter vs. Klima · Treibhauseffekt · Klimawandel: Ursachen & Belege · Folgen & Szenarien', [9, 27, 33]],
  [72, 'PHIL', 'Religionen II: Hinduismus, Buddhismus, chinesische Traditionen', 'Hinduismus · Buddhismus · Konfuzianismus & Daoismus · Weltreligionen im Vergleich', [14, 32]],
  [73, 'GESCH', 'Nicht-westliche Geschichte: China, Indien, Afrika, Amerikas', 'China: Dynastien bis Volksrepublik · Indien: Mogulreich bis Unabhängigkeit · Afrika: Reiche & Kolonialzeit · Amerikas: Maya, Azteken, Inka', [18, 35, 61, 72]],
  [74, 'PSY', 'Entwicklung & psychische Gesundheit (Bindung, Depression, Angst)', 'Bindungstheorie · Kindliche Entwicklung: Piaget · Depression · Angststörungen & Therapie', [55, 63]],
  [75, 'POL', 'Recht im Alltag: Verträge, Verbraucher, Miete, Arbeit', 'Vertragsrecht · Verbraucherrechte · Mietrecht · Arbeitsrecht', [15]],
  [76, 'KUL', 'Musik des 20. Jh. & Film', 'Jazz & Blues · Rock, Pop & elektronische Musik · Filmgeschichte · Filmsprache', [51, 60]],
  [77, 'GEO', 'Bevölkerung, Städte, Migration', 'Bevölkerungswachstum & demografischer Übergang · Urbanisierung & Megastädte · Migration: Ursachen & Folgen · Demografischer Wandel in Deutschland', [9, 67, 71]],
  [78, 'DENK', 'Denkmodelle: exponentielles Wachstum, Rückkopplung, Spieltheorie', 'Exponentielles Wachstum · Rückkopplung & Kipppunkte · Spieltheorie: Gefangenendilemma · Nash-Gleichgewicht & Kooperation', [25, 42, 71]],
  [79, 'TECH', 'Energieversorgung & Biotech (Erneuerbare, CRISPR, mRNA)', 'Erneuerbare Energien · Stromnetz & Speicher · CRISPR · mRNA-Technologie', [23, 27, 37, 53]],
  [80, 'WIRT', 'Persönliche Finanzen: Steuern, Sozialversicherung, ETFs', 'Steuern in Deutschland · Sozialversicherung · ETFs & Diversifikation · Zinseszins & Altersvorsorge', [28, 67]],
  [81, 'LIT', 'Weltliteratur II: Goethe, Dostojewski, Kafka, Orwell', 'Goethe: Faust · Dostojewski: Schuld und Sühne · Kafka: Die Verwandlung · Orwell: 1984', [48, 57, 59]],
  [82, 'MIX', 'Block 6', 'Gemischte Abfrage Block 6 · Gegenwart: Technik ↔ Klima ↔ Wirtschaft · Kulturen der Welt: Religion ↔ Geschichte · Verknüpfungsfragen zwischen Bereichen', [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]],
  // Block 7
  [83, 'POL', 'Geopolitik: Machtblöcke, Rohstoffe, aktuelle Konflikte', 'Machtblöcke & Weltordnung · Rohstoffe & Energie · Aktuelle Konflikte · Geografie als Machtfaktor', [9, 61, 64]],
  [84, 'PHY', 'Kosmos: Sonnensystem, Sterne, Urknall', 'Sonnensystem · Lebenszyklus der Sterne · Galaxien & dunkle Materie · Urknall', [8, 49, 58]],
  [85, 'PHIL', 'Moderne: Nietzsche, Existenzialismus, Sinnfragen', 'Nietzsche · Existenzialismus: Sartre · Camus & das Absurde · Sinnfragen heute', [46, 72]],
  [86, 'BIO', 'Gehirn, Bewusstsein & menschliche Evolution', 'Aufbau des Gehirns · Bewusstsein · Evolution des Menschen · Homo sapiens & seine Ausbreitung', [4, 10, 29]],
  [87, 'DENK', 'Medienkompetenz: Propaganda, Algorithmen, Desinformation', 'Propaganda · Algorithmen & Filterblasen · Desinformation erkennen · Faktencheck-Methoden', [57, 63, 70]],
  [88, 'LIT', 'Sprache: Sprachfamilien, Etymologie, Rhetorik', 'Indoeuropäische Sprachfamilie · Etymologie · Rhetorische Stilmittel · Ethos, Pathos, Logos', [20, 22, 26]],
  [89, 'GESCH', 'Muster der Geschichte: Warum steigen Reiche auf und fallen?', 'Aufstieg & Fall von Imperien · Geografie, Institutionen & Technik · Historische Zyklen · Lehren für heute', [24, 73, 83]],
  [90, 'MIX', 'Abschluss: alles auf einem Zeitstrahl („Big History“)', 'Urknall bis Entstehung des Lebens · Evolution des Menschen · Zivilisation bis heute · Alles auf einem Zeitstrahl', [7, 8, 84, 86]],
]

function blockOf(day: number): number {
  return BLOCKS.find((b) => day >= b.from && day <= b.to)!.id
}

export const DAYS: Day[] = RAW.map(([day, area, title, subs, links]) => ({
  day,
  phase: day <= 5 ? 1 : 2,
  block: blockOf(day),
  area,
  title,
  subtopics: subs.split(' · '),
  links,
  evidence: day > 5 && (area === 'BIO' || area === 'PSY'),
}))

export function getDay(n: number): Day {
  return DAYS[n - 1]
}

/** Block-MIX-Tage (17, 30, …) haben keine Videos, sondern fragen den ganzen Block ab. Tag 5 ist ein normaler Tag. */
export function isBlockMix(d: Day): boolean {
  return d.area === 'MIX' && d.phase === 2
}

export function youtubeSearch(query: string): string {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query)
}

/** Standard-Videos: pro Teilthema ein YouTube-Suchlink, alle als Pflicht (★) vorbelegt. */
const defaultsCache = new Map<number, Video[]>()

export function defaultVideos(d: Day): Video[] {
  let v = defaultsCache.get(d.day)
  if (!v) {
    v = buildDefaultVideos(d)
    defaultsCache.set(d.day, v)
  }
  return v
}

function buildDefaultVideos(d: Day): Video[] {
  if (isBlockMix(d)) return []
  return d.subtopics.map((s, i) => ({
    id: `${d.day}-${i}`,
    title: s,
    url: youtubeSearch(`${s} einfach erklärt`),
    star: true,
  }))
}
