// Erzeugt die Icons (Globus mit Zeitstrahl) ohne Abhaengigkeiten:
// - PWA (public/): dunkel/orange wie bisher
// - native App (assets/ → `npm run cap:assets` verteilt sie mit @capacitor/assets nach ios/ und android/):
//   schwarz auf weiss, dazu Vordergrund/Hintergrund fuer adaptive Android-Icons und der Startbildschirm
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td))
  return Buffer.concat([len, td, c])
}

const PWA = { bg: [28, 31, 38, 255], fill: [232, 89, 12, 255], line: [253, 235, 220, 255], dot: [232, 89, 12, 255], lw: 0.035 }
const INK = { bg: [255, 255, 255, 255], fill: [255, 255, 255, 255], line: [0, 0, 0, 255], dot: [0, 0, 0, 255], lw: 0.045 }

/** scale < 1 verkleinert das Motiv (Schutzzone adaptiver Icons, Startbildschirm); clear = Hintergrund durchsichtig */
function draw(size, theme, { scale = 1, clear = false, S = 4 } = {}) {
  const bg = clear ? [0, 0, 0, 0] : theme.bg
  const px = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    px[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0, 0]
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const u = (((x + (sx + 0.5) / S) / size) * 2 - 1) / scale
        const v = (((y + (sy + 0.5) / S) / size) * 2 - 1) / scale
        let col = bg
        const r = Math.hypot(u, v), R = 0.56
        if (r < R) {
          col = theme.fill
          const lw = theme.lw
          // Meridiane (Ellipsen) und Breitenkreise
          const ex = (a) => Math.abs(Math.hypot(u / a, v) - R) < lw / Math.max(a, 0.3)
          if (Math.abs(u) < lw || ex(0.5 * R / R) || Math.abs(v) < lw || Math.abs(v - R * 0.5) < lw || Math.abs(v + R * 0.5) < lw) col = theme.line
          if (r > R - lw * 1.2) col = theme.line
        }
        // Zeitstrahl unten
        if (Math.abs(v - 0.74) < 0.03 && Math.abs(u) < 0.62) col = theme.line
        for (const t of [-0.5, -0.17, 0.17, 0.5]) if (Math.hypot(u - t, v - 0.74) < 0.065) col = theme.dot
        // vormultipliziert mitteln, damit durchsichtige Kanten nicht dunkel werden
        acc[0] += col[0] * col[3]; acc[1] += col[1] * col[3]; acc[2] += col[2] * col[3]; acc[3] += col[3]
      }
      const o = y * (size * 4 + 1) + 1 + x * 4
      const a = acc[3]
      px[o] = a ? acc[0] / a : 0; px[o + 1] = a ? acc[1] / a : 0; px[o + 2] = a ? acc[2] / a : 0; px[o + 3] = a / (S * S)
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(px)), chunk('IEND', Buffer.alloc(0))])
}

for (const s of [192, 512]) writeFileSync(`public/icon-${s}.png`, draw(s, PWA))
writeFileSync('public/apple-touch-icon.png', draw(180, PWA))

mkdirSync('assets', { recursive: true })
writeFileSync('assets/icon-only.png', draw(1024, INK))
// Android adaptiv: @capacitor/assets setzt den Vordergrund schon mit 16,7 % Rand ein (Schutzzone), deshalb nur leicht kleiner
writeFileSync('assets/icon-foreground.png', draw(1024, INK, { scale: 0.9, clear: true }))
writeFileSync('assets/icon-background.png', draw(1024, { ...INK, line: INK.bg, dot: INK.bg }, { scale: 0.01, S: 1 }))
const splash = draw(2732, INK, { scale: 0.2, S: 2 })
writeFileSync('assets/splash.png', splash)
writeFileSync('assets/splash-dark.png', splash)
console.log('Icons erzeugt')
