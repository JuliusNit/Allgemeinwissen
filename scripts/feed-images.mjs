// Fotos für „Entdecken“ (src/data/bites/*.ts) von Wikimedia Commons laden und verkleinern.
// Nur freie Lizenzen (gemeinfrei, CC0, CC BY, CC BY-SA); Urheber und Lizenz stehen in src/data/bites/img.ts.
// Ziel: public/feed/<name>.webp, max. 900 × 1100 px.
// Aufruf: node scripts/feed-images.mjs [name …]   (ohne Namen: alle fehlenden)
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.resolve('public/feed')
const UA = 'Allgemeinwissen-App/1.0 (https://github.com/JuliusNit/Allgemeinwissen)'

export const IMAGES = {
  "hund-schlaf": "File:Little Man the Pillow (5415264131).jpg",
  "baby-gaehnt": "File:Yawning Infant, August 2018.jpg",
  "schach": "File:Schachfiguren, Bauern -- 2022 -- 0022 (bw).jpg",
  "marshmallows": "File:White Marshmallows.jpg",
  "e-coli": "File:E. coli Bacteria (7316101966).jpg",
  "giraffen-necking": "File:Giraffe Ithala KZN South Africa Luca Galuzzi 2004.JPG",
  "mrt-gehirn": "File:MRI of Human Brain.jpg",
  "spinat": "File:Spinach leaves.jpg",
  "newton-baum": "File:Newton's Apple Tree - geograph.org.uk - 4299416.jpg",
  "orion": "File:The Orion Constellation.jpg",
  "gps-satellit": "File:GPS Satellite NASA art-iif.jpg",
  "goldbarren": "File:Gold Ingots on white background.jpg",
  "lachendes-kind": "File:Laughing Toddler (colorized).jpg",
  "gjermundbu-helm": "File:Cultural History (historisk) Museum Oslo. VIKINGR Norwegian Viking-Age Exhibition 08 Iron helmet from Gjermundbu (Gjermundbuhjelmen). Best-preserved viking helmet, grave find, destroyed in funeral. Equestrian warrior 950-1000. 4696.jpg",
  "veksoe-helm": "File:Bronzehjelm fra Veksø B13552- 00002.tif",
  "blaue-murmel": "File:The Earth seen from Apollo 17.jpg",
  "gizeh": "File:All Gizah Pyramids.jpg",
  "sokrates-buste": "File:Socrates Louvre.jpg",
  "pithoi-knossos": "File:Knossos pithoi pottery, Crete 001.JPG",
  "marc-aurel": "File:Rome Capitoline Marcus Aurelius statue original.jpg",
  "sanduhr": "File:Hourglass with sand.jpg",
  "laeufer": "File:Running Styles (8049103309).jpg",
  "globe-theatre": "File:London - Shakespeare's Globe Theatre Replica 1997.jpg",
  "lego": "File:Lego Color Bricks.jpg",
  "maerchenwald": "File:Dark Path (79235983).jpeg",
  "mona-lisa-louvre": "File:Tourists amidst Dense Crowd Taking Selfies in front of the Mona Lisa, Louvre, Paris.jpg",
  "geige": "File:Violin by Daniel Jason Karjadi.jpg",
  "reiten-wald": "File:Horse riding on the bridleway - geograph.org.uk - 5753156.jpg",
  "gerichtssaal": "File:Courtroom at Spangdahlem Air Base (8410867).jpg",
  "nato-flaggen": "File:160211-D-DT527-007 NATO country flags wave at the entrance of NATO headquarters in Brussels 2016.JPG",
  "wahlurne": "File:Ballot dropped into ballot box 2024 Swedish EU election at Stångenässkolan, Brastad.jpg",
  "tulpenfeld": "File:Red-Tulip Fields-Bollenstreek Hillegom.jpg",
  "kobra": "File:Indian Cobra Naja naja by Dr Raju Kasambe DSCN4991 (19).jpg",
  "euro": "File:One stands out 002 2025 01 01.jpg",
  "preisschilder": "File:Dual Price Labels - Leva and Euro 03.jpg",
  "goldfisch": "File:Carassius auratus auratus (goldfish) 2.jpg",
  "bibliothek": "File:Sias Library - Students Studying 2017.jpg",
  "storch": "File:White stork (Ciconia ciconia) in flight with transmitter.jpg",
  "ziege": "File:Closeup goat portrait.jpg",
  "everest": "File:Everest North Face toward Base Camp Tibet Luca Galuzzi 2006.jpg",
  "chinesische-mauer": "File:Great Wall of China July 2006.JPG",
  "erde-nachts": "File:Chicago, Illinois, pictured at night from the International Space Station (iss075e0099858).jpg",
  "pompeji-vesuv": "File:Forum (Pompeii) and the Vesuvio.jpg",
  "gutenberg-bibel": "File:Gutenberg Bible, New York Public Library, USA. Pic 01.jpg",
  "gluehfaden": "File:Low-key photograph of light bulb, Straume, Norway julesvernex2.jpg",
  "turing-statue": "File:Alan Turing by Stephen Kettle 2007.jpg",
  "blitz-eiffelturm": "File:Lightning striking the Eiffel Tower - NOAA.jpg",
  "logbuch-bug": "File:First Computer Bug, 1947.jpg",
  "napoleon-tuileries": "File:Jacques-Louis David - The Emperor Napoleon in His Study at the Tuileries - Google Art Project.jpg",
  "napoleon-alpen": "File:Jacques Louis David - Bonaparte franchissant le Grand Saint-Bernard, 20 mai 1800 - Google Art Project.jpg",
  "napoleon-maultier": "File:Paul Delaroche - Napoleon Crossing the Alps - Google Art Project.jpg",
  "gillray-gulliver": "File:James Gillray - The King of Brobdingnag and Gulliver - B1998.14.981 - Yale Center for British Art.jpg",
  "newton-kneller": "File:Portrait of Sir Isaac Newton, 1689.jpg",
  "wright-alchemist": "File:Joseph Wright of Derby The Alchemist.jpg",
  "lamarck": "File:Jean Baptiste Pierre Antoine de Monet Lamarck. Photogravure Wellcome L0020766.jpg",
  "darwin": "File:Charles Darwin by Julia Margaret Cameron, c. 1868.jpg",
  "rubens-thetis": "File:Peter Paul Rubens 181.jpg",
  "tizian-sisyphos": "File:Titian - Sisyphus - Madrid - Prado.jpg",
  "grimm-brueder": "File:Alte Nationalgalerie-Jerichau-Baumann-Gebrüder Grimm DSC8174.jpg",
  "mona-lisa": "File:Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg",
  "van-gogh-verband": "File:Vincent van Gogh - Self-Portrait with Bandaged Ear 1889 - Google Art Project.jpg",
  "nachtwache": "File:The Nightwatch by Rembrandt - Rijksmuseum.jpg",
  "mozart": "File:Barbara Krafft - Porträt Wolfgang Amadeus Mozart (1819).jpg",
  "shakespeare": "File:Shakespeare.jpg",
  "sokrates-tod": "File:The Death of Socrates MET DT40.jpg",
  "diogenes-gerome": "File:Jean-Léon Gérôme - Diogenes - Walters 37131.jpg",
  "bruegel-jaeger": "File:Pieter Bruegel the Elder - Hunters in the Snow (Winter) - Google Art Project.jpg",
  "hondius-themse": "File:The Frozen Thames 1677 by Abraham Hondius.jpg",
  "tulpen-satire": "File:Jan Brueghel the Younger, Satire on Tulip Mania, c. 1640.jpg",
  "bryullov-pompeji": "File:Karl Brullov - The Last Day of Pompeii - Google Art Project.jpg",
  "flammarion": "File:FlammarionWoodcut.jpg",
  "edison": "File:Edison and phonograph edit2.jpg",
  "swan": "File:Joseph Wilson Swan (HeidICON 33578).jpg",
  "grace-hopper": "File:Commodore Grace M. Hopper, USN (covered).jpg",
  "einstein": "File:Einstein 1921 by F Schmutzer - restoration.jpg",
  "van-gogh-sonnenblumen": "File:Vincent van Gogh - Sunflowers (1888, National Gallery London).jpg",
  "himmel-blau": "File:Colorful sky with orange clouds reflecting in the water of a paddy field, at sunset, Vang Vieng, Laos.jpg",
  "rayleigh": "File:John William Strutt, Lord Rayleigh. Photograph by Elliott & F Wellcome V0027060.jpg",
  "regenbogen": "File:Double rainbow Hertfordshire England.jpg",
  "descartes": "File:Frans Hals - Portret van René Descartes.jpg",
  "nebelbogen": "File:Fogbow in Florida.jpg",
  "flugzeug": "File:EI-RJU Cityjet British Aerospace Avro RJ85, takeoff from Schiphol (EHAM-AMS) runway 36L pic2.JPG",
  "wirbelschleppe": "File:Airplane vortex edit.jpg",
  "a380": "File:Qantas a380 vh-oqa takeoff heathrow arp.jpg",
  "iss-astronauten": "File:Astronaut Nichole Ayers poses for a portrait inside the Kibo laboratory module (iss072e978952).jpg",
  "ebbe": "File:Langstone Harbour at Southsea during low tide.JPG",
  "fundy": "File:Hopewell Rocks New Brunswick (25194250697).jpg",
  "winter": "File:Russia, Ust-Orda, Kutulik - Голуметь WMID6786307.jpg",
  "mitternachtssonne": "File:Midnight sun in Tromsø.jpg",
  "mond-vorderseite": "File:Moon nearside LRO color mosaic.png",
  "mond-rueckseite": "File:527006main farside.1600.jpg",
  "sonne-sdo": "File:Full disk of the Sun (eso1703e-comparisona).jpg",
  "superkamiokande": "File:Neutrino detector - National Museum of Nature and Science, Tokyo - DSC07824.JPG",
  "milchstrasse": "File:035 Vertical panorama of the Milky Way during Perseids seen from Oeschinensee Photo by Giles Laurent.jpg",
  "olbers": "File:Heinrich Wilhelm Matthias Olbers. Lithograph. Wellcome V0004359.jpg",
  "poe": "File:Edgar Allan Poe, circa 1849, restored, squared off.jpg",
  "hornantenne": "File:Horn Antenna-in Holmdel, New Jersey - restoration1.jpg",
  "ernst-mach": "File:Mach, Ernst (1905).jpg",
  "concorde": "File:Tupolev Tu-144 (4322159916).jpg",
  "schneeflocke": "File:Snowflake macro photography 1.jpg",
  "eisberg": "File:Iceberg-Antarctica IMG 4445c.jpg",
  "zwiebel": "File:Chopped onions on a cutting board with knife.jpg",
  "kerze": "File:Burning In Wind (19536039).jpeg",
  "faraday": "File:Michael Faraday sitting crop.jpg",
  "seifenblasen": "File:Reflection in a soap bubble edit.jpg",
  "streusalz": "File:CBJ Plow truck 3149.jpg",
  "meereis": "File:North Pole, Arctic Ocean, sea ice 03.jpg",
  "popcorn": "File:Day 356 - Photo365 - Popcorn (23894551246).jpg",
  "rost": "File:Mouette tridactyle (Rissa tridactyla) (Ifremer 00555-66706 - 18914).jpg",
  "freiheitsstatue": "File:LibertyStatue.JPG",
  "mars-oberflaeche": "File:PIA26554A-Mars-CuriosityRover-UbajaraSite-20230430.jpg",
  "steak": "File:Crowd Cow seared steak in a cast iron pan.jpg",
  "brezel": "File:Pretzel, Auntie Annes, Kingston MA.jpg",
  "eiche": "File:Solitary oak tree at Hangthwaite - geograph.org.uk - 7153805.jpg",
  "van-helmont": "File:John Baptist van Helmont, PA07845.jpg",
  "baby": "File:Newborn baby sleeps in a basket.jpg",
  "leguan": "File:Male Agama Lizard (2405318648).jpg",
  "krake": "File:Pulpo común (Octopus vulgaris), Parque natural de la Arrábida, Portugal, 2020-07-21, DD 33.jpg",
  "dna-modell": "File:20251019 Replica DNA double helix model Berlin 03.jpg",
  "karyogramm": "File:Human karyotype (248 27) Human karyotype.jpg",
  "blaues-auge": "File:A blue eye.jpg",
}
async function thumb(title) {
  try {
    return await fromApi(title)
  } catch (e) {
    if (!/429|JSON|fetch/i.test(String(e.message))) throw e
    return await fromPage(title)
  }
}

