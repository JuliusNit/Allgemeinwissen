// Baut die App und kopiert dist/ in die nativen Projekte (ios/, android/): `npm run cap:sync`.
// Danach: `npx cap open android` (Android Studio) bzw. auf dem Mac/Codemagic `npx cap open ios`.
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

// Rest vom gh-pages-Deploy (dist/.git) nicht mit in die App packen
if (existsSync('dist/.git')) rmSync('dist/.git', { recursive: true, force: true })
if (!existsSync('.env')) console.warn('Hinweis: keine .env – die App läuft dann ohne Server (kein Konto, keine KI).')

run('npm run build')

// Sicherung: kein LLM-Key (sk-…) in der App
const leak = readdirSync('dist', { recursive: true }).filter((f) => /\.(js|html|json|webmanifest)$/.test(f)).find((f) => /sk-[a-z]+-[0-9a-f]{20,}/i.test(readFileSync(`dist/${f}`, 'utf8')))
if (leak) {
  console.error(`Abbruch: API-Key im Build gefunden (dist/${leak})`)
  process.exit(1)
}
run(`npx cap sync ${process.argv.slice(2).join(' ')}`)
