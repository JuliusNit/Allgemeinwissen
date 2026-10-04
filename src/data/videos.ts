// Ausgewaehlte YouTube-Videos je Teilthema (Tag-Index → [Video-ID, Kanal]).
// Per Suche gefunden, von Hand ausgewaehlt und per oEmbed geprueft (existiert, einbettbar) am 2026-10-04.
// Bevorzugt: Studyflix, simpleclub, MrWissen2go/musstewissen, Terra X, Kurzgesagt, Sommers Weltliteratur.
export const VIDEO_PICKS: Record<string, [string, string]> = {
  '1-0': ['upePNQNNDPY', 'Studyflix'], // Zellorganellen und ihre Funktionen - einfach erklärt!
  '1-1': ['hu37M7pQa-M', 'Studyflix'], // Zellmembran - Aufbau und Funktion
  '1-2': ['XI0pIFX-1oM', 'Biologie - simpleclub'], // Transport durch die Zellmembran - Überblick
  '1-3': ['QsViPW2eu3k', 'Die Merkhilfe'], // Enzyme als Biokatalysatoren einfach erklärt - Was sind Enzyme? Enzymak
  '1-4': ['2_NXbfGrXOo', 'StudioEinfach - Wissen, das Klick macht!'], // Was ist Adenosintriphosphat (ATP) | EINFACH ERKLÄRT
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
  '4-3': ['e33XCF0nRWQ', 'StudioEinfach - Wissen, das Klick macht!'], // Neurotransmitter | EINFACH ERKLÄRT
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
  '12-0': ['IxZ52y1IejU', 'Psychologie Philosophie'], // Karl Popper erklärt | Falsifikation & Offene Gesellschaft | Warum Wiss
  '12-1': ['3vMxWdJSodk', 'Pharmalogisch!'], // Placebokontrolliert, randomisiert und doppelblind
  '12-2': ['CLUiA2Id7KQ', 'shaussner'], // Von Expertenmeinung zu Meta-Analyse - Evidenzpyramide für die Politikw
  '12-3': ['MQsxTNckYSo', 'StudioEinfach - Wissen, das Klick macht!'], // Die Replikationskrise | EINFACH ERKLÄRT
  '13-0': ['34yjxCKh_tM', 'immocentrum'], // Romanik & Gotik in der Architektur🏰⛲Übergang der Baustile-Lebendiges 
  '13-1': ['2JOsATFv7vY', 'Art Explained Simply & Quickly'], // How to Tell Renaissance, Baroque, and Rococo Apart in 5 Minutes
  '13-2': ['7kDmF17k15M', 'MiMa'], // Epochen der Kunst - Klassizismus, Romantik, Realismus
  '13-3': ['8I9DaMpNv68', 'Ars Vitae'], // Stil-Epochen - Moderne, Postmoderne und zeitgenössische Kunst (1945 bi
  '14-0': ['dMLoLNy89vw', 'PhilosophiePlus'], // PhiloBasics 2: Die 4 Grundfragen nach Kant und die Disziplinen der Phi
  '14-1': ['TmxNs931Z8I', 'Held des Wissens'], // Erkenntnistheorie - Wissenschaftstheorie - Epistemologie - Abitur Wiss
  '14-2': ['5p-UD1cnRVg', 'Lars Reimers'], // Ethik erklärt: Von Aristoteles bis Kant – Eine Reise durch die Geschic
  '14-3': ['b3jaHlIOul4', 'PhrasenDrescher'], // 30 philosophische Strömungen in 13 Minuten
  '15-0': ['PmDVudkhk7Y', 'MrWissen2go Geschichte | Terra X'], // Das Grundgesetz erklärt | Geschichte
  '15-1': ['tYWQs7I7NCQ', 'Die Merkhilfe'], // Grundrechte im Grundgesetz - Grundrechte, Menschenrechte, Menschenwürd
  '15-2': ['__Wdzpu4OYI', 'Studyflix'], // Gewaltenteilung: Das Wichtigste! -- Studyflix
  '15-3': ['bpHAXzjWsvI', 'Politik - simpleclub'], // Das Bundesverfassungsgericht - einfach erklärt!
  '16-0': ['y_rXYqjCZTI', 'Simon Josef Eckert'], // Big Five: Die Persönlichkeitsfaktoren einfach erklärt (OCEAN Modell)
  '16-1': ['8HtnfA0nErw', 'Dinge Erklärt – Kurzgesagt'], // Was ist Intelligenz?
  '16-2': ['WC7PrWmB1_8', 'studybreak'], // Fluide Intelligenz, Kristalline Intelligenz | Wirtschaftsdidaktik
  '16-3': ['UrOpDurkvMk', 'Quarks'], // Zwillinge – Was sie über die Macht der Gene verraten | Quarks
  '18-0': ['6wkHF8Gaq8s', 'Geschichte 101'], // Die ersten Dörfer der Menschheit, oder: die neolithische Revolution
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
  '22-2': ['8a36S_mXgB0', 'Psychologie Philosophie'], //  Platon erklärt | Ideenlehre & Höhlengleichnis | Wahrheit, Seele & Sta
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
  '32-3': ['A8-i_sgRDCI', 'Faktenkompass'], // Judentum, Christentum, Islam: Wie unterschiedlich sind die Religionen 
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
  '35-3': ['6GpZkNK_lH0', 'StudioEinfach - Wissen, das Klick macht!'], // Das Zeitalter der Entdeckungen | EINFACH ERKLÄRT
  '36-0': ['sDG5YLbCvU8', 'shribe! - master your studies'], // Induktion und Deduktion mit Beispielen erklärt (Superschnelles 5-Minut
  '36-1': ['fWEsMCC0rFc', 'StudioEinfach - Wissen, das Klick macht!'], // Gültige Argumente (Logik) | EINFACH ERKLÄRT
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
  '45-2': ['RpxjwDQfurQ', 'Grundwissen'], // Die Entdeckung des elektrischen Stroms und die Erfindung der Glühbirne
  '45-3': ['NtFUz-hOx6I', 'erklaerung-und-mehr'], // Die Geschichte der Medizin (einfach und kurz erklärt)
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
  '52-1': ['EdcyEmYEykE', 'StudioEinfach - Wissen, das Klick macht!'], // Konservatismus | EINFACH ERKLÄRT
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
  '57-2': ['om31s8T5UlE', 'StudioEinfach - Wissen, das Klick macht!'], // Judenverfolgung ab 1933 | EINFACH ERKLÄRT
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
  '61-2': ['4Z7M7_Jhork', 'selbstorientiert'], // Dekolonisation und Unabhängigkeitsbewegungen einfach erklärt - Kriege 
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
  '76-1': ['pDrm4OglI4Q', 'Musiklehrer'], // Popmusik - Eine kurze Einführung in die Entwicklung der Popularmusik
  '76-2': ['FXRR4KNyBE0', 'Cman1337'], // 5 Minuten Filmgeschichte | 1880 - 2020
  '76-3': ['okmFIimKq2w', 'outdoortrainer'], // Kleine Filmschule - Teil 1 - Elemente der Filmsprache
  '77-0': ['obExlY4s3qI', 'Geographie - simpleclub'], // Demographischer Übergang - Modell einfach erklärt - Demographie 3
  '77-1': ['rTrNSrx2OT8', 'Studyflix'], // Urbanisierung: einfach erklärt -- Studyflix
  '77-2': ['AHOj4GScXpw', 'MOOCit Education Matters Lernvideos für die Schule'], // Flucht und Migration: Ursachen, Wandel und globale Folgen | Geschichts
  '77-3': ['dPZ17WUXwWI', 'Wirtschaft - simpleclub'], // Demografischer Wandel – Grundbegriffe der Wirtschaft
  '78-0': ['F81V7apquBM', 'Studyflix'], // EXPONENTIELLES WACHSTUM | Erklärung + Formel mit anschaulichem Beispie
  '78-1': ['W9Bd03YVVnA', 'Republik Magazin'], // Was sind eigentlich Kipppunkte? Klimaforscher Stefan Rahmstorf erklärt
  '78-2': ['RiLytA_cHtY', 'Studyflix'], // Spieltheorie - Das Gefangenendilemma mit Beispiel erklärt!
  '78-3': ['0Ttb606HfTU', 'Wirtschaft - simpleclub'], // Nash-Gleichgewicht (in reinen Strategien) einfach erklärt
  '79-0': ['BDcFTvHyVLk', 'Die Merkhilfe'], // Erneuerbare Energien - Primärenergiequellen, Potenzial & Probleme / Na
  '79-1': ['szJQ5Pf9Aus', 'Agentur für Erneuerbare Energien e. V.'], // Wie funktioniert das Stromnetz heute und in Zukunft?
  '79-2': ['ZAz1GutJGbg', 'Dinge Erklärt – Kurzgesagt'], // CRISPR - Gentechnik wird alles für immer verändern
  '79-3': ['gLoIuAWAY7w', 'StudioEinfach - Wissen, das Klick macht!'], // mRNA-Impfstoffe | EINFACH ERKLÄRT
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
  '83-3': ['KwwakhyAy6E', 'Geo Karten'], // So hat Geografie die USA zur Weltmacht gemacht!
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
  '87-0': ['HFKC3trVsL4', 'StrateGems Strategie & Methoden'], // Alle Propagandatechniken erklärt - Teil 1/2
  '87-1': ['VLakJnRTVlo', 'AustroTV'], // Filterblasen und Echokammern – Wie Algorithmen unsere Wahrnehmung beei
  '87-2': ['gYoBsdoCFRE', 'BM für Forschung, Technologie und Raumfahrt'], // Forschung gegen Fake News – Desinformation erkennen, verstehen, bekämp
  '87-3': ['oBfZuyy-zQY', 'DW Deutsch'], // Video Faktencheck: Wie erkenne ich Fake News?
  '88-0': ['HIlH7n8PNk8', 'Terra X History'], // Warum spricht niemand europäisch?
  '88-1': ['RVLwQDTPGrQ', '0verstanden'], // Etymologie Die Herkunft von Wörtern
  '88-2': ['IsU5y8pCNHk', 'musstewissen Deutsch'], // Rhetorische Stilmittel einfach erklärt I musstewissen Deutsch
  '88-3': ['MEqjcanuBok', 'Verwaltungspunk'], // Ethos, Pathos, Logos - Argumentationsgrundlagen der Rhetorik
  '89-0': ['vYtTfXvxxkw', 'ARTEde'], // Ging Rom an seiner Dekadenz zugrunde? | Stimmt es, dass ...? | ARTE
  '89-1': ['2sDGf0_ooQs', 'Thomas Witzler'], // Abenteuer Wirtschaft: Warum Nationen scheitern - “Wenn sich Leistung n
  '89-2': ['w8QKrArC4SM', 'Die Stärke der Hikma'], // GANZES VIDEO Ibn Khaldun | Der Kreislauf der Zivilisation
  '89-3': ['PbYXKuq_1hk', 'MrWissen2go Geschichte | Terra X'], // Wozu Geschichte lernen? | musstewissen Geschichte
}
