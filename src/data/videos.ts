// Ausgewaehlte YouTube-Videos je Teilthema (Tag-Index → [Video-ID, Kanal]).
// Per Suche gefunden, von Hand ausgewaehlt und per oEmbed geprueft (existiert, einbettbar) am 2026-10-04.
// Bevorzugt: Studyflix, simpleclub, MrWissen2go/musstewissen, Terra X, Kurzgesagt, Sommers Weltliteratur.
// Keine KI-generierten Videos (Julius, 22.10.2026): neue Kanäle vorher über Storyboard/Kanalverlauf prüfen (RETIRED_VIDEOS).
export const VIDEO_PICKS: Record<string, [string, string]> = {
  '1-0': ['upePNQNNDPY', 'Studyflix'], // Zellorganellen und ihre Funktionen - einfach erklärt!
  '1-1': ['hu37M7pQa-M', 'Studyflix'], // Zellmembran - Aufbau und Funktion
  '1-2': ['XI0pIFX-1oM', 'Biologie - simpleclub'], // Transport durch die Zellmembran - Überblick
  '1-3': ['QsViPW2eu3k', 'Die Merkhilfe'], // Enzyme als Biokatalysatoren einfach erklärt - Was sind Enzyme? Enzymak
  '1-4': ['UY6aVS1fs64', 'TeacherToby'], // ATP [Adenosintriphosphat] - Aufbau, Synthese und Funktion [Biologie, O
  '2-0': ['szus13YZifE', 'Die Merkhilfe'], // Kohlenhydrate 1 - Aufbau, Strukturformeln & Ablauf Energieherstellung 
  '2-1': ['SSLIzJdNiR4', 'Die Merkhilfe'], // Fette einfach erklärt - Aufbau, Arten, Entstehung, Eigenschaften, Unte
  '2-2': ['pcJ_b_JP3J4', 'Die Merkhilfe'], // Proteine - Bau & Struktur einfach erklärt - Genetik & Stoffwechselbiol
  '2-3': ['csRIZZuIC0Q', 'musstewissen Chemie'], // Was sind Redoxreaktionen? I musstewissen Chemie
  '2-4': ['0odQLq6EJBc', 'musstewissen Chemie'], // Säuren und Basen I musstewissen Chemie
  '3-0': ['Hyn7GLGcsVg', 'Studyflix'], // Die Glykolyse - Zellatmung, Stoffabbau & Stoffwechsel | Studyflix
  '3-1': ['GAYZ0PMjsPc', 'Die Merkhilfe'], // Citratzyklus einfach erklärt - Ablauf, Phasen, Eigenschaften & Beispie
  '3-2': ['PqlViybXU80', 'Die Merkhilfe'], // Atmungskette einfach erklärt - Stoffwechsel - Oxidative Phosphorylieru
  '3-3': ['ATe_9OCMtlk', 'Biologie - simpleclub'], // Proteinbiosynthese - Komplette Zusammenfassung fürs Bio-Abi
  '3-4': ['jIvsO-Iorl0', 'Biologie - simpleclub'], // Genregulation bei Eukaryoten
  '4-0': ['prK8Hw0GCDg', 'Die Merkhilfe'], // Bau & Funktion von Nervenzellen - Nervensystem einfach erklärt - Neuro
  '4-1': ['lqq6lu3WouY', 'Biologie - simpleclub'], // Ruhepotential - Aktionspotential - einfach erklärt!
  '4-2': ['bmvUnIGyfoI', 'Biologie - simpleclub'], // Synapse - Reizübertragung
  '4-3': ['35Z1OSHdfeM', 'Biologie - simpleclub'], // Wie wirken Drogen?! 2 - Neurotransmittersysteme und Hormone
  '4-4': ['EbKOx6sriFc', 'Duden Learnattack'], // Blutzuckerspiegel: Hunger, Insulin und Diabetes – Biologie | Duden Lea
  '5-0': ['yzkVtesys5E', 'musstewissen Physik'], // Was ist Kraft? I musstewissen Physik
  '5-1': ['i7lM-E2H0o8', 'musstewissen Physik'], // Mechanische Leistung und Arbeit I musstewissen Physik
  '5-2': ['nek0lyV8D9o', 'Dinge Erklärt – Kurzgesagt'], // Das Immunsystem erklärt
  '5-3': ['jvJS8IyZvUc', 'MrWissen2go'], // Ganz einfach: Das politische System Deutschlands erklärt
  '5-4': ['7RMKwP_854M', 'Bundeszentrale für politische Bildung / bpb'], // Erst- und Zweitstimme
  '6-0': ['wapSqech8fE', 'Sprouts Deutschland'], // Das Multi-Store Modell: Wie Erinnerungen entstehen
  '6-1': ['otTSq-5PNsE', 'Jens-Peter Geuther'], // Die Vergessenskurve von Hermann Ebbinghaus
  '6-2': ['CPwn78QSdR4', 'Emanuel Reinhardt'], // Steigere deine Gedächtnisleistung - mit dieser Technik: Active Recall
  '6-3': ['AWTYfzxBwPg', 'Benjamin Keep, PhD, JD'], // Secrets of Interleaved Practice | How Learning Works
  '7-0': ['4LLH6TC0mjg', 'MrWissen2go Geschichte | Terra X'], // Die Steinzeit – Vom Faustkeil bis Stonehenge
  '7-1': ['DFpt2T7Xogw', 'Die Merkhilfe'], // Die Antike - Grundlagen, Antikes Griechenland, Antikes Rom & Merkmale 
  '7-2': ['1fFITnbOwE0', 'Geschichte - simpleclub'], // Beginn des Mittelalters - Das Mittelalter einfach erklärt
  '7-3': ['QRjH3bxsRao', 'MrWissen2go Geschichte | Terra X'], // Wie verlief die Industrielle Revolution? I musstewissen Geschichte
  '8-0': ['0xLbntOym1g', 'ObachtMathe'], // Zehnerpotenzen und wissenschaftliche Schreibweise | ganz einfach erklä
  '8-1': ['FkawLRu5cVc', 'Bleib neugierig — TED-Ed'], // Wie klein ist ein Atom? – Jonathan Bergmann
  '8-2': ['K9hfB2yUo4k', 'SONNENSEITE'], // Planeten, Sterne, Galaxien nach Größe geordnet
  '8-3': ['4pJur6H50y8', 'Terra X Lesch & Co'], // Wenn das Sonnensystem ein Fußballfeld wäre… | Harald Lesch
  '9-0': ['Fdk1MTR99Ko', 'Studyflix'], // Kontinente und Ozeane: Spannende Fakten - Studyflix
  '9-1': ['9Al8ZjPiqWg', 'Studyflix'], // Vegetationszonen & Klimazonen einfach erklärt!
  '9-2': ['OdUwzJLDE5Q', 'Teacher’s Best & Travel’s Best (by KressMax)'], // Wo liegt was? Städte, Flüsse, Gebirge, Wüsten weltweit (stumme Karte)
  '9-3': ['1Q76na-m8s0', 'Dinge Erklärt – Kurzgesagt'], // Überbevölkerung – Die Bevölkerungsexplosion erklärt
  '10-0': ['cKcfNtaTev8', 'Die Merkhilfe'], // Evolutionstheorie von Charles Darwin - Die Selektionstheorie | Evoluti
  '10-1': ['-8QHVtbDneU', 'Biologie - simpleclub'], // Mutation und Rekombination – Evolutionsfaktoren 1
  '10-2': ['PHDiWy-yrZQ', 'Biologie - simpleclub'], // Isolation & Artbildung - Evolutionsfaktoren 5
  '10-3': ['UhTwI-VLV2E', 'Biologie - simpleclub'], // Evolutionsbelege
  '11-0': ['byzNjqsTIsM', "Bensch erklärt's - Wirtschaft einfach verstehen"], // Opportunitätskosten
  '11-1': ['uWNHZgLeOB4', 'Wirtschaft - simpleclub'], // Angebot und Nachfrage
  '11-2': ['3oaAaid0XKA', 'Wirtschaft - simpleclub'], // Marktgleichgewicht
  '11-3': ['FBWJYH8DZ1g', 'Khan Academy'], // Introduction to price elasticity of demand | APⓇ Microeconomics | Khan
  '12-0': ['x0-yRHJmOkM', '3sat NANO'], // Wann Wissenschaft wahr ist – nach Karl Popper | Gert Scobel
  '12-1': ['3vMxWdJSodk', 'Pharmalogisch!'], // Placebokontrolliert, randomisiert und doppelblind
  '12-2': ['CLUiA2Id7KQ', 'shaussner'], // Von Expertenmeinung zu Meta-Analyse - Evidenzpyramide für die Politikw
  '12-3': ['SzO6b2XJHwA', 'Quarks Science Cops'], // Peer Review: Wie Wissenschaft sich vor Dummfug schützt
  '13-0': ['34yjxCKh_tM', 'immocentrum'], // Romanik & Gotik in der Architektur🏰⛲Übergang der Baustile-Lebendiges 
  '13-1': ['2JOsATFv7vY', 'Art Explained Simply & Quickly'], // How to Tell Renaissance, Baroque, and Rococo Apart in 5 Minutes
  '13-2': ['7kDmF17k15M', 'MiMa'], // Epochen der Kunst - Klassizismus, Romantik, Realismus
  '13-3': ['8I9DaMpNv68', 'Ars Vitae'], // Stil-Epochen - Moderne, Postmoderne und zeitgenössische Kunst (1945 bi
  '14-0': ['dMLoLNy89vw', 'PhilosophiePlus'], // PhiloBasics 2: Die 4 Grundfragen nach Kant und die Disziplinen der Phi
  '14-1': ['TmxNs931Z8I', 'Held des Wissens'], // Erkenntnistheorie - Wissenschaftstheorie - Epistemologie - Abitur Wiss
  '14-2': ['jQm4CT0XqC0', 'Samuel Jalalian'], // Ethik Abitur: Wichtige Grundbegriffe erklärt!
  '14-3': ['b3jaHlIOul4', 'PhrasenDrescher'], // 30 philosophische Strömungen in 13 Minuten
  '15-0': ['PmDVudkhk7Y', 'MrWissen2go Geschichte | Terra X'], // Das Grundgesetz erklärt | Geschichte
  '15-1': ['tYWQs7I7NCQ', 'Die Merkhilfe'], // Grundrechte im Grundgesetz - Grundrechte, Menschenrechte, Menschenwürd
  '15-2': ['__Wdzpu4OYI', 'Studyflix'], // Gewaltenteilung: Das Wichtigste! -- Studyflix
  '15-3': ['bpHAXzjWsvI', 'Politik - simpleclub'], // Das Bundesverfassungsgericht - einfach erklärt!
  '16-0': ['y_rXYqjCZTI', 'Simon Josef Eckert'], // Big Five: Die Persönlichkeitsfaktoren einfach erklärt (OCEAN Modell)
  '16-1': ['8HtnfA0nErw', 'Dinge Erklärt – Kurzgesagt'], // Was ist Intelligenz?
  '16-2': ['WC7PrWmB1_8', 'studybreak'], // Fluide Intelligenz, Kristalline Intelligenz | Wirtschaftsdidaktik
  '16-3': ['UrOpDurkvMk', 'Quarks'], // Zwillinge – Was sie über die Macht der Gene verraten | Quarks
  '18-0': ['dZjzF5M15BU', 'Jule Sommersberg'], // Neolithische Revolution
  '18-1': ['cx6cDSyaQPY', 'Einfach Antike'], // Der Codex Hammurabi | Das älteste Gesetzeswerk der Menschheitsgeschich
  '18-2': ['UXKvwL8Ox6k', 'MrWissen2go Geschichte | Terra X'], // Das Alte Ägypten: Hochkultur am Nil
  '18-3': ['0jQfYa1t518', 'Andere Geschichten'], // Die Induskultur - Eine rätselhafte Hochkultur (Doku Hörbuch)
  '19-0': ['WS8HrOgPFD0', 'musstewissen Physik'], // Newtonsche Gesetze I Trägheitsprinzip I Aktionsprinzip I musstewissen 
  '19-1': ['Jh__xKp-qlc', 'Lehrerschmidt'], // F = m * a | Kraft = Masse * Beschleunigung | Physik - Mechanik - einfa
  '19-2': ['UdxJl8G-ExQ', 'Physik - simpleclub'], // Keplersche Gesetze – Umlaufbahnen von Planeten
  '19-3': ['ZBmYAZ2oWB8', 'Physik - simpleclub'], // Impuls und Impulserhaltung – einfach erklärt
  '20-0': ['XdG0toKOGKs', 'MrWissen2go Geschichte | Terra X'], // Zeus, Hades und Co. – 7 Götter der griechischen Mythologie
  '20-1': ['Z-2YYI5Rwr8', 'Study History'], // Top 5 HELDEN aus der griechischen MYTHOLOGIE I Odysseus, Herakles und 
  '20-2': ['U3z0dpOPPqI', 'Terra X History'], // Die Wahrheit hinter dem Trojanischen Krieg | Terra X
  '20-3': ['U-ZaxHJvMOQ', 'ULF: Liebfrauenschule Vechta'], // Redewendungen aus der Mythologie der Antike - für heute erklärt II. Ho
  '21-0': ['fk7u95wnBFA', 'Einfach Antike'], // Die Polis im antiken Griechenland | Geschichte und Entwicklung – Einfa
  '21-1': ['pouqSrOt67A', 'Geschichte - simpleclub'], // Die Attische Demokratie unter Perikles - Antikes Griechenland
  '21-2': ['JtQu3rJ1Yso', 'MrWissen2go Geschichte | Terra X'], // Perserkriege einfach erklärt | Geschichte
  '21-3': ['MZCNNo2-T-Q', 'MrWissen2go Geschichte | Terra X'], // Alexander der Große I Geschichte
  '22-0': ['rur4haEjHQ0', 'Dr. Johannes Hartl'], // Philosophie to go 1: Die Vorsokratiker
  '22-1': ['CzqtmuUC8EU', 'David Johann Lensing'], // Die sokratische Methode · Platons Dialoge ft. Sokrates
  '22-2': ['Xco8thmkXbY', 'LitosoPHie'], // Ideenwelt, Höhlengleichnis, Staat | Platon | Einführung Philosophie
  '22-3': ['qPNcKBWcHBk', 'LitosoPHie'], // Wie man so richtig ruhig bleibt | Stoa & Stoizismus | Einführung Philo
  '23-0': ['dA-DBhuNB9o', 'Die Merkhilfe'], // Mendelsche Regeln - Zusammenfassung Abitur - 1., 2. & 3. Mendelsche Re
  '23-1': ['rYFS4kvMAVI', 'Studyflix'], // DNA Replikation einfach erklärt!
  '23-2': ['PHPYDBXv_PI', 'Die Merkhilfe'], // Mutationen - Definition, Entstehung, Arten, Folgen & Beispiele einfach
  '23-3': ['YCyQMwqhQLI', 'MEDBREAKER I MedAT'], // Vom Gen zum Merkmal - Molekulare Genetik | MedAT-Zusammenfassung der B
  '24-0': ['ilbPGRN1jFk', 'Geschichte - simpleclub'], // Rom wird Republik - Entwicklung zur Res Publica
  '24-1': ['VZoHYpuFVqY', 'MrWissen2go Geschichte | Terra X'], // Das Leben von Julius Cäsar
  '24-2': ['tbJmq010vH4', 'Study History'], // Kaiser Augustus I Beginn der Kaiserzeit in Rom
  '24-3': ['E-r2Ay3t1EE', 'MrWissen2go Geschichte | Terra X'], // Byzanz – Das vergessene Römische Reich
  '25-0': ['-rDGhSXByA8', 'musstewissen Mathe'], // Wahrscheinlichkeitsrechnung I musstewissen Mathe
  '25-1': ['ELNt0XZYsAQ', 'The Winton Centre'], // Relative vs Absolute risks: Why Relative Risks Are Misleading, and How
  '25-2': ['crqxAtxpnJk', 'sofatutor'], // Prozentpunkte vs. Prozent: Was sind Prozentpunkte?
  '25-3': ['AMn9loX6w4s', 'Mathe - simpleclub'], // Erwartungswert
  '26-0': ['P9BxBKx8hlM', 'BibleProject - Deutsch'], // Buchvideo: Genesis (1. Mose) • Kap. 1-11
  '26-1': ['akYJfbuJLgQ', 'Sommers Weltliteratur to go'], // Das zweite Buch Mose to go (Exodus in 10,5 Minuten)
  '26-2': ['GTbHkZRtdWY', 'BibleProject - Deutsch'], // Wie man die Bibel liest: Die Gleichnisse von Jesus
  '26-3': ['RUyWw6X7uvc', 'Propstei St. Marien'], // Das sagt man so... Redewendungen aus der Bibel - Tohuwabohu
  '27-0': ['pe0Z7V--_rU', 'Physik - simpleclub'], // Energieformen - Überblick REMAKE
  '27-1': ['_Dk6ek7UAYU', 'StudyHelpTV'], // Der Unterschied von Wärme und Temperatur [Thermodynamik] |StudyHelp
  '27-2': ['hoLT1UZPNtM', 'studybreak'], // Hauptsätze der Thermodynamik, Energieerhaltungssatz, Entropiesatz | En
  '27-3': ['VWP-MLjxAnU', 'Physik - simpleclub'], // Entropie einfach erklärt – Die Basics
  '28-0': ['u1Tn3gB5HeE', "Bensch erklärt's - Wirtschaft einfach verstehen"], // Geld 1 Funktionen des Geldes
  '28-1': ['iYx75vVnzmo', 'Wirtschaft - simpleclub'], // Inflation und Deflation einfach erklärt - Grundbegriffe
  '28-2': ['kyYguppNaqE', 'Finanzfluss'], // Reich durch Zinseszins? Zinseszinseffekt einfach erklärt! | Finanzflus
  '28-3': ['MPjPwk1DKm4', 'Finanzfluss'], // Was ist die EZB und was sind ihre geldpolitischen Instrumente? EZB ein
  '29-0': ['PS36mqahb2Q', 'sofatutor'], // Erdzeitalter – Entwicklung des Lebens einfach erklärt – Biologie 9. & 
  '29-1': ['otZPDl7kP90', 'Geographie - simpleclub'], // Schalenbau der Erde
  '29-2': ['JGytK6UiQE0', 'Studyflix'], // Plattentektonik: Das musst du wissen! - Studyflix
  '29-3': ['YUXZVAQ1iJ4', 'Geographie - simpleclub'], // Vulkane und Vulkanausbruch: Vulkan Grundlagen einfach erklärt - Platte
  '31-0': ['rf5PF77Rx68', 'MrWissen2go Geschichte | Terra X'], // Karl der Große: Der Vater Europas?
  '31-1': ['biNXjHIM_mk', 'Geschichte - simpleclub'], // Lehenswesen, Grundherrschaft und Feudalismus - Mittelalter einfach erk
  '31-2': ['2MoLDZ30TaM', 'MrWissen2go Geschichte | Terra X'], // Kirche im Mittelalter I Geschichte
  '31-3': ['rUW-TJorCn4', 'MrWissen2go Geschichte | Terra X'], // Kreuzzüge im Mittelalter
  '32-0': ['NeZ8z7YiJdU', 'MrWissen2go'], // Judentum erklärt | Eine Religion in (fast) fünf Minuten
  '32-1': ['10mdxRtpqUQ', 'MrWissen2go'], // Christentum erklärt | Eine Religion in (fast) fünf Minuten
  '32-2': ['ESLa3YT1nps', 'MrWissen2go'], // Islam erklärt | Eine Religion in (fast) fünf Minuten
  '32-3': ['oy5_QqCcdeo', '3ALOG - TRIALOG - DIALOGPLATTFORM RELIGION & KULTUR'], // Abraham im Judentum, Christentum & Islam - Prof. Dr. Karl-Josef Kusche
  '33-0': ['wGVgIcTpZkk', 'Bozeman Science'], // The Three Domains of Life
  '33-1': ['e1Tp0-2jrDA', 'Studyflix'], // Nahrungskette - Nahrungsnetz, Trophieebenen, Ökologie | Studyflix
  '33-2': ['oaPVSX3MLCk', 'Biologie - simpleclub'], // Stoffkreisläufe und Energiefluss - Ökologie
  '33-3': ['jOM76F1w-A4', 'Bleib neugierig — TED-Ed'], // Warum ist Artenvielfalt so wichtig? – Kim Preshoff
  '34-0': ['r-SkoWkv5g4', 'Architektur Erklärt | Architectural History'], // Die 3 klassischen griechischen Säulenordnungen | Architektur Erklärt
  '34-1': ['S3gJgRCwPIs', 'Die Klugscheisserin'], // So erkennst Du, ob ein Bauwerk zur Romanik, Gotik oder Renaissance geh
  '34-2': ['2JOsATFv7vY', 'Art Explained Simply & Quickly'], // How to Tell Renaissance, Baroque, and Rococo Apart in 5 Minutes
  '34-3': ['XjvM7Ru6oU8', 'ARTEde'], // Das Bauhaus - 100 Jahre Designrevolution | Karambolage | ARTE
  '35-0': ['3OnTUTuqC_4', 'MrWissen2go Geschichte | Terra X'], // Renaissance und Humanismus I musstewissen Geschichte
  '35-1': ['v04-wcKE3Pk', 'MrWissen2go Geschichte | Terra X'], // Johannes Gutenberg - Erfinder des Buchdrucks? Geschichte einfach erklä
  '35-2': ['At3W6lniGNE', 'MrWissen2go Geschichte | Terra X'], // Martin Luther und die Reformation I musstewissen Geschichte
  '35-3': ['gWxNW0FiA34', 'evulpo auf deutsch'], // Entdeckungsfahrten: Ursachen und Folgen
  '36-0': ['sDG5YLbCvU8', 'shribe! - master your studies'], // Induktion und Deduktion mit Beispielen erklärt (Superschnelles 5-Minut
  '36-1': ['_9zk69MSitA', 'BiasedSkeptic'], // Syllogismus und logische Gültigkeit erklärt
  '36-2': ['LdAupXWxHjQ', 'BiasedSkeptic'], // Bitte nicht! Logische FEHLSCHLÜSSE erklärt (Top 10)
  '36-3': ['kg54IX7j3DY', 'ExActa'], // Kurz geklärt: Dammbruchargument
  '37-0': ['irh9kFv68sA', 'Physik - simpleclub'], // Stromstärke & Spannung Grundlagen - REMAKE
  '37-1': ['xklPZ1tzNTc', 'Physik - simpleclub'], // Ohm'sches Gesetz & Widerstände - REMAKE
  '37-2': ['aX7PibaLlm0', 'DerElektroniker'], // Wie Strom zum Magnet wird | Elektromagnetismus
  '37-3': ['ndWHtyu4KDs', 'Physik - simpleclub'], // Induktion – Komplette Zusammenfassung fürs Physik-Abi
  '38-0': ['d-EMelciDgg', 'Mrs K'], // Philosophie- Rationalismus nach René Descartes
  '38-1': ['Ahwx9D4KoO8', 'Professor Dave Explains'], // Empiricism Part 2: Locke, Hume, and Voltaire
  '38-2': ['5K5S222Fnys', 'Grundkurs Philosophie'], // in 4 Minuten erklärt: Kants Erkenntnistheorie
  '38-3': ['q_K-BtJ_taY', 'gap: Die Gesellschaft für Analytische Philosophie'], // #Kurz: Gettierfälle und die Frage: Was ist Wissen? (Erkenntnistheorie)
  '39-0': ['ld373__bv2M', 'Biologie - simpleclub'], // Das Herz und sein Kreislaufsystem
  '39-1': ['5WISgbDwtIY', 'B.B. Rossa'], // Einfach erklärt: Der Gasaustausch (äußere und innere Atmung)
  '39-2': ['gcP0AiMDjes', 'Biologie - simpleclub'], // Die Verdauung des Menschen
  '39-3': ['C_PZjyFHAY8', 'Biologie - simpleclub'], // Die Niere 1 – Organe des Menschen
  '40-0': ['F3i6D2bON4A', 'MrWissen2go Geschichte | Terra X'], // Die Aufklärung I Das Zeitalter der Vernunft I musstewissen Geschichte
  '40-1': ['18a2rbqOGz0', 'Die Merkhilfe'], // Amerikanische Revolution & Gründung der USA (Vereinigte Staaten von Am
  '40-2': ['_WtUXie0WhU', 'EinfachSchule'], // Französische Revolution kompakt erklärt - Zusammenfassung der Französi
  '40-3': ['s1pVCj6qa_U', 'MrWissen2go Geschichte | Terra X'], // Napoleons Herrschaft I Die Umgestaltung Europas I musstewissen Geschic
  '41-0': ['I40g6U3K7hc', 'Quarks'], // Das Asch-Experiment: So manipuliert uns die Gruppe | Quarks
  '41-1': ['vuMt8b4UrcI', 'Sprouts'], // The Milgram Experiment: Obedience to Authority
  '41-2': ['4zGy0v9vBLg', 'Sozialpsychologie mit Prof. Erb'], // Gruppendenken / Group Think | Sozialpsychologie mit Prof. Erb
  '41-3': ['i8xLXXpOkx0', 'Sozialpsychologie mit Prof. Erb'], // Was sind Einstellungen? | Sozialpsychologie mit Prof. Erb
  '42-0': ['qhwXOmcbTJs', 'Die Merkhilfe Wirtschaft'], // Externe Effekte & Verursacherprinzip einfach erklärt - Positiver & neg
  '42-1': ['IoEf9dXbkbI', 'Die Merkhilfe'], // Was ist Marktversagen? Marktversagen bei der Bereitstellung öffentlich
  '42-2': ['Fn_WfjImlcs', 'Die Merkhilfe Wirtschaft'], // Marktformen & Marktarten - Monopol, Oligopol und Polypol einfach erklä
  '42-3': ['WEwRUmMRYsI', 'Wirtschaft - simpleclub'], // Lemons Modell - Asymmetrische Informationen & Gebrauchtwagen
  '44-0': ['mvNcgWrbBMo', 'Geschichte - simpleclub'], // Industrialisierung / Industriellen Revolution: England als Mutterland 
  '44-1': ['O875yPaT4WI', 'MrWissen2go Geschichte | Terra X'], // Was war die "Soziale Frage"? I musstewissen Geschichte
  '44-2': ['oDRlSBtoaEY', 'Geschichte lernen leicht gemacht'], // Nationalismus Überblick - Definition, Ursprung und Auswirkung
  '44-3': ['gdJWH10sAZ8', 'STARK Verlag'], // Die Reichseinigung 1864 – 1871 | STARK erklärt
  '45-0': ['9dgHhsqsVyw', 'Terra X History'], // 15. Jahrhundert – Die Buchdruck-Revolution – wie Gutenberg die Welt ve
  '45-1': ['ArvQYJwd6jE', 'Physik - simpleclub'], // Wie funktioniert die Dampfmaschine?
  '45-2': ['eRT9gVjkiPA', 'EINFACH GESCHICHTE'], // Es werde Licht! - Die Erfindung der Glühbirne I DIE INDUSTRIELLE REVOL
  '45-3': ['hw4_nnMXxPY', 'Histoclips'], // 1928 - Die Jahrhundertmedizin
  '46-0': ['GmbhVxUVrGI', 'LetsDenk'], // Utilitarismus nach Bentham & Mill einfach erklärt [Ethik] - Let's Expl
  '46-1': ['6DtchCPwpHI', 'PhiloGramm'], // Die Pflichtethik von Immanuel Kant
  '46-2': ['K7Z9Rk2RHfs', 'David Johann Lensing'], // Tugendethik bei Aristoteles · Eudämonie als Ziel
  '46-3': ['RmX1aHAQ3_M', 'Elena Sammt'], // Das Trolleyproblem- ein ethisches Dilemma
  '47-0': ['2Gm3buxyjhw', 'Wirtschaft - simpleclub'], // Kapitalismus - Einfach erklärt
  '47-1': ['pQNR0cgd5bg', 'MrWissen2go'], // Kommunismus & Sozialismus erklärt
  '47-2': ['0mW0uB540lo', 'MrWissen2go Geschichte | Terra X'], // Soziale Marktwirtschaft: Die Jahrhundert-Idee?
  '47-3': ['FGo5z4ONI9Y', 'Die Merkhilfe Wirtschaft'], // Freie Marktwirtschaft & Planwirtschaft / Zentralverwaltungswirtschaft 
  '48-0': ['9EtEGppUmS0', 'Sommers Weltliteratur to go'], // Barock to go (Die literarische Epoche in 5 Minuten)
  '48-1': ['zqcpgKm-xRY', 'Sommers Weltliteratur to go'], // Sturm und Drang to go (Die literarische Epoche in 4,5 Minuten)
  '48-2': ['3clVZ0b2x8M', 'MrWissen2go Geschichte | Terra X'], // Goethe, Schiller und die „Weimarer Klassik“
  '48-3': ['XhLqSlT5tmw', 'Sommers Weltliteratur to go'], // Realismus to go (Die literarische Epoche in 7 Minuten)
  '49-0': ['EFzR5GUEI6k', 'Physik - simpleclub'], // Wellen - Zusammenfassung fürs Physik-Abi
  '49-1': ['Ufirf8BSrWY', 'Studytiger - Physik & E-Technik'], // Der Welle-Teilchen-Dualismus | (Licht & Elektronen)
  '49-2': ['CRee28w7PGY', 'Terra X Lesch & Co'], // Die Relativitätstheorie für Einsteiger
  '49-3': ['tMccjyUf76o', 'Physik - simpleclub'], // Allgemeine Relativitätstheorie
  '50-0': ['XdBi2y7PBiM', 'MrWissen2go Geschichte | Terra X'], // Imperialismus einfach erklärt
  '50-1': ['6cNl2yA5D0M', 'evulpo auf deutsch'], // Der Weg in den 1. Weltkrieg: Bündnispolitik und Julikrise
  '50-2': ['9CI-vZlnPwo', 'MrWissen2go Geschichte | Terra X'], // Erster Weltkrieg I Fakten und Verlauf I musstewissen Geschichte
  '50-3': ['wxUVrkbu0_o', 'MrWissen2go Geschichte | Terra X'], // Versailler Vertrag I musstewissen Geschichte
  '51-0': ['x7OEZc_DOFs', 'Musik mit Matthias'], // Epochen der Musikgeschichte: Barock
  '51-1': ['8dTPwJOjy54', 'A.G.Pillwhite'], // Mozart, Beethoven, Haydn - Komponisten in der Wiener Klassik schnell u
  '51-2': ['gUNI79hwyuI', 'Musik mit Matthias'], // Epochen des Musikgeschichte: Romantik
  '51-3': ['jigomONn2OI', 'selbstorientiert'], // Die Sinfonie einfach erklärt - Beethoven & Definition - Begriff Sinfon
  '52-0': ['RProbwdCt7s', 'Wirtschaft - Animiert Kapiert'], // Der Liberalismus - Politische Ideologie - einfach erklärt
  '52-1': ['bGJHLIbV1Dw', 'Milchschaum Politik'], // Konservatismus - politische Grundrichtung / Grundströmung
  '52-2': ['bmhVLGWszQc', 'MrWissen2go Geschichte | Terra X'], // Kommunismus, Sozialismus und Bolschewismus | Geschichte
  '52-3': ['ggync-m0WIo', 'Wirtschaft - Animiert Kapiert'], // Nationalismus Definition und Geschichte - einfach erklärt
  '53-0': ['QhcPiAUgluA', 'Biologie - simpleclub'], // Unspezifische Immunabwehr - Immunsystem
  '53-1': ['66uBrb7rH1A', 'Biologie - simpleclub'], // Spezifische Immunabwehr 1 - Immunsystem
  '53-2': ['ZBNiDYGXK_o', 'Biologie - simpleclub'], // Wie funktionieren Impfungen? Aktive und passive Immunisierung
  '53-3': ['UCv8QEKwXts', 'Doktor Whatson'], // Warum Antibiotika-Resistenzen so gefährlich sind (und was wir dagegen 
  '54-0': ['MFMS8P-Flig', 'MAITHINK X'], // Beyoncé macht dumm | Korrelation vs. Kausalität
  '54-1': ['ae09T8o3CLI', 'Cochrane Austria'], // Confounding, Zufallsfehler und Bias: Häufige Fehlerquellen in Studien
  '54-2': ['gSyGVDMcg-U', 'Benedict'], // p-Wert, Nullhypothese, Signifikanzniveau - die Idee erklärt
  '54-3': ['wUDxQFbXqjA', 'Mathe by Daniel Jung'], // Satz von Bayes | Bedingte Wahrscheinlichkeit | Mathe by Daniel Jung
  '55-0': ['_59YUlIQhhM', 'Learning the Social Sciences'], // Theories of Emotion: James-Lange, Cannon-Bard, and Schachter Two Facto
  '55-1': ['TXpicIL2jIE', 'Chemie und Bio in der Schule'], // Die Stressreaktion - Ein Zusammenspiel von Hormon- und Nervensystem
  '55-2': ['faW6ZQg1tn4', 'Sozialpsychologie mit Prof. Erb'], // Intrinsische und extrinsische Motivation | Psychologie mit Prof. Erb
  '55-3': ['9VEH-DKh2ZM', 'Biologie - simpleclub'], // Wie wirken Drogen?! 3 – Das körpereigene Belohnungssystem
  '57-0': ['WHVN93ry7LQ', 'Studyflix'], // Weimarer Republik: Das Wichtigste! - Studyflix
  '57-1': ['RPCS-cJMCDk', 'MrWissen2go Geschichte | Terra X'], // Adolf Hitlers Aufstieg: Vom „Niemand" zum Diktator
  '57-2': ['pFo2kXMqa98', 'MrWissen2go Geschichte | Terra X'], // Der Holocaust: Völkermord an den europäischen Juden
  '57-3': ['ihKFqag1QgA', 'Terra X History'], // 10 Fakten, die man über den Zweiten Weltkrieg wissen muss | MrWissen2g
  '58-0': ['vBXaINQwpZ0', 'Chemie - simpleclub'], // Welche Atommodelle gibt es?! - Teil 1
  '58-1': ['bbjGzpHTKXs', 'Chemie - simpleclub'], // Was ist das Periodensystem?!
  '58-2': ['tbU9ZOu7-0k', 'Breaking Lab'], // Quantenphysik einfach erklärt! Atom, Orbital, Spektrum, Elektronen | P
  '58-3': ['fdHIyJxzqek', 'GRS | Deutschland'], // Was passiert eigentlich bei Kernspaltung und Kernfusion?
  '59-0': ['h-4VDgm5cdY', 'Klassiker der Weltliteratur'], // Klassiker der Weltliteratur: Homer - Ilias und Odyssee | BR-alpha
  '59-1': ['S31ZeJz8Uh4', 'Sommers Weltliteratur to go'], // Die Göttliche Komödie to go (Dante in 13,5 Minuten)
  '59-2': ['AMMlTvGX7Y8', 'Englisch - simpleclub'], // Shakespeare - Person
  '59-3': ['rTtNNy3BHgE', 'Sommers Weltliteratur to go'], // Don Quijote to go (Cervantes in 13,75 Minuten)
  '60-0': ['Wkmp4FdoM3c', 'selbstorientiert'], // Merkmale des Impressionismus einfach erklärt - Malerei mit lockeren Fa
  '60-1': ['qy0TotelNZA', 'ZeigMal!'], // Was ist... der Kubismus?
  '60-2': ['MtK3WYZwazI', 'Lars Reimers'], // Surrealismus, Dali, Magritte, Ernst
  '60-3': ['M_zbc3qa160', 'ZeigMal!'], // Warhol und die Pop Art: "32 Campbell's Soup Cans"
  '61-0': ['7OOrhIm_PVQ', 'EINFACH GESCHICHTE'], // Der Eiserne Vorhang und die Teilung Deutschlands I DER KALTE KRIEG
  '61-1': ['fvKJ1rbR4ig', 'EINFACH GESCHICHTE'], // Die Kubakrise und Spionage im Kalten Krieg I DER KALTE KRIEG
  '61-2': ['zI7FywIDv6s', 'MrWissen2go Geschichte | Terra X'], // Blutiger Kampf: So endete die Kolonialzeit in Afrika
  '61-3': ['i52NTWGqoP4', 'MrWissen2go Geschichte | Terra X'], // Von Gorbatschow zu Putin: So zerfällt die Sowjetunion
  '62-0': ['0Exik_Q3kDk', 'Informatik - simpleclub'], // Bits und Bytes: Binärziffern 0 und 1 - Arithmetik in Computern 1
  '62-1': ['Rtgro8pqtMQ', 'Informatik und Mathematik by Dr. Gebhardt'], // Logikgatter (Digitaltechnik)
  '62-2': ['jojp0h2YoSU', 'Studyflix'], // Von Neumann Architektur - Grundlagen des Rechners einfach erklärt
  '62-3': ['oqNdaESodPM', 'erklaerung-und-mehr'], // Digitale Grundlagen: Algorithmen und Programmiersprachen einfach und k
  '63-0': ['3xUNKyFkc8Y', 'Büchercheck'], // "Schnelles Denken, langsames Denken" von Daniel Kahneman | Zusammenfas
  '63-1': ['B5yYOf9siYc', 'Sozialpsychologie mit Prof. Erb'], // Was ist die Verfügbarkeitsheuristik? | Sozialpsychologie mit Prof. Erb
  '63-2': ['cDrlN_ZK0R0', 'Brotcrunsher'], // Kognitive Verzerrung [003] - Confirmation Bias / Bestätigungsfehler
  '63-3': ['hgq3zAVqj08', 'Finanztip'], // Verlustaversion: Warum wir bei Verlusten Fehler machen
  '64-0': ['BsacPL1BZ-8', 'MrWissen2go'], // Die Europäische Union (EU) erklärt | wissen2go
  '64-1': ['HspzFX9v8es', 'MrWissen2go Geschichte | Terra X'], // Die Geschichte der Vereinten Nationen (UNO)
  '64-2': ['FHvP4RKLUp4', 'MrWissen2go'], // Warum es die Nato gibt
  '64-3': ['YPaxm96OhMI', 'Wirtschaft - Animiert Kapiert'], // Das Völkerrecht Definition und Bereiche - einfach erklärt
  '65-0': ['y5PKU3X4TUo', 'Quarks'], // Gesund essen? Die Wahrheit über die Ernährungsempfehlungen der DGE | Q
  '65-1': ['Tm0f5iXMeso', 'Quarks'], // Wundermittel Sport: Körper, Geist und Gene profitieren von Bewegung | 
  '65-2': ['sdH-fEEh1uY', 'Quarks'], // Mehr als lebenswichtig: Darum schlafen wir! | Quarks
  '65-3': ['BFmsurpE-Ho', 'MAITHINK X'], // Das Problem mit wissenschaftlichen Studien
  '66-0': ['KX8WrWKqbHE', 'MrWissen2go Geschichte | Terra X'], // Die deutsche Teilung: Das müsst ihr wissen
  '66-1': ['3AqefdDzAAM', 'MrWissen2go Geschichte | Terra X'], // Gründung der Bundesrepublik und Wirtschaftswunder | Geschichte
  '66-2': ['OhV0wje9I64', 'Terra X History'], // Faktencheck Mauerbau | Terra X
  '66-3': ['Tim1mrdHu2M', 'WDR'], // Der Mauerfall: Die friedliche Revolution in der DDR | neuneinhalb | WD
  '67-0': ['2y5o7XlDXok', 'Wirtschaft - simpleclub'], // Bruttoinlandsprodukt - Was ist das BIP? - Grundelemente der Makroökono
  '67-1': ['swuRWQgXm8g', 'explainity ® Erklärvideos'], // Konjunkturzyklen einfach erklärt (explainity® Erklärvideo)
  '67-2': ['cfUaDTmlN8E', 'wirtconomy'], // Absoluter und komparativer Kostenvorteil | einfach erklärt | Beispiela
  '67-3': ['ckMkxCwAC2U', 'Die Merkhilfe'], // Globalisierung - einfach erklärt! – Was ist Globalisierung? Chancen un
  '68-0': ['-C1sotCbYvE', 'LitosoPHie'], // Naturzustand & Gesellschaftsvertrag - Thomas Hobbes erklärt - Leviatha
  '68-1': ['FrjigGPCR6Q', 'Study History'], // Hobbes und Locke im Vergleich I Menschenbild und Entstehung eines Staa
  '68-2': ['pBXMLIINXys', 'LitosoPHie'], // Jean-Jacques Rousseau erklärt: Gesellschaftsvertrag & Naturzustand | E
  '68-3': ['fvtq8zyYpqs', 'Terra X History'], // Karl Marx und das Kommunistische Manifest
  '70-0': ['fpqhjEtznVk', 'Bibliothek der Sachgeschichten'], // Wie funktioniert das Internet?
  '70-1': ['tW1-CmggG9s', 'alexanderlehmann'], // Sicher Surfen mit HTTPS - Einfach Erklärt! - 2/5
  '70-2': ['fczMeARAKps', 'datasolut'], // Was ist Machine Learning? Maschinelles Lernen einfach erklärt!
  '70-3': ['1fQrOek4buQ', "c't uplink"], // So funktionieren neuronale Netze | KI-Basics
  '71-0': ['TxuFxwa9ARg', 'Geographie - simpleclub'], // Was ist Klima? Was ist Wetter? Unterschied - Klima & Wetter Grundlagen
  '71-1': ['p0eHqybWwlA', 'Studyflix'], // Treibhauseffekt einfach erklärt -- Studyflix
  '71-2': ['aTlNdiUqa3c', 'klima:neutral'], // Menschengemachter Klimawandel: Behauptungen vs. Fakten
  '71-3': ['al32DJko3h8', 'BR24'], // 2071: Welche Folgen hat der Klimawandel wirklich auf unser Leben? | Di
  '72-0': ['hDonVDFwpwg', 'MrWissen2go'], // Hinduismus erklärt | Eine Religion in (fast) fünf Minuten
  '72-1': ['TN_ROjzbtUo', 'MrWissen2go'], // Buddhismus erklärt | Eine Religion in (fast) fünf Minuten
  '72-2': ['zFJjUsV4wvg', 'EINFACH GESCHICHTE'], // Die Drei Lehren - Buddhismus, Daoismus und Konfuzianismus l DIE GESCHI
  '72-3': ['qNFPsm8ZhIY', 'Bleib neugierig — TED-Ed'], // Die fünf Weltreligionen – John Bellaimey
  '73-0': ['-jIBp-dBSxA', 'MrWissen2go Geschichte | Terra X'], // China: Geschichte eines Riesenreichs
  '73-1': ['Whj8-WMnAw8', 'MrWissen2go Geschichte | Terra X'], // Mahatma Gandhi: Indiens großer Freiheitskämpfer?
  '73-2': ['zI7FywIDv6s', 'MrWissen2go Geschichte | Terra X'], // Blutiger Kampf: So endete die Kolonialzeit in Afrika
  '73-3': ['lXNS_pLFkdk', 'MrWissen2go Geschichte | Terra X'], // Maya, Inka & Azteken: die Geschichte der Hochkulturen Amerikas
  '74-0': ['wStZIrFuOvU', 'Sprouts Deutschland'], // Bindungstheorie - Wie Deine Kindheit Dein Leben Beeinflusst
  '74-1': ['yxQM6vUXEJI', 'Sprouts Deutschland'], // Piagets Theorie der kognitiven Entwicklung
  '74-2': ['G4DVxsq6JSE', 'MrWissen2go'], // Depression.
  '74-3': ['owT5_vFOZYI', 'AOK – Mental Gesund'], // Angststörung einfach erklärt: Ursachen, Symptome und Hilfe
  '75-0': ['gPManz0Ke1o', 'Die Merkhilfe Wirtschaft'], // Was ist ein Vertrag? Angebot & Annahme einfach erklärt - Vertragsbesta
  '75-1': ['VnQ97-L0BZ8', 'Die Merkhilfe Wirtschaft'], // Gewährleistungsrechte - Rechte des Käufers einfach erklärt - Beschaffu
  '75-2': ['rpfZ2GR3Vps', 'Marvin McKay - Winkeladvokat'], // Mietrecht: 10 wichtige Rechte des Mieters | Was Du als Mieter darfst |
  '75-3': ['-EF-xhmQkYI', 'Mission Bachelor'], // Arbeitsrecht | Individuelles und kollektives Arbeitsrecht einfach erkl
  '76-0': ['lWsp-mVgiZY', 'erklaerung-und-mehr'], // Geschichte des Jazz
  '76-1': ['6yMDrOez4Yw', 'Arte TRACKS'], // Wie Techno aus Detroit Berlin erobert hat (Vintage 2018)
  '76-2': ['FXRR4KNyBE0', 'Cman1337'], // 5 Minuten Filmgeschichte | 1880 - 2020
  '76-3': ['okmFIimKq2w', 'outdoortrainer'], // Kleine Filmschule - Teil 1 - Elemente der Filmsprache
  '77-0': ['obExlY4s3qI', 'Geographie - simpleclub'], // Demographischer Übergang - Modell einfach erklärt - Demographie 3
  '77-1': ['rTrNSrx2OT8', 'Studyflix'], // Urbanisierung: einfach erklärt -- Studyflix
  '77-2': ['PsOhYH-uErM', 'Geographie - simpleclub'], // Migration
  '77-3': ['dPZ17WUXwWI', 'Wirtschaft - simpleclub'], // Demografischer Wandel – Grundbegriffe der Wirtschaft
  '78-0': ['F81V7apquBM', 'Studyflix'], // EXPONENTIELLES WACHSTUM | Erklärung + Formel mit anschaulichem Beispie
  '78-1': ['W9Bd03YVVnA', 'Republik Magazin'], // Was sind eigentlich Kipppunkte? Klimaforscher Stefan Rahmstorf erklärt
  '78-2': ['RiLytA_cHtY', 'Studyflix'], // Spieltheorie - Das Gefangenendilemma mit Beispiel erklärt!
  '78-3': ['0Ttb606HfTU', 'Wirtschaft - simpleclub'], // Nash-Gleichgewicht (in reinen Strategien) einfach erklärt
  '79-0': ['BDcFTvHyVLk', 'Die Merkhilfe'], // Erneuerbare Energien - Primärenergiequellen, Potenzial & Probleme / Na
  '79-1': ['szJQ5Pf9Aus', 'Agentur für Erneuerbare Energien e. V.'], // Wie funktioniert das Stromnetz heute und in Zukunft?
  '79-2': ['ZAz1GutJGbg', 'Dinge Erklärt – Kurzgesagt'], // CRISPR - Gentechnik wird alles für immer verändern
  '79-3': ['dO2eSeePwRI', 'Open Science - Lebenswissenschaften im Dialog'], // SARS-CoV-2: Corona-Impfstoffe im Vergleich (mRNA und Vektor)
  '80-0': ['ghJhy40yCfM', 'explainity ® Erklärvideos'], // Steuern in Deutschland einfach erklärt (explainity® Erklärvideo)
  '80-1': ['fhm7oxpeFP0', 'MrWissen2go'], // Wohin geht unser Geld? - Sozialversicherung & Co. erklärt
  '80-2': ['wCTCXoZNsHE', 'Finanzfluss'], // ETF Erklärung: Was sind ETFs? In nur 4 Minuten erklärt! | Finanzlexiko
  '80-3': ['jcLOAzwF_Ns', 'Finanztip'], // Wie Inflation und Zinseszins zusammenhängen | Basics der Altersvorsorg
  '81-0': ['JIUElsdwBqQ', 'Sommers Weltliteratur to go'], // Faust I to go & #MeinSenf (Goethe in 11,75 Minuten, Fassung 3.0)
  '81-1': ['llyJMT6OIME', 'Sommers Weltliteratur to go'], // Schuld und Sühne to go (Dostojewski in 12 Minuten)
  '81-2': ['wipzxqzDclA', 'Sommers Weltliteratur to go'], // Die Verwandlung to go (Kafka in 11 Minuten)
  '81-3': ['SanejsIrgSc', 'Sommers Weltliteratur to go'], // 1984 to go (Orwell in 12,5 Minuten)
  '83-0': ['IhFuFcl20_A', 'Politik.Macht.Geld!'], // Carlo Masala erklärt wie sich die neue Weltordnung herausbilden wird
  '83-1': ['9EtLWnQiy40', 'ARTEde'], // Erdgas und Erdöl: Regieren Rohstoffe die Welt? | Mit offenen Karten | 
  '83-2': ['IAD_fVFE6y8', 'MrWissen2go Geschichte | Terra X'], // Die Konflikte im Nahen Osten erklärt
  '83-3': ['IwiqwXjB2RM', 'Tim Marshall'], // Tim Marshall talks about Prisoners of Geography (German, 3sat)
  '84-0': ['bHM-PSA8SMc', 'Physik - simpleclub'], // Das Sonnensystem – Unsere Heimat
  '84-1': ['BzlHLd1-7qk', 'Quarks'], // Wie die Sonne entstanden ist – und wie sie sterben wird | Quarks
  '84-2': ['jbNSeTxUvvw', 'Breaking Lab'], // Dunkle Materie: Woraus besteht unser Universum wirklich?
  '84-3': ['LWUhJftQfvk', 'Quarks'], // Der Urknall: Endlich verstehen, wie alles anfing | Quarks
  '85-0': ['9LrNFUuvU7g', 'MDR DOK'], // Nietzsche erklärt | Promis der Geschichte mit Mirko Drotschmann | MDR 
  '85-1': ['pBdDDB2EJu0', 'Christian Weilmeier'], // Philosophie erklärt: Was ist der Existentialismus? Sartre, Camus u.a. 
  '85-2': ['_hJZEq61KeM', 'Einzelgänger'], // Life is Absurd. How to Live it? | ALBERT CAMUS
  '85-3': ['emQLRpLQgCw', 'Noetic Films'], // Die Sinnfrage ist keine Neurose - Viktor Frankl im Studiogespräch
  '86-0': ['KU62jMxA5oc', 'Biologie - simpleclub'], // Das Gehirn - Zentrales Nervensystem (ZNS)
  '86-1': ['Vl4FotUbbBA', 'Dinge Erklärt – Kurzgesagt'], // Wie entstand unser Bewusstsein? (feat. Simplicissimus)
  '86-2': ['oGm_z7PGRq4', 'Die Merkhilfe'], // Evolution des Menschen - einfach erklärt! + Wasseraffen- & Savannenthe
  '86-3': ['zf591BzyTMU', 'Quarks'], // Darum hat sich der Homo sapiens durchgesetzt | Quarks
  '87-0': ['amzqgKpI88E', 'MrWissen2go'], // Mache ich Propaganda?
  '87-1': ['VLakJnRTVlo', 'AustroTV'], // Filterblasen und Echokammern – Wie Algorithmen unsere Wahrnehmung beei
  '87-2': ['gYoBsdoCFRE', 'BM für Forschung, Technologie und Raumfahrt'], // Forschung gegen Fake News – Desinformation erkennen, verstehen, bekämp
  '87-3': ['oBfZuyy-zQY', 'DW Deutsch'], // Video Faktencheck: Wie erkenne ich Fake News?
  '88-0': ['HIlH7n8PNk8', 'Terra X History'], // Warum spricht niemand europäisch?
  '88-1': ['RVLwQDTPGrQ', '0verstanden'], // Etymologie Die Herkunft von Wörtern
  '88-2': ['IsU5y8pCNHk', 'musstewissen Deutsch'], // Rhetorische Stilmittel einfach erklärt I musstewissen Deutsch
  '88-3': ['MEqjcanuBok', 'Verwaltungspunk'], // Ethos, Pathos, Logos - Argumentationsgrundlagen der Rhetorik
  '89-0': ['vYtTfXvxxkw', 'ARTEde'], // Ging Rom an seiner Dekadenz zugrunde? | Stimmt es, dass ...? | ARTE
  '89-1': ['2sDGf0_ooQs', 'Thomas Witzler'], // Abenteuer Wirtschaft: Warum Nationen scheitern - “Wenn sich Leistung n
  '89-2': ['yqvmMFJQtm0', 'Overly Sarcastic Productions'], // History-Makers: Ibn Khaldun (englisch)
  '89-3': ['PbYXKuq_1hk', 'MrWissen2go Geschichte | Terra X'], // Wozu Geschichte lernen? | musstewissen Geschichte

  // Vertiefung nach Tag 90 (data/deep.ts), gesucht und geprüft am 2026-10-26
  '91-0': ['AArt1nUlhfY', '5 Minuten Deutschland'], // Was ist Quellenkritik? - Grundlagen Geschichte
  '91-1': ['8_qpYwSXL54', 'Anarchäologie'], // Die C14-Methode einfach erklärt! Wie datiert man in der Archäologie
  '91-2': ['uUJl-CLiJwY', 'ZDFheute Nachrichten'], // Holocaust-Erinnerung: So stehen die Deutschen dazu | Politbarometer2go
  '92-0': ['jlr-oxi1Bw8', 'MrWissen2go Geschichte | Terra X'], // Absolutismus unter dem Sonnenkönig I musstewissen Geschichte
  '92-1': ['6ynUOtswM2E', 'EinfachSchule'], // Was war der Merkantilismus? - Wirtschaftssystem unter Ludwig XIV. - Co
  '92-2': ['LyQipaToaUQ', 'Geschichte in fünf'], // Die Glorreiche Revolution & die Bill of Rights (1688-1689)
  '93-0': ['dL_5C-iITiY', 'MrWissen2go Geschichte | Terra X'], // Die Hanse: Europas große Handelsmacht 1150–1650
  '93-1': ['ZaHcVELvzQM', 'Terra X Nature'], // Seuchen in Europa – die Pest im 14. Jahrhundert | Terra X
  '93-2': ['uSjlWLT9PqY', 'Terra X Nature'], // Menschenrechte im Mittelalter – das Manifest der Bauern | Terra X
  '94-0': ['N_LRL_TS8ME', 'Bleib neugierig — TED-Ed'], // Der atlantische Sklavenhandel: Was man in den Geschichtsbüchern oft ni
  '94-1': ['uykwq3El_fI', 'OER Project'], // The Columbian Exchange Explained: How 1492 Changed the World
  '94-2': ['wqq8DpE4xoY', 'ARTEde'], // Wie wurde Europa zum Mittelpunkt der Welt? | Offene Ideen | ARTE
  '95-0': ['Jyto13xPzWY', 'MrWissen2go Geschichte | Terra X'], // Die Dolchstoßlegende: Darum war sie so verheerend
  '95-1': ['sVkEY87L-xI', 'MrWissen2go Geschichte | Terra X'], // Die Weimarer Republik I Das Krisenjahr 1923 I musstewissen Geschichte
  '95-2': ['tDI4SxeoH6k', 'MrWissen2go Geschichte | Terra X'], // Der Untergang der Weimarer Republik: Eine Warnung für heute?
  '96-0': ['5ObdahQg0-g', 'Terra X History'], // Völkermord in den deutschen Kolonien
  '96-1': ['c8-3hS0cHKk', 'EinfachSchule'], // Kongokonferenz - Westafrika-Konferenz - Verlauf, Folgen, Ergebnisse - 
  '96-2': ['nE89z19uha4', 'ZDF MAGAZIN ROYALE'], // Koloniale Raubkunst - Prof. Dr. Bénédicte Savoy im Interview | ZDF Mag
  '97-0': ['GpqMT88zWlc', 'MrWissen2go Geschichte | Terra X'], // „Altnazis“ in BRD und DDR: Zweite Karriere trotz NS-Vergangenheit
  '97-1': ['c7RSHQ44hyQ', 'DER SPIEGEL'], // Denkmäler stürzen oder nicht?: »Man könnte Bismarck auf den Kopf stell
  '97-2': ['CWhoALa6bTU', 'MrWissen2go Geschichte | Terra X'], // Der Ukraine-Konflikt: Die Geschichte dahinter
  '99-0': ['D1Lfl4WmySE', 'Samuel Jalalian'], // Das Leib-Seele-Problem: Monismus und Dualismus einfach erklärt!
  '99-1': ['SAFqeDADbRg', '3sat NANO'], // Phänomenales Bewusstsein – warum unsere Existenz fast unerklärlich ist
  '99-2': ['C7YSy-Mr-d8', 'Dinge Erklärt – Kurzgesagt'], // Hast du einen freien Willen?
  '100-0': ['VOMEd9qiiik', 'LitosoPHie'], // David Hume erklärt: Grenzen des Verstandes - Kausalität & Induktionspr
  '100-1': ['kFwShmat7Go', 'Held des Wissens'], // Induktion und Deduktion, Karl Popper, Falsifikation, Abitur Wissen Phi
  '100-2': ['2dR9hlgyY4Q', 'Christian Weilmeier'], // Thomas S. Kuhn über Wissenschaft und Paradigma / von Dr. Christian Wei
  '101-0': ['MYjQHuIcnH8', 'Was zur Hölle?! Theologie kompakt erklärt'], // Gottesbeweise kompakt erklärt
  '101-1': ['IwKn4WKBOl0', 'Terra X Lesch & Co'], // Wie kann ein allmächtiger Gott das Böse zulassen? | Harald Lesch
  '101-2': ['aOFFgszR_a0', 'David Johann Lensing'], // Feuerbach · Religionskritik und Projektionstheorie
  '102-0': ['atJbJ_3tWno', 'Die Merkhilfe'], // Aristoteles: Grundsätze der Gerechtigkeit | Gerechtigkeit 3
  '102-1': ['NX-IVGd6qhM', 'LetsDenk'], // John Rawls' geniale Theorie der Gerechtigkeit einfach erklärt | Let’s 
  '102-2': ['wvihqK3RSzU', 'Wirtschaft - Animiert Kapiert'], // Was ist soziale Gerechtigkeit? - Die Dimensionen der Gerechtigkeit ein
  '103-0': ['k1n7Vp4s_sU', 'unirostock'], // Soziologie studieren: Theodor W. Adorno - Kulturindustrie
  '103-1': ['L3huxMGnLu8', 'Christian Weilmeier'], // Diskursethik nach Habermas / von Philosoph Dr. Christian Weilmeier
  '103-2': ['7qRYu03C7-s', 'Herr Fuchs'], // Philosophie Grundkurs Q2:Staatstheorie Corona Special: Michel Foucault
  '104-0': ['wnnseWkJKb0', 'Samuel Jalalian'], // Peter Singer: Tier- und Medizinethik einfach erklärt!
  '104-1': ['uYr90m8SZlU', 'Christian Weilmeier'], // Ethik: aktive und passive Sterbehilfe / von Philosoph Dr. Christian We
  '104-2': ['2_NON7fHsQQ', 'MaxPlanckSociety'], // Designerbabys & Genom-Editierung – Science oder Fiction? | Gattaca | W
  '105-0': ['3ZFLF9EPIrA', 'Bleib neugierig — TED-Ed'], // Das ethische Dilamma von selbstfahrenden Autos - Patrick Lin
  '105-1': ['HeQsQU90aGU', 'Animation / Thomas Kaufmann'], // WDR / Quarks & Co: Transhumanismus – Die nächste Evolutionsstufe
  '105-2': ['Lm7CNLiYqI4', 'Die Merkhilfe'], // Hans Jonas: Technikethik / Verantwortungsethik (Neue Version)
  '107-0': ['xvDwOeOzyIY', 'Physik - simpleclub'], // Zentripetalkraft
  '107-1': ['VFYK5s_bhJI', 'Think Logic'], // Drehimpuls - einfache Erklärung, Berechnung, Physik
  '107-2': ['xcjv_vQJO7U', 'Physik - simpleclub'], // Erzwungene Schwingung - Resonanzkatastrophe
  '108-0': ['B9_ZFC2clE0', 'DER SPIEGEL'], // Wärmepumpe: Heizen ohne Flamme – wie funktioniert das eigentlich? | DE
  '108-1': ['iizUT01u9mA', 'Physik - simpleclub'], // Wärmeübertragung
  '108-2': ['kEFx1X5F2fU', 'musstewissen Chemie'], // Aggregatzustände I fest I flüssig I gasförmig I musstewissen Chemie
  '109-0': ['Ue3EfnzfMa8', 'Physik - simpleclub'], // Ausbreitung von elektromagnetischen Wellen
  '109-1': ['KBuc4XpzUUA', 'physikdigital • de'], // Elektromagnetisches Spektrum (einfach und anschaulich erklärt)
  '109-2': ['xFy9DNN0j4M', 'MaxPlanckSociety'], // Laser - Licht in Formation
  '110-0': ['lKZaHgNmQ_o', '100SekundenPhysik'], // Das Geheimnis der Quanten - Doppelspaltexperiment
  '110-1': ['deEyG4Nm9MA', 'Apolins Physik-Universum'], // Quantenmechanik 5: Heisenbergsche Unschärferelation
  '110-2': ['P21d40y-gPo', 'Terra X Lesch & Co'], // Schrödingers Katze – Tot oder lebendig? | Harald Lesch
  '111-0': ['bLECxDi6XlQ', 'Physik Academy'], // Standardmodell der Elementarteilchenphysik | Quarks, Leptonen, Bosonen
  '111-1': ['ACD_qndPwws', 'Terra X Lesch & Co'], // Das Higgs-Boson – Gottes Teilchen? | Harald Lesch
  '111-2': ['P2sIySmyUPg', 'Physik - simpleclub'], // Was ist Antimaterie?
  '112-0': ['3IpcM5gqRM4', 'Dinge Erklärt – Kurzgesagt'], // Schwarze Löcher Erklärt - Von der Geburt bis zum Tod
  '112-1': ['0ZGIX7N-n7Y', 'Terra X Lesch & Co'], // Dunkle Energie: was steckt dahinter? Krise der Kosmologie Teil 1 | Har
  '112-2': ['T87ZtZAoiiQ', 'Dinge Erklärt – Kurzgesagt'], // Wie funktioniert das Universum? - Die Stringtheorie erklärt
  '113-0': ['lj4IC70kDIU', 'Dinge Erklärt – Kurzgesagt'], // Energie der Zukunft oder kompletter Reinfall? - Fusionsenergie erklärt
  '113-1': ['h7G4-WgAPJk', 'Terra X Lesch & Co'], // Atommüll: So gefährlich ist er wirklich | Harald Lesch | Terra X Lesch
  '113-2': ['3s2bPNzOlFM', 'Fraunhofer-Institut für Angewandte Festkörperphysik IAF'], // Quantencomputer: Funktionsweise und Anwendungen
  '115-0': ['Y2KHvzPOxAM', 'AOK - Der Gesundheitskanal'], // Viren vs. Bakterien: Was ist der Unterschied?
  '115-1': ['_WP9Piwsexo', 'Dinge Erklärt – Kurzgesagt'], // Wie Bakterien unseren Körper beherrschen – Das Mikrobiom
  '115-2': ['fCYoQLwujNU', 'Biologie - simpleclub'], // Stammzellen - Wie entsteht ein Mensch?
  '116-0': ['wyKXI7j3Ob4', 'TeacherToby'], // Sexuelle Selektion - Geschlechtsdimorphismus [Evolutionsmechanismus, 5
  '116-1': ['EWvcWNj_eoQ', 'TeacherToby'], // Was ist Koevolution? Mechanismus+ Beispiele (Biologie, Evolution)
  '116-2': ['BLw1eXerF-E', 'Quarks Dimension Ralph'], // Epigenetik: Wie kann ich meine Gene beeinflussen? | Quarks Dimension R
  '117-0': ['RwYqOnwQ6O0', 'Biologie - simpleclub'], // Wie funktioniert die Photosynthese - REMAKE!
  '117-1': ['YeT5wTA0nPo', 'Die Merkhilfe'], // Lotka-Volterra-Regeln - Räuber-Beute-Beziehung - Regulation von Popula
  '117-2': ['XO9SvH8L1cg', 'planet schule'], // Wie invasive Arten Ökosysteme durcheinander bringen! | Woher wissen wi
  '118-0': ['NNijmxsKGbc', 'Stated Clearly'], // What Was The Miller-Urey Experiment?
  '118-1': ['b8CNQOe-Rbs', 'Terra X Lesch & Co'], // Entstand so das Leben? Die RNA-Welt | Mai Thi Nguyen-Kim
  '118-2': ['9LTMDLDsL98', 'MaxPlanckSociety'], // Zellorganellen - Die Endosymbiontentheorie
  '119-0': ['rGaU4CXbERE', 'Biologie - simpleclub'], // Krebs - Entstehung
  '119-1': ['v9HfNOC1AJs', 'Biologie - simpleclub'], // Warum altern wir?!
  '119-2': ['oplNop77Tiw', 'Krebsliga'], // Wie wirken Immuntherapien?
  '120-0': ['DE11uy4spho', 'Dinge Erklärt – Kurzgesagt'], // Gentechnik in unserem Essen - Grund zur Panik?
  '120-1': ['ojVvtlNyJu8', 'Die Merkhilfe'], // Gentherapie / Somatische Gentherapie - Gentherapie bei Krebs & an der 
  '120-2': ['KRg1TmTKc8o', 'Biologie - simpleclub'], // Dolly, ein geklontes Schaf?!
  '121-0': ['vLEcf4OaZAQ', 'Breaking Lab'], // 700mg pro Tag? So gefährlich ist Mikroplastik! Faktencheck
  '121-1': ['ZDWIgzpZkCk', 'Quarks'], // Insektensterben: Wie schlimm ist es mittlerweile? | Studio Q
  '121-2': ['4YsaZQzT7Z8', 'Dinge Erklärt – Kurzgesagt'], // Die Antibiotika Apokalypse erklärt
  '123-0': ['CYQZ_GrJwLA', 'ARTEde'], // Denken in Wahrscheinlichkeiten - Das Ziegenproblem | Mathewelten | ART
  '123-1': ['P1MWia09Kx4', 'Bleib neugierig — TED-Ed'], // Wie gut ist deine Intuition? Das Geburtstagsparadoxon – David Knuffke
  '123-2': ['6TFomA_XnQQ', 'Duden Learnattack'], // Das empirische Gesetz der großen Zahlen: Das musst du wissen – Mathe |
  '124-0': ['OM90fGYTj_w', 'Mathe by Daniel Jung'], // Mittelwert, Median, Modalwert | Statistik | Mathe by Daniel Jung
  '124-1': ['_rVt6qTkea8', 'Mathe - simpleclub'], // Normalverteilung / Gaußverteilung
  '124-2': ['ZnSWQfhYyDc', 'SEOTADEO'], // Lügen mit Statistik: Manipulative Diagramme und Grafiken (Teil 2)
  '125-0': ['WylD-eQUm-g', 'Sprouts Deutschland'], // Das Pareto-Prinzip - Die 20/80 Regel
  '125-1': ['DCoekhDNDGY', 'Ultralativ'], // Warum im Internet so viele Monopole sind | Der Netzwerkeffekt
  '125-2': ['pb4YoMjcYM4', 'Dinge Erklärt – Kurzgesagt'], // Wie dumme Einzelteile zusammen intelligent werden - Emergenz
  '126-0': ['Q4j4DIUHzYM', 'shribe! - master your studies'], // Ockhams Rasiermesser | Das Sparsamkeitsprinzip einfach erklärt 🔬
  '126-1': ['TwnWnl3kf1I', 'SRF Kultur Sternstunden'], // «TEEKANNE» – das philosophische Gedankenexperiment | #filosofix
  '126-2': ['iElYEW1v0IU', 'Magda liebt Mathe'], // Der Satz von Bayes | einfach erklärt | mit überraschend simpler Herlei
  '127-0': ['eUywVvl_1oE', 'ARTEde'], // Der Gödelsche Unvollständigkeitssatz | Mathewelten - ARTE
  '127-1': ['XTsaZRKx9UI', 'Christian Spannagel'], // Hilberts Hotel
  '127-2': ['WiPlFycsQ2s', 'Theo Reto'], // Das Russell'sche Paradox (TU Berlin)
  '128-0': ['tq7i9OzSNSQ', 'Dinge Erklärt – Kurzgesagt'], // Homöopathie – Sanfte Alternative oder dreister Humbug?
  '128-1': ['wXZ_gn5txU8', 'Simplicissimus'], // Warum Menschen an Verschwörungstheorien glauben
  '128-2': ['MWONKqdbiyY', 'Terra X Lesch & Co'], // Wie Pseudowissenschaftler uns belügen | Harald Lesch
  '129-0': ['uH813u7_b0s', 'youknow'], // Big Data in 3 Minuten erklärt
  '129-1': ['r5rtUf8r4ok', '3sat NANO'], // Google & Co.: Im Netz des Überwachungskapitalismus
  '129-2': ['9WPyD2BLooo', 'Doktor Whatson'], // Wie (und warum) Künstliche Intelligenz diskriminiert... und wie wir es
  '131-0': ['Xqer4ADWUd8', 'Finanzfluss'], // Unternehmensformen erklärt: GmbH, AG, UG, GbR, Inc., Ltd uvm. einfach 
  '131-1': ['h0lJ2goopnI', 'Finanzfluss'], // In 10 min. mehr über Börse & Aktien verstehen als 90% aller Menschen
  '131-2': ['B1EeV7JtuSI', 'explainity ® Erklärvideos'], // Bilanzen einfach erklärt (explainity® Erklärvideo)
  '132-0': ['QPbacRM8rXk', 'NZZ'], // Schuldenbremse: Deutschlands Staatsschulden erklärt
  '132-1': ['UATCJ-XA3E4', 'Friedrich-Ebert-Stiftung'], // Sozialstaat und Soziale Demokratie (Untertitel)
  '132-2': ['B4XzALJqAoA', 'explainity ® Erklärvideos'], // Keynesianismus vs. Monetarismus einfach erklärt (explainity® Erklärvid
  '133-0': ['MCvJGiYyqKY', 'Wirtschaft - simpleclub'], // Arten der Arbeitslosigkeit - Makroökonomie
  '133-1': ['qBkoAkY5mus', 'contraPro'], // Mindestlohn - Pro vs. Contra
  '133-2': ['MoyY7Neh4gI', 'Hans-Böckler-Stiftung'], // Tarifvertrag – einfach erklärt
  '134-0': ['X5ZMD6dvXew', 'MrWissen2go Geschichte | Terra X'], // Die Weimarer Republik | Die Weltwirtschaftskrise 1929 | musstewissen G
  '134-1': ['ci4yFt5gCbc', 'EinfachSchule'], // Finanzkrise 2008 einfach erklärt - Finanzkrise in Europa - Lehmann Bro
  '134-2': ['cEWw5pNekiY', 'EinfachSchule'], // Eurokrise einfach erklärt - Die Europäische Finanz- und Eurokrise - Eu
  '135-0': ['Kp3FahlOYmg', 'Globale Wirtschaft Verstehen'], // Warum sind manche Länder arm und andere reich? - Part 1
  '135-1': ['_kbPY3MhaOc', 'ARTEde'], // Entwicklungshilfe: Wer hilft wirklich wem? | Agree to Disagree! | ARTE
  '135-2': ['ivzVcA3FNf8', 'Simple SoWi'], // Lorenzkurve und Gini-Koeffizient | Simple SoWi
  '136-0': ['rcEU8Bgk9e0', 'Quarks'], // Explodierende CO2-Preise ab 2027: Wird Tanken und Heizen unbezahlbar? 
  '136-1': ['gF6YCN0AWls', 'EVERGREEN'], // Green Growth: Ist Grünes Wachstum eine Illusion?
  '136-2': ['R3vSJA1sY9w', 'DIE ZEIT '], // Die wahren Kosten der Klimakrise | DEUTSCHLAND 2050
  '137-0': ['2473NHJtdFA', 'Finanzfluss'], // Bitcoins Erklärung: In nur 12 Min. Bitcoin verstehen!
  '137-1': ['Ur7iViKeNIE', 'hessenschau'], // Warum die Energiepreise und Inflationsrate explodieren | hessenschau D
  '137-2': ['w7daiJHfjoY', 'Dinge Erklärt – Kurzgesagt'], // Geld fürs Nichtstun? - Bedingungsloses Grundeinkommen
  '139-0': ['rh5MUxhUUEE', 'musstewissen Deutsch'], // Dramentheorie | musstewissen Deutsch
  '139-1': ['40HLRBDS4lY', 'Deutsch - simpleclub'], // Erzähltechnik - Erzählform und Erzählverhalten
  '139-2': ['-rzEdO3WHNE', 'Studyflix'], // Metrum bestimmen | einfach erklärt
  '140-0': ['60kNNVHeYTU', 'Sommers Weltliteratur to go'], // Nathan der Weise to go (Lessing in 8,5 Minuten)
  '140-1': ['8qYlUIjSsnU', 'Sommers Weltliteratur to go'], // Die Räuber to go (Schiller in 10 Minuten)
  '140-2': ['ApN1tq0q0xE', 'Sommers Weltliteratur to go'], // Woyzeck to go (Büchner in 9 Minuten)
  '141-0': ['2JidaOO2Fds', 'Terra X History'], // 5 historische Wahrheiten hinter Hänsel und Gretel | Terra X
  '141-1': ['4I2Tq9k0jWU', 'Study History'], // Nordische Götter I Thor, Loki und Co. einfach erklärt
  '141-2': ['3fiXbU5Zpxw', 'VORZOCKER'], // Heldenreise - Warum viele Filme gleich aufgebaut sind?! | Erklärt
  '142-0': ['Tf8ifFn0w4Y', 'Sommers Weltliteratur to go'], // Effi Briest to go (Fontane in 9,5 Minuten)
  '142-1': ['lWWyfF3qOt8', 'Sommers Weltliteratur to go'], // Stolz und Vorurteil to go (Austen in 12,75 Minuten)
  '142-2': ['1qLvsbquIsY', 'Klassiker der Weltliteratur'], // Klassiker der Weltliteratur: Lev Nikolajewitsch Tolstoj - "Anna Kareni
  '143-0': ['QbU_PU4hT-0', 'Sommers Weltliteratur to go'], // Buddenbrooks to go & #MeinSenf (Mann in 10,5 Minuten - Neufassung!)
  '143-1': ['oYAAFXCSuu8', 'hyperkulturell'], // Dramentheorie – Aristoteles vs. Brecht – Klassisches antikes Theater v
  '143-2': ['XN-B6P6R5w4', 'Sommers Weltliteratur to go'], // Der Steppenwolf to go (Hesse in 13 Minuten)
  '144-0': ['5eDUvC8IXUI', 'Die Merkhilfe'], // Literatur der Nachkriegszeit / Trümmerliteratur - Literaturepoche einf
  '144-1': ['ZhWXP-PTLHY', 'Text und Bühne'], // Autoren erzählen: Heinrich Böll
  '144-2': ['a9lIYp_xCAc', 'Selmas Poesiealbum'], // Selma erklärt: Paul Celan, Todesfuge
  '145-0': ['to9lbR8JvyM', 'Quarks'], // Was bringt Gendern wirklich? | Quarks TabulaRasa
  '145-1': ['KVKTMNVkeVE', 'musstewissen Deutsch'], // Anglizismen einfach erklärt I Wörter im Deutschen aus dem Englischen
  '145-2': ['o8_iutAEwZI', 'Die Merkhilfe'], // Jugendsprache & Kiezdeutsch - Form, Soziolekt & sprachliche Besonderhe
  '147-0': ['HLfyDNh788Y', 'Der Kunsterklärer'], // Systematische Bildanalyse : Die Bildbeschreibung
  '147-1': ['C06KtGCZt8Y', 'Hans Dieter Huber'], // 17b. perspektive in der renaissance
  '147-2': ['EdUGaS0UIhQ', 'Der Kunsterklärer'], // Der Farbkreis - Johannes Itten und Harald Küppers in Kombination
  '148-0': ['8EU-7hEICtg', 'Terra X History'], // Leonardo da Vinci: Was erfand er wirklich?
  '148-1': ['ZnRqidEunDc', 'Deutsch lernen mit der DW'], // Deutsch lernen mit Videos | Rembrandt – Weltstar auch nach 350 Jahren 
  '148-2': ['ROObvneVdJ4', 'Lars Reimers'], // Kunst in der Romantik - Caspar David Friedrich
  '149-0': ['kVUNEdGG9Ns', 'MusikDurchblick'], // DUR-Tonleiter und MOLL-Tonleiter - einfach verstehen!
  '149-1': ['l1Fid3PYe8Y', 'hr-Sinfonieorchester – Frankfurt Radio Symphony'], // Young Person's Guide: Das Orchester und seine Gruppen – vorgestellt vo
  '149-2': ['kzAGtLJjnp8', 'klassiktv redaktion'], // Carmen - Opern kurz und bündig
  '150-0': ['uPEQtq6pTow', 'IKP_movie'], // Marcel Duchamp und das Ready-made // Zugänge zu exemplarischen Kunstwe
  '150-1': ['xcmWao9oSdQ', 'DW Deutsch'], // "Jeder Mensch ist ein Künstler" - Im Mai wäre Joseph Beuys 100 Jahre a
  '150-2': ['KQiT8UbRlEE', 'Wissenswert'], // 6 simple Kunstwerke die Millionen wert sind - WARUM?
  '151-0': ['-OAatV4jNpY', 'DW Doku'], // Ist es möglich, unsere Städte für ein besseres Leben neu zu gestalten?
  '151-1': ['6NZjf7SoNwE', 'Terra X History'], // Wie kommen die Wolkenkratzer nach New York? | Terra X
  '151-2': ['GSLaPYeEQ1I', 'klima:neutral'], // Klimasünder Beton! Das sind klimafreundliche Alternativen | green:scre
  '152-0': ['QWHAh3e37bE', 'Histoclips'], // "Entartete Kunst"-Ausstellungen
  '152-1': ['8FXQOVnp8lk', 'ZDF MAGAZIN ROYALE'], // Wer oder was ist alles von der Kunstfreiheit gedeckt? | ZDF Magazin Ro
  '152-2': ['XmdWkcyt5Ac', 'DER SPIEGEL'], // Wer war Leni Riefenstahl: Die Regisseurin des NS-Films | SPIEGEL TV
  '153-0': ['ayTOgTcPDGo', 'ARTEde'], // KI-Kunst | Mit offenen Augen | ARTE
  '153-1': ['0qhuthv90_g', 'MDR Investigativ'], // Das Geschäft von Spotify, Amazon und Apple Music: So wenig verdienen N
  '153-2': ['LzPShWLOzvw', 'DW Deutsch'], // Games: Zeitverschwendung oder Kunst? | DW Deutsch
  '155-0': ['xjQtFsUCpGc', 'Bundeszentrale für politische Bildung / bpb'], // Wie entsteht ein Gesetz?
  '155-1': ['Tzr3nztOo04', 'JUGEND PRÄGT'], // Bundespolitik = Landespolitik? | Mirko Drotschmann erklärt Föderalismu
  '155-2': ['nnP2IC6bZzY', 'Die Merkhilfe'], // Parteien & Parteiensystem in Deutschland einfach erklärt - Entstehung,
  '156-0': ['IZSCCKjttM0', 'Study History'], // Verhältniswahl & Mehrheitswahl im Vergleich I Vor- und Nachteile der W
  '156-1': ['QSFiBisOJ8g', 'tagesschau'], // Volksabstimmung, Volksentscheid | Wie demokratisch bist Du? – Das Expe
  '156-2': ['TKHCCSypIXI', 'Latiniculus'], // Die Verfassung der USA erklärt (Kongress | Senat | checks and balances
  '157-0': ['PuiASCpc2M8', 'Die Merkhilfe Wirtschaft'], // Einführung ins Strafrecht - materiell & formell, Strafzweck & Beispiel
  '157-1': ['bnpmLdw4SG0', 'explainity ® Erklärvideos'], // Das deutsche Rechtssystem einfach erklärt (explainity® Erklärvideo)
  '157-2': ['0CpynaBOqRU', 'Lecturio Jura'], // Strafrecht I Überblick über das Strafverfahren I RA Stefan Koslowski
  '158-0': ['T1VXkO3RrBs', 'Amnesty Switzerland'], // Menschenrechte in drei Minuten erklärt
  '158-1': ['-XJHnc5ka6I', 'ARTEde'], // Internationaler Strafgerichtshof am Limit? | ARTE Hintergrund
  '158-2': ['N2k29XO87Fc', 'Refugee Law Clinic Dresden'], // Asyl- und Aufenthaltsrecht: Kompakt - Chronologie des Asylverfahrens
  '159-0': ['lglNVX7v1qs', 'ARTEde'], // Atomare Abschreckung: Schutzschirm für Europa? | Mit offenen Karten - 
  '159-1': ['iDyR4jfnW20', 'MrWissen2go Geschichte | Terra X'], // Von RAF bis NSU: Politischer Terror in Deutschland
  '159-2': ['iFBzdkcTh7k', 'engagementglobal'], // Peacekeeping der UN und Nachhaltige Entwicklung [Erklärvideo für die O
  '160-0': ['oWIQxUFkTmg', 'NZZ'], // Populismus einfach erklärt – was ist Populismus eigentlich?
  '160-1': ['CuUKbW4DEdc', 'EinfachSchule'], // Was ist ein Parteiverbot? - Parteiverbotsverfahren in Deutschland - Pa
  '160-2': ['yOVry0hH9vk', 'Wirtschaft - simpleclub'], // Lobbyismus – Grundbegriffe der Wirtschaft
  '161-0': ['HrpXgqFcN0k', 'MrWissen2go'], // Zuwanderung: Die größten Probleme & Lösungen
  '161-1': ['WtvdUkielo4', 'ARTEde'], // Was bleibt vom Pariser Klimaabkommen? | ARTE Hintergrund
  '161-2': ['6lKfx1uer9k', 'MrWissen2go'], // Wehrdienst oder Wehrpflicht? Das gilt ab jetzt!
  '163-0': ['8QWXJ1JjVzk', 'Sprouts Deutschland'], // Ivan Pavlovs Klassische Konditionierung
  '163-1': ['C-psNuTOR6Q', 'Mission Bachelor'], // Operante Konditionierung | Negative und positive Verstärkung bzw. Best
  '163-2': ['lRPLIElAq9A', 'Sprouts Deutschland'], // Sozialkognitive Lerntheorie: Banduras Experimente mit der Schlagpuppe
  '164-0': ['IT_iaZr96wY', 'Quarks Dimension Ralph'], // Sinnestäuschungen: So trügt uns unsere Wahrnehmung | Ralphs Universum 
  '164-1': ['vJG698U2Mvo', 'Daniel Simons'], // selective attention test
  '164-2': ['vErs2HGNTq8', 'ARTEde'], // Warum träumen wir? | Wer nicht fragt, stirbt dumm! | ARTE
  '165-0': ['hT5Ym09bJJk', 'Die Merkhilfe'], // Kommunikationsquadrat von Schulz von Thun einfach erklärt - Kommunikat
  '165-1': ['6aem_0AcHZo', 'Quarks Dimension Ralph'], // Liebe und Verliebtsein: Alles nur Illusion? | Quarks Dimension Ralph
  '165-2': ['VWumM6LwOng', 'Erzieherkanal - Wissen, Theorien & Infos'], // GEWALTFREIE KOMMUNIKATION nach Marshall Rosenberg - gewaltfrei kommuni
  '166-0': ['yD0XiigUcrw', 'ARD'], // Das Stanford-Prison-Experiment – unwissenschaftlich und sadistisch?
  '166-1': ['P_xq2PCm0us', 'Quarks'], // Süßigkeiten-Experiment: Welche Kinder können widerstehen? | Quarks
  '166-2': ['rsqofw2Lv1c', 'Hans-Peter Steuer'], // Der kleine Albert und seine krankhafte Angst vor Ratten
  '167-0': ['se4wl9qN3v8', 'AOK - Der Gesundheitskanal'], // Schizophrenie - Was ist das genau?
  '167-1': ['Kxn1Ek5hQFc', 'Die Techniker'], // ADHS verstehen: Ursachen, Symptome, Diagnose & Therapie | DocTommy
  '167-2': ['vuoIs5_J0rw', 'Dinge Erklärt – Kurzgesagt'], // Sucht
  '168-0': ['Qia-McaUSY8', 'Philosophical Questions'], // The Replication Crisis in Psychology
  '168-1': ['b0pmfpIDCgs', 'psychologeek'], // Myers-Briggs Typenindikator (MBTI) – das kann er wirklich | psychologe
  '168-2': ['DN2kCvTilOo', 'Wlad Jachtchenko - DER FÜHRUNGSKRÄFTE PODCAST'], // Lerntypen: Gibt es sie wirklich? Oder nur ein dummer Mythos?
  '169-0': ['trKJKn2wntc', 'ARTEde'], // Scrollen sich Teenager dumm? | 42 - Die Antwort auf fast alles | ARTE
  '169-1': ['IlEuuCtUvlo', 'Terra Xplore'], // Glücksforschung: Kann ich Zufriedenheit lernen? | Terra Xplore mit Eri
  '169-2': ['DwqwRYe6fKA', 'Dinge Erklärt – Kurzgesagt'], // Einsamkeit
  '171-0': ['QXowmQ2J7wo', 'Terra X Nature'], // Wie Gletscher Deutschland formten | Terra X plus
  '171-1': ['cuU63o04_cE', 'Die Merkhilfe'], // Mäander - Bildung & Aufbau von Mäander - Altarmbildung & Flussbegradig
  '171-2': ['wPBvtSUuncc', 'TeacherToby'], // Wüstenarten /Wüstenformen der Erde und ihre Entstehung [Erdkunde, Mitt
  '172-0': ['Xjl9LeOCBHg', 'Terra X Nature'], // Aus für den Golfstrom? Droht Europa die nächste Eiszeit? | Terra X plu
  '172-1': ['56HmkPjGlWg', 'TeacherToby'], // Monsunzirkulation / Monsun in Indien [Sommermonsun + Wintermonsun] [Er
  '172-2': ['bnw55aE0sFU', 'Breaking Lab'], // El Niño: Das Klimaphänomen einfach erklärt
  '173-0': ['_scVEtRaXd0', 'DW Deutsch'], // Wasser: Warum unsere wertvollste Ressource knapp wird | Made in German
  '173-1': ['U-jeKCmTKac', 'Geographie - simpleclub'], // Boden - Was ist das? - Böden Basics 1
  '173-2': ['OYEukC3TGdI', 'Quarks'], // Faktencheck Seltene Erden: Wie abhängig sind wir? | Studio Q
  '174-0': ['YGe0-9PdqUo', 'Geographie - simpleclub'], // Globale Disparitäten - Abiturzusammenfassung
  '174-1': ['UIARB24wAnw', 'TeacherToby'], // HDI (Human Development Index) und IHDI, Vorteile + Nachteile [Erdkunde
  '174-2': ['lhC57UUafSY', 'SWR Landesschau Rheinland-Pfalz'], // So funktioniert Fairer Handel
  '175-0': ['W3L8hB_O3q0', 'Bleib neugierig — TED-Ed'], // Wie Tsunamis entstehen – Alex Gendler
  '175-1': ['p3XAhsx01u8', 'Terra X Nature'], // Hurrikane – so entstehen die gefährlichen Stürme | Terra X
  '175-2': ['8EuV3sSZqsc', 'Hessischer Rundfunk'], // Dürre trotz Überflutungen: Was Hochwasser und Schneemassen fürs Klima 
  '176-0': ['P0NWErWu5ac', 'Alfred-Wegener-Institut, Helmholtz-Zentrum für Polar- und Meeresforschung'], // Meeresspiegelanstieg, was passiert und warum?
  '176-1': ['61aUHA4895c', 'klima.bayern'], // Prinzip Schwammstadt - So können wir unsere Städte klimafit machen | C
  '176-2': ['VcVsV9Yn4P4', 'Dinge Erklärt – Kurzgesagt'], // Geoengineering: Der Klima-Cheat?
  '177-0': ['rct96QqCalY', 'NDR Info'], // Verkehrswende in der Stadt: Was passiert, wenn das Auto nicht mehr dom
  '177-1': ['iGiBLpIBdFI', 'Geographie - simpleclub'], // Gentrifizierung - einfach erklärt!
  '177-2': ['v9jEX6NBbs0', 'Galileo'], // Barcelona, Vorbild für die ganze Welt! So funktioniert die Smart-City 
  '179-0': ['Srb0nZ14y4Q', 'Lehrerschmidt'], // Viertaktmotor - Ottomotor - Dieselmotor | Mechanik | Physik | Lehrersc
  '179-1': ['krRzH0myAOc', 'Terra X Nature'], // Wie der Lithium-Ionen-Akku funktioniert | Terra X plus
  '179-2': ['VH0k0H7MgWc', 'Apolins Physik-Universum'], // So funktioniert Fliegen wirklich!
  '180-0': ['xq1LkN5Hi34', 'Physik - simpleclub'], // Was sind Halbleiter?
  '180-1': ['IhCZu8ALmFE', 'brainfaqt'], // Wie funktionieren Transistoren und Mikrochips? #1
  '180-2': ['K8oNMCWZlmQ', 'SONNENSEITE'], // Einfache Erklärung Wie GPS Funktioniert
  '181-0': ['LfUC263au58', 'Techplausch'], // Was sind 4G, 5G und LTE? - Mobilfunkstandards Zusammengefasst!
  '181-1': ['AFlbY6P10mc', 'Physik - simpleclub'], // Wie funktioniert ein Glasfaserkabel?!?
  '181-2': ['8jLFecXj0WU', 'Die Maus'], // Satellitenbau | DieMaus | WDR
  '182-0': ['9Gtd6E5R39c', 'Fabian Rappert | Data Science Institute'], // 17 Programmiersprachen erklärt (in 17min)
  '182-1': ['HihZ6PKk9WI', 'task media'], // Verschlüsselungsverfahren (symmetrisch, asymmetrisch, hybrid) - it-arc
  '182-2': ['3gm71ABbXVo', 'c\'t 3003'], // Passkeys endlich verstanden | Nie mehr Passwörter
  '183-0': ['twuD09Sn3Wo', 'Physik - simpleclub'], // Wie fliegt eine Rakete ins Weltall?
  '183-1': ['-5JP2UZx4z8', 'Die Maus'], // Ein Tag an Board der ISS | DieMaus | WDR
  '183-2': ['I-wjgwxI17U', 'Terra X History'], // Wann und wie werden wir den Mars besiedeln? | Terra X
  '184-0': ['uN1Zx-Ia-SE', 'MrWissen2go'], // KI außer Kontrolle? So gefährlich ist es wirklich
  '184-1': ['Qg7sOHGmq-s', 'ZDFheute Nachrichten'], // Jobkiller KI? Oder Chance für Deutschland? | Wirtschaft erklärt
  '184-2': ['tXsORfMcVyw', 'ZAPP - Die Medienredaktion'], // KI vs Realität: Jetzt beweisen Videos wirklich nichts mehr | ZAPP | ND
  '185-0': ['cxeJBzezVTk', 'ZDFheute Nachrichten'], // Cyberangriff hautnah: gezielt, professionell, geplant - so arbeiten et
  '185-1': ['nUpIOi0frOM', 'DW Deutsch'], // KI-Gesichtserkennung – Gefahr für Privatsphäre? | Shift
  '185-2': ['SjZuuG7kOJ0', 'ITAS | Institute for Technology Assessment'], // Was ist eigentlich Technikfolgenabschätzung? – Armin Grunwald erklärt 
}

