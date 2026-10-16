// Bild-PDF ohne Bibliothek: das Lernzettel-Bild (PNG) in A4-Seiten schneiden, jede Seite als JPEG einbetten.
// Gebraucht in der nativen App – window.print() tut im iOS-WebView nichts.

const PAGE_W = 595.28 // A4 in Punkt
const PAGE_H = 841.89
const MARGIN = 28

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => (URL.revokeObjectURL(url), resolve(img))
    img.onerror = () => (URL.revokeObjectURL(url), reject(new Error('Bild nicht lesbar')))
    img.src = url
  })
}

async function jpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.9))
  if (!blob) throw new Error('JPEG nicht erzeugt')
  return new Uint8Array(await blob.arrayBuffer())
}

/** PNG (z. B. aus html-to-image) → PDF-Blob mit so vielen A4-Seiten wie noetig */
export async function imagePdf(png: Blob, title: string): Promise<Blob> {
  const img = await loadImage(png)
  const drawW = PAGE_W - 2 * MARGIN
  const scale = drawW / img.naturalWidth // Punkt je Bildpixel
  const sliceH = Math.floor((PAGE_H - 2 * MARGIN) / scale)
  const pages: { data: Uint8Array; w: number; h: number }[] = []
  for (let y = 0; y < img.naturalHeight; y += sliceH) {
    const h = Math.min(sliceH, img.naturalHeight - y)
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = h
    const g = c.getContext('2d')!
    g.fillStyle = '#fff'
    g.fillRect(0, 0, c.width, h)
    g.drawImage(img, 0, y, c.width, h, 0, 0, c.width, h)
    pages.push({ data: await jpeg(c), w: c.width, h })
  }

  const enc = new TextEncoder()
  const parts: Uint8Array[] = []
  const offsets: number[] = []
  let size = 0
  const push = (p: Uint8Array | string) => {
    const b = typeof p === 'string' ? enc.encode(p) : p
    parts.push(b)
    size += b.length
  }
  const obj = (n: number, body: string, stream?: Uint8Array) => {
    offsets[n] = size
    push(`${n} 0 obj\n${body}\n`)
    if (stream) {
      push('stream\n')
      push(stream)
      push('\nendstream\n')
    }
    push('endobj\n')
  }
  // Titel als UTF-16 mit BOM (Umlaute)
  const hexTitle = 'FEFF' + title.split('').map((ch) => ch.charCodeAt(0).toString(16).padStart(4, '0')).join('')

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  const n = pages.length
  // 1 Katalog, 2 Seitenbaum, 3 Info, je Seite: Seite, Inhalt, Bild
  const kids = pages.map((_, i) => `${4 + i * 3} 0 R`).join(' ')
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>')
  obj(2, `<< /Type /Pages /Kids [${kids}] /Count ${n} >>`)
  obj(3, `<< /Title <${hexTitle}> /Producer (Allgemeinwissen) >>`)
  pages.forEach((p, i) => {
    const page = 4 + i * 3
    const w = drawW
    const h = p.h * scale
    const content = enc.encode(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${MARGIN} ${(PAGE_H - MARGIN - h).toFixed(2)} cm /Im0 Do Q`)
    obj(page, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /XObject << /Im0 ${page + 2} 0 R >> >> /Contents ${page + 1} 0 R >>`)
    obj(page + 1, `<< /Length ${content.length} >>`, content)
    obj(page + 2, `<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.data.length} >>`, p.data)
  })
  const count = 4 + n * 3
  const xref = size
  push(`xref\n0 ${count}\n0000000000 65535 f \n`)
  for (let i = 1; i < count; i++) push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${count} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`)
  return new Blob(parts as BlobPart[], { type: 'application/pdf' })
}
