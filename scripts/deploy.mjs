// Baut die App und veroeffentlicht dist/ auf dem Branch gh-pages (GitHub Pages).
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd })
const remote = execSync('git remote get-url origin').toString().trim()

run('npm run build')
writeFileSync('dist/.nojekyll', '')
run('git init -q -b gh-pages', 'dist')
run('git add -A', 'dist')
run('git commit -q -m "Deploy"', 'dist')
// gh-pages enthaelt nur Build-Ergebnisse, deshalb wird der Branch bei jedem Deploy ersetzt
run(`git push -f -q ${remote} gh-pages`, 'dist')
console.log('Veröffentlicht auf gh-pages')