// Ausgemustert am 2026-10-22: KI-generierte Videos (NotebookLM-Folien, KI-Bilder/-Stimme, Stockfootage-Kanäle).
// Geprüft über Storyboard-Vorschaubilder + Kanalverlauf; ersetzt durch Videos von Menschen. Stehen sie noch in einer
// gespeicherten oder veröffentlichten Liste, tauscht upgradeVideos sie gegen den aktuellen Pick.
export const RETIRED_VIDEOS = new Set([
  '2_NXbfGrXOo', 'e33XCF0nRWQ', 'MQsxTNckYSo', '6GpZkNK_lH0', 'fWEsMCC0rFc', 'EdcyEmYEykE', 'om31s8T5UlE', 'gLoIuAWAY7w', // StudioEinfach
  'IxZ52y1IejU', '8a36S_mXgB0', // Psychologie Philosophie
  '6wkHF8Gaq8s', 'AHOj4GScXpw', // Geschichte 101, MOOCit
  'RpxjwDQfurQ', 'NtFUz-hOx6I', 'KwwakhyAy6E', 'HFKC3trVsL4', 'w8QKrArC4SM', 'A8-i_sgRDCI', // Grundwissen, erklaerung-und-mehr, Geo Karten, StrateGems, Hikma, Faktenkompass
  '5p-UD1cnRVg', 'pDrm4OglI4Q', '4Z7M7_Jhork', // Lars Reimers (2024), Musiklehrer, selbstorientiert (2024)
])