async function fromApi(title) {
  const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', titles: title, prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1400',
    iiextmetadatafilter: 'LicenseShortName',
  })
  const r = await fetch(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) })
  if (r.status === 429) throw new Error('429')
  const j = await r.json()
  const ii = Object.values(j.query.pages)[0].imageinfo?.[0]
  if (!ii) throw new Error(`nicht gefunden: ${title}`)
  const lic = ii.extmetadata?.LicenseShortName?.value ?? ''
  if (!FREE.test(lic)) throw new Error(`keine freie Lizenz (${lic}): ${title}`)
  return ii.thumburl ?? ii.url
}

// Ausweg, wenn die API gedrosselt ist: Lizenz und Originaldatei von der Dateiseite lesen
async function fromPage(title) {
  const r = await fetch(`https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${title}`)
  const html = (await r.text()).replace(/&#95;/g, '_')
  const lics = [...html.matchAll(/licensetpl_short"[^>]*>([^<]*)</g)].map((m) => m[1].trim())
  if (!lics.some((l) => FREE.test(l))) throw new Error(`keine freie Lizenz (${lics.join(', ')}): ${title}`)
  const m = html.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[0-9a-f]\/[0-9a-f]{2}\/[^"?]+/)
  if (!m) throw new Error(`keine Datei: ${title}`)
  return m[0]
}

const FREE = /public domain|^pd|cc0|no restrictions|^cc by(-sa)? [\d.]+/i

const only = process.argv.slice(2)
fs.mkdirSync(OUT, { recursive: true })
for (const [name, title] of Object.entries(IMAGES)) {
  const file = path.join(OUT, `${name}.webp`)
  if (only.length ? !only.includes(name) : fs.existsSync(file)) continue
  try {
    let url = await thumb(title)
    let res
    for (let i = 0; i < 6; i++) {
      res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) })
      if (res.status !== 429) break
      // Vorschaugrößen werden bei Last gedrosselt – dann die Originaldatei nehmen
      if (i === 1 && url.includes('/thumb/')) url = await fromPage(title)
      await new Promise((r) => setTimeout(r, 4000 * (i + 1)))
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await sharp(buf).resize({ width: 900, height: 1100, fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 }).toFile(file)
    console.log(`✓ ${name} (${Math.round(fs.statSync(file).size / 1024)} KB)`)
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, 600))
}
