// Erzeugt die PWA-Icons (Globus mit Zeitstrahl) ohne Abhaengigkeiten.
import { writeFileSync } from 'node:fs'
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

function draw(size) {
  const bg = [28, 31, 38], orange = [232, 89, 12], light = [253, 235, 220]
  const px = Buffer.alloc(size * (size * 4 + 1))
  const S = 4 // Supersampling
  for (let y = 0; y < size; y++) {
    px[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      let acc = [0, 0, 0]
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const u = ((x + (sx + 0.5) / S) / size) * 2 - 1
        const v = ((y + (sy + 0.5) / S) / size) * 2 - 1
        let col = bg
        const r = Math.hypot(u, v), R = 0.56
        if (r < R) {
          col = orange
          const lw = 0.035
          // Meridiane (Ellipsen) und Breitenkreise
          const ex = (a) => Math.abs(Math.hypot(u / a, v) - R) < lw / Math.max(a, 0.3)
          if (Math.abs(u) < lw || ex(0.5 * R / R) || Math.abs(v) < lw || Math.abs(v - R * 0.5) < lw || Math.abs(v + R * 0.5) < lw) col = light
          if (r > R - lw * 1.2) col = light
        }
        // Zeitstrahl unten
        if (Math.abs(v - 0.74) < 0.03 && Math.abs(u) < 0.62) col = light
        for (const t of [-0.5, -0.17, 0.17, 0.5]) if (Math.hypot(u - t, v - 0.74) < 0.065) col = orange
        acc = acc.map((a, i) => a + col[i])
      }
      const o = y * (size * 4 + 1) + 1 + x * 4
      px[o] = acc[0] / (S * S); px[o + 1] = acc[1] / (S * S); px[o + 2] = acc[2] / (S * S); px[o + 3] = 255
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(px)), chunk('IEND', Buffer.alloc(0))])
}

for (const s of [192, 512]) writeFileSync(`public/icon-${s}.png`, draw(s))
writeFileSync('public/apple-touch-icon.png', draw(180))
console.log('Icons erzeugt')
