// Prüft die Häppchen in „Entdecken“: rendert jede Szene im Endzustand (scripts/bites-check.html), meldet
// Überschneidungen und Dauer, legt je Häppchen einen Kontaktbogen als PNG ab.
// node scripts/bites-check.mjs [--out <ordner>] [--neu] [id …]   (ohne id: alle; --neu: nur die 2-Minuten-Häppchen)
// Playwright muss erreichbar sein (z. B. global installiert, NODE_PATH setzen).
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createServer } from 'vite'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const args = process.argv.slice(2)
const oi = args.indexOf('--out')
const out = oi >= 0 ? args.splice(oi, 2)[1] : 'bites-check'
const neu = args.includes('--neu')
const ids0 = args.filter((a) => !a.startsWith('--'))
mkdirSync(out, { recursive: true })

const server = await createServer({ server: { port: 5199 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {})
const ctx = await browser.newContext({ viewport: { width: 2300, height: 1600 }, deviceScaleFactor: 0.5 })
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('Seitenfehler:', e.message))
await page.goto('http://localhost:5199/scripts/bites-check.html')
await page.waitForFunction(() => typeof window.checkBite === 'function')
let ids = ids0.length ? ids0 : await page.evaluate(() => window.biteIds())
if (neu) ids = await page.evaluate(() => window.biteIds(true))

let total = 0
for (const id of ids) {
  await page.goto(`http://localhost:5199/scripts/bites-check.html`)
  await page.waitForFunction(() => typeof window.checkBite === 'function')
  const dur = await page.evaluate((i) => window.biteDurations(i), id)
  await page.goto(`http://localhost:5199/scripts/bites-check.html`)
  await page.waitForFunction(() => typeof window.checkBite === 'function')
  const issues = await page.evaluate((i) => window.checkBite(i), id)
  await page.locator('#sheet').screenshot({ path: join(out, `${id}.png`) })
  const sec = dur.reduce((a, b) => a + b, 0) / 1000
  total += issues.length
  console.log(`${id}: ${dur.length} Szenen, ${sec.toFixed(0)} s${issues.length ? '' : ', ok'}`)
  for (const x of issues) console.log(`  ${x.scene}: ${x.kind} ${x.what}`)
}
console.log(`${ids.length} Häppchen, ${total} Befunde`)
await browser.close()
await server.close()
