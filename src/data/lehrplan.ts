import type { AreaId } from './plan'

// Grundwiederholung: Schulstoff nach dem bayerischen LehrplanPLUS (Gymnasium, G9, Jgst. 5–13).
// Quelle: lehrplanplus.bayern.de, Fachlehrpläne (Lernbereiche; Oberstufe = grundlegendes Anforderungsniveau).
// NT = Natur und Technik (Jgst. 5–7, Biologie-/Physik-/Informatik-Schwerpunkte).
// Ethik ist Ersatzfach zu Religionslehre – beide stehen unter "Ethik & Religion".
// Chemie beginnt am NTG schon in Jgst. 8, sonst in 9; hier gilt der allgemeine Weg.

export type FachId = 'bio' | 'che' | 'phy' | 'mathe' | 'gesch' | 'geo' | 'pug' | 'wr' | 'rel' | 'deu' | 'kunst'

export interface Fach {
  id: FachId
  name: string
  icon: AreaId
  /** Jahrgangsstufe → Lernbereiche (gekürzt) */
  topics: Partial<Record<number, string[]>>
}

export const FAECHER: Fach[] = [
  {
    id: 'bio', name: 'Biologie', icon: 'BIO',
    topics: {
      5: ['NT: Zelle als Grundbaustein', 'NT: Atmung, Blutkreislauf, Verdauung', 'NT: Samenpflanzen'],
      6: ['NT: Fotosynthese & Zellatmung', 'NT: Wirbeltiere & ihre Angepasstheit', 'NT: Verwandtschaft der Wirbeltiere & Evolution'],
      8: ['Nervenzelle, Synapse, Sinnesorgane', 'Fortpflanzung, Hormone, Pubertät', 'Verhalten: angeboren & erlernt', 'Sucht & Gesundheit', 'Ökosysteme unter dem Einfluss des Menschen'],
      9: ['Mikroorganismen & Biotechnologie', 'Genetik: DNA, Meiose, Gentechnik', 'Evolution: Variabilität, Selektion, Isolation', 'Wirbellose', 'Ökosystem Boden'],
      10: ['Ökosystem Mensch: Symbionten & Krankheitserreger', 'Stoff- & Energieumwandlung: Nährstoffe, Verdauung', 'Systematik, Fossilien & Evolution des Menschen'],
      12: ['Genetik & Gentechnik: Proteinbiosynthese, Genregulation, Erbgänge', 'Evolution: Forschung & Mechanismen', 'Verhaltensökologie'],
      13: ['Neuronale Informationsverarbeitung', 'Stoffwechselphysiologie der Zelle', 'Ökologie & Biodiversität'],
    },
  },
  {
    id: 'che', name: 'Chemie', icon: 'CHE',
    topics: {
      9: ['Stoffe & Teilchenmodell', 'Chemische Reaktion & Daltonsches Atommodell', 'Kern-Hülle-Modell, Atombau & Periodensystem', 'Ionen: Elektronenübergänge'],
      10: ['Moleküle & Elektronenpaarabstoßung', 'Zwischenmolekulare Kräfte', 'Säuren & Basen (Protonenübergänge)', 'Redoxreaktionen', 'Nukleophil-Elektrophil-Reaktionen'],
      11: ['Lebensmittelchemie', 'Pharmazie'],
      12: ['Atombau & chemische Bindung', 'Kohlenwasserstoffe', 'Reaktionsgeschwindigkeit', 'Chemisches Gleichgewicht', 'Redoxgleichgewichte'],
      13: ['Farbigkeit', 'Säure-Base-Gleichgewichte', 'Makromoleküle', 'Chemie & Nachhaltigkeit'],
    },
  },
  {
    id: 'phy', name: 'Physik', icon: 'PHY',
    topics: {
      7: ['NT: Magnetismus, Dichte, Licht & Schatten'],
      8: ['Elektrischer Strom', 'Optik', 'Mechanik: Kräfte'],
      9: ['Energie als Erhaltungsgröße, Arbeit, Leistung', 'Atome: Photonen, Spektren, Energiestufen', 'Wärmelehre'],
      10: ['Elektromagnetismus', 'Impulserhaltung', 'Bewegungen modellieren', 'Kernphysik'],
      11: ['Kreisbewegung', 'Schwingungen & Wellen'],
      12: ['Elektrische & magnetische Felder', 'Induktion & Schwingungen', 'Elektromagnetische Wellen'],
      13: ['Grundideen der Quantenphysik', 'Quantenphysikalisches Atommodell', 'Aufbau der Materie', 'Kernphysik'],
    },
  },
  {
    id: 'mathe', name: 'Mathematik (Stochastik)', icon: 'DENK',
    topics: {
      6: ['Prozentrechnung, Daten & Diagramme'],
      7: ['Prozentrechnung vertieft', 'Kenngrößen von Daten'],
      9: ['Wahrscheinlichkeit verknüpfter Ereignisse'],
      10: ['Zusammengesetzte Zufallsexperimente'],
      11: ['Bedingte Wahrscheinlichkeit & Unabhängigkeit'],
    },
  },
  {
    id: 'gesch', name: 'Geschichte', icon: 'GESCH',
    topics: {
      6: ['Steinzeit', 'Ägypten – frühe Hochkultur', 'Griechische Antike', 'Imperium Romanum', 'Von der Antike zum Mittelalter'],
      7: ['Herrschaft im Mittelalter', 'Leben & Kultur im Mittelalter', 'Neue Horizonte: Entdeckungen & Renaissance', 'Konfessionelles Zeitalter', 'Absolutismus & Barock'],
      8: ['Aufklärung, Französische Revolution, Napoleon', 'Restauration & Revolution', 'Industrialisierung & Soziale Frage', 'Deutsches Kaiserreich', 'Imperialismus & Erster Weltkrieg'],
      9: ['Weimarer Republik', 'Nationalsozialismus, Zweiter Weltkrieg, Holocaust', 'Deutschland 1945–1949', 'Weltpolitik im Kalten Krieg'],
      10: ['Geteiltes Deutschland & Wiedervereinigung', 'Europäische Integration & globalisierte Welt'],
      11: ['Geschichte erinnern', 'Migration in Bayern'],
      12: ['Politische Partizipation seit dem 19. Jh.', 'Deutschland im 20. Jh. (Vertiefung)'],
      13: ['Akteure internationaler Politik', 'Grundlagen moderner politischer Ordnungen in Europa'],
    },
  },
  {
    id: 'geo', name: 'Geographie', icon: 'GEO',
    topics: {
      5: ['Planet Erde', 'Naturräume Bayerns & Deutschlands', 'Ländliche & städtische Räume'],
      7: ['Europa: Einheit & Vielfalt', 'Naturgeographie Europas', 'Metropolen, Meere & Küsten'],
      10: ['Leben in der Einen Welt', 'Klima- & Vegetationszonen der Tropen', 'Klima im Wandel', 'Nordafrika & Naher Osten', 'Afrika südlich der Sahara, Lateinamerika'],
      11: ['Globalisierung', 'USA, Russland, China, Australien'],
      12: ['Klima & Klimawandel', 'Tropen, Polargebiete, Hochgebirge', 'Tektonische Gefahren'],
      13: ['Globalisierte Wirtschaft', 'Ressourcen & Nachhaltigkeit', 'Bevölkerung & Migration', 'Stadtentwicklung'],
    },
  },
  {
    id: 'pug', name: 'Politik & Gesellschaft', icon: 'POL',
    topics: {
      10: ['Werte im demokratischen Staat', 'Politische Verantwortung', 'Politische Institutionen in Deutschland', 'Internationale Zusammenarbeit'],
      11: ['Demografischer Wandel', 'Willensbildung im Medienzeitalter', 'Demokratischer Rechtsstaat', 'Föderale Demokratie', 'Globales Zusammenleben'],
      12: ['Frieden & Sicherheit', 'Europäische Union', 'Politische Systeme im Vergleich', 'Demokratieförderung'],
      13: ['Modernisierung & Zusammenleben', 'Soziale Ungleichheit', 'Sozialstaat', 'Völkerrecht & Konfliktbearbeitung'],
    },
  },
  {
    id: 'wr', name: 'Wirtschaft & Recht', icon: 'WIRT',
    topics: {
      8: ['Knappheit & Opportunitätskosten', 'Unternehmen & Arbeitsteilung', 'Zivil- & Strafrecht'],
      9: ['Recht als Handlungsrahmen', 'Unternehmerisch entscheiden'],
      10: ['Marktmodell: Angebot, Nachfrage, Gleichgewichtspreis', 'Geldfunktionen & Geldwertstabilität', 'Recht im Alltag', 'Geschäftsmodell'],
      12: ['BWL', 'VWL', 'Recht'],
      13: ['Recht', 'VWL'],
    },
  },
  {
    id: 'rel', name: 'Ethik & Religion', icon: 'PHIL',
    topics: {
      5: ['Religionslehre: Bibel & Jesus Christus'],
      6: ['Ethik: Judentum & Christentum'],
      7: ['Ethik: Islam'],
      9: ['Ethik: Fernöstliche Religionen', 'Gewissen & Verantwortung'],
      10: ['Ursprünge des Philosophierens (Sokrates, Kants Fragen)', 'Religionsphilosophie', 'Wirtschaftsethik'],
      11: ['Philosophische Anthropologie', 'Politische Ethik', 'Medizinethik'],
      12: ['Theorie & Praxis des Handelns', 'Freiheit & Determination'],
      13: ['Recht & Gerechtigkeit', 'Sinnorientierung'],
    },
  },
  {
    id: 'deu', name: 'Deutsch', icon: 'LIT',
    topics: {
      9: ['Rhetorische Mittel'],
      10: ['Literatur der Aufklärung', 'Kommunikation & Rhetorik'],
      11: ['Barock, Aufklärung, Sturm und Drang'],
      13: ['Klassik & Romantik', 'Moderne bis Mitte des 20. Jh.'],
    },
  },
  {
    id: 'kunst', name: 'Kunst & Musik', icon: 'KUL',
    topics: {
      7: ['Musik: frühe Wiener Klassik'],
      8: ['Kunst: Renaissance & Barock'],
      9: ['Kunst: Klassizismus, Romantik, Realismus', 'Musik: Wiener Klassik & Romantik'],
      10: ['Kunst: Impressionismus & Wegbereiter der Moderne', 'Musik: Barock, Jazz, Kunstmusik 1890–1950'],
    },
  },
]

export function fach(id: FachId): Fach {
  return FAECHER.find((f) => f.id === id)!
}

/** Lernbereiche eines Fachs bis einschließlich Jahrgangsstufe `max` */
export function topicsUpTo(f: Fach, max: number): [number, string[]][] {
  return Object.entries(f.topics)
    .map(([g, t]) => [Number(g), t!] as [number, string[]])
    .filter(([g]) => g <= max)
    .sort((a, b) => a[0] - b[0])
}
