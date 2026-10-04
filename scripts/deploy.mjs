// Baut die App und veroeffentlicht dist/ auf dem Branch gh-pages (GitHub Pages).
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd })
const remote = execSync('git remote get-url origin').toString().trim()

run('npm run build')

// Sicherung: kein LLM-Key (sk-…) im oeffentlichen Build
const leak = readdirSync('dist', { recursive: true }).filter((f) => /\.(js|html|json|webmanifest)$/.test(f)).find((f) => /sk-[a-z]+-[0-9a-f]{20,}/i.test(readFileSync(`dist/${f}`, 'utf8')))
if (leak) {
  console.error(`Abbruch: API-Key im Build gefunden (dist/${leak})`)
  process.exit(1)
}
writeFileSync('dist/.nojekyll', '')
run('git init -q -b gh-pages', 'dist')
run('git add -A', 'dist')
run('git commit -q -m "Deploy"', 'dist')
// gh-pages enthaelt nur Build-Ergebnisse, deshalb wird der Branch bei jedem Deploy ersetzt
run(`git push -f -q ${remote} gh-pages`, 'dist')
console.log('Veröffentlicht auf gh-pages')
