// Ton für „Entdecken“: alles live mit Web Audio erzeugt – keine Audiodateien, keine Lizenzen.
// Drei Ebenen: Musik je Stimmung (Akkordfläche, Bass, gezupfte Töne), Geräuschkulisse je Thema
// (Regen, Wellen, Herzschlag …) und kurze Effekte, die die Bewegungen auf dem Bild begleiten.
import type { Ambience, Mood } from '../data/feed'

let ctx: AudioContext | null = null
let master: GainNode
let musicBus: GainNode
let ambBus: GainNode
let fxBus: GainNode
let reverb: ConvolverNode
let enabled = true

const MUSIC = 0.16
const AMB = 0.11
const FX = 0.32

function ac(): AudioContext | null {
  if (ctx) return ctx
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16
  comp.ratio.value = 4
  comp.connect(ctx.destination)
  master = ctx.createGain()
  master.gain.value = enabled ? 1 : 0
  master.connect(comp)
  reverb = ctx.createConvolver()
  reverb.buffer = impulse(ctx, 2.6)
  const wet = ctx.createGain()
  wet.gain.value = 0.32
  reverb.connect(wet).connect(master)
  musicBus = bus(MUSIC)
  ambBus = bus(AMB)
  fxBus = bus(FX)
  return ctx
}

function bus(level: number): GainNode {
  const g = ctx!.createGain()
  g.gain.value = level
  g.connect(master)
  g.connect(reverb)
  return g
}

function impulse(c: AudioContext, sec: number): AudioBuffer {
  const len = Math.floor(c.sampleRate * sec)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  }
  return buf
}

/** Browser erlauben Ton erst nach einer Berührung: beim ersten Antippen irgendwo freischalten */
export function unlockAudio() {
  const c = ac()
  if (c && c.state === 'suspended') void c.resume()
}

export function setSound(on: boolean) {
  enabled = on
  const c = ac()
  if (!c) return
  master.gain.cancelScheduledValues(c.currentTime)
  master.gain.setTargetAtTime(on ? 1 : 0, c.currentTime, 0.08)
  if (on) unlockAudio()
}

/** Pause (Finger gehalten, App im Hintergrund): Musik leiser, Kulisse bleibt */
export function duck(on: boolean) {
  const c = ctx
  if (!c) return
  musicBus.gain.setTargetAtTime(on ? MUSIC * 0.35 : MUSIC, c.currentTime, 0.2)
}

// ───────────── Rauschen ─────────────

const noiseCache = new Map<string, AudioBuffer>()

function noise(kind: 'weiss' | 'rosa' | 'braun'): AudioBuffer {
  const c = ctx!
  const hit = noiseCache.get(kind)
  if (hit) return hit
  const len = c.sampleRate * 4
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, last = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    if (kind === 'weiss') d[i] = w
    else if (kind === 'rosa') {
      b0 = 0.997 * b0 + w * 0.029591
      b1 = 0.985 * b1 + w * 0.032534
      b2 = 0.95 * b2 + w * 0.048056
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.9
    } else {
      last = (last + 0.02 * w) / 1.02
      d[i] = last * 3.5
    }
  }
  noiseCache.set(kind, buf)
  return buf
}

function noiseSrc(kind: 'weiss' | 'rosa' | 'braun', loop = true): AudioBufferSourceNode {
  const s = ctx!.createBufferSource()
  s.buffer = noise(kind)
  s.loop = loop
  return s
}

// ───────────── Töne ─────────────

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

function tone(dest: AudioNode, midi: number, t: number, dur: number, opt: { type?: OscillatorType; vol?: number; a?: number; r?: number; detune?: number; cutoff?: number } = {}) {
  const c = ctx!
  const o = c.createOscillator()
  o.type = opt.type ?? 'triangle'
  o.frequency.value = hz(midi)
  if (opt.detune) o.detune.value = opt.detune
  const g = c.createGain()
  const a = opt.a ?? 0.005
  const r = opt.r ?? dur
  const v = opt.vol ?? 0.3
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(v, t + a)
  g.gain.setTargetAtTime(0, t + Math.max(a, dur - r * 0.3), r / 3)
  let node: AudioNode = o
  if (opt.cutoff) {
    const f = c.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = opt.cutoff
    o.connect(f)
    node = f
  }
  node.connect(g).connect(dest)
  o.start(t)
  o.stop(t + dur + r + 0.1)
}

// ───────────── Musik ─────────────

interface MoodDef {
  bpm: number
  /** Akkorde als MIDI-Töne, je 2 Takte */
  chords: number[][]
  /** Tonleiter für die gezupften Töne */
  scale: number[]
  /** Wahrscheinlichkeit eines gezupften Tons je Achtel */
  pluck: number
  kick?: boolean
  shimmer?: boolean
  pad: OscillatorType
  cutoff: number
}

const MOODS: Record<Mood, MoodDef> = {
  ruhig: { bpm: 70, chords: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]], scale: [72, 74, 76, 79, 81, 84], pluck: 0.28, pad: 'sine', cutoff: 1400 },
  raetsel: { bpm: 76, chords: [[57, 60, 64, 71], [53, 57, 60, 64], [50, 53, 57, 60], [52, 56, 59, 62]], scale: [69, 71, 72, 76, 77, 81], pluck: 0.32, pad: 'triangle', cutoff: 1100 },
  hell: { bpm: 100, chords: [[62, 66, 69, 74], [57, 61, 64, 69], [59, 62, 66, 71], [55, 59, 62, 67]], scale: [74, 76, 78, 81, 83, 86], pluck: 0.5, pad: 'triangle', cutoff: 2200 },
  episch: { bpm: 84, chords: [[50, 57, 62, 65], [46, 53, 58, 62], [53, 57, 60, 65], [48, 55, 60, 64]], scale: [69, 72, 74, 77, 81], pluck: 0.3, kick: true, pad: 'sawtooth', cutoff: 900 },
  verspielt: { bpm: 112, chords: [[53, 57, 60, 65], [55, 59, 62, 67], [52, 55, 59, 64], [57, 60, 64, 69]], scale: [72, 74, 77, 79, 81, 84], pluck: 0.55, kick: true, pad: 'triangle', cutoff: 2600 },
  kosmisch: { bpm: 60, chords: [[52, 59, 64, 66], [48, 55, 59, 64], [55, 62, 67, 71], [50, 57, 62, 67]], scale: [76, 78, 79, 83, 86, 88], pluck: 0.2, shimmer: true, pad: 'sine', cutoff: 1600 },
  dunkel: { bpm: 64, chords: [[48, 51, 55, 60], [44, 48, 51, 56], [51, 55, 58, 63], [46, 50, 53, 58]], scale: [63, 65, 67, 70, 72, 75], pluck: 0.22, kick: true, pad: 'sawtooth', cutoff: 700 },
}

interface Running {
  out: GainNode
  stop: () => void
}

let music: Running | null = null
let amb: Running | null = null

function fadeOut(r: Running | null, sec = 1.2) {
  if (!r || !ctx) return
  const t = ctx.currentTime
  r.out.gain.cancelScheduledValues(t)
  r.out.gain.setValueAtTime(r.out.gain.value, t)
  r.out.gain.linearRampToValueAtTime(0, t + sec)
  setTimeout(r.stop, sec * 1000 + 100)
}

function startMusic(mood: Mood): Running {
  const c = ctx!
  const m = MOODS[mood]
  const out = c.createGain()
  out.gain.setValueAtTime(0, c.currentTime)
  out.gain.linearRampToValueAtTime(1, c.currentTime + 2)
  out.connect(musicBus)
  const beat = 60 / m.bpm
  const bar = beat * 4
  let next = c.currentTime + 0.05
  let step = 0
  let seed = 1
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const tick = () => {
    while (next < c.currentTime + 0.4) {
      const eighth = step % 8
      const chord = m.chords[Math.floor(step / 16) % m.chords.length]
      if (step % 16 === 0) {
        // Akkordflaeche ueber zwei Takte, leicht verstimmt doppelt
        for (const n of chord) {
          tone(out, n, next, bar * 2, { type: m.pad, vol: 0.07, a: 1.2, r: 1.6, detune: -6, cutoff: m.cutoff })
          tone(out, n, next, bar * 2, { type: m.pad, vol: 0.06, a: 1.4, r: 1.6, detune: 7, cutoff: m.cutoff })
        }
        tone(out, chord[0] - 12, next, bar * 2, { type: 'sine', vol: 0.22, a: 0.3, r: 1 })
        if (m.shimmer) tone(out, chord[3] + 24, next + beat, bar * 1.5, { type: 'sine', vol: 0.035, a: 2, r: 2 })
      }
      if (m.kick && eighth % 4 === 0) kick(out, next, mood === 'dunkel' ? 0.5 : 0.35)
      if (rnd() < m.pluck && step % 2 === 0) {
        const n = m.scale[Math.floor(rnd() * m.scale.length)]
        tone(out, n, next, beat * 1.5, { type: 'triangle', vol: 0.09, a: 0.004, r: beat * 1.2, cutoff: 3200 })
      }
      next += beat / 2
      step++
    }
  }
  tick()
  const id = window.setInterval(tick, 100)
  return { out, stop: () => { clearInterval(id); out.disconnect() } }
}

function kick(dest: AudioNode, t: number, vol: number) {
  const c = ctx!
  const o = c.createOscillator()
  const g = c.createGain()
  o.frequency.setValueAtTime(110, t)
  o.frequency.exponentialRampToValueAtTime(42, t + 0.18)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  o.connect(g).connect(dest)
  o.start(t)
  o.stop(t + 0.4)
}

// ───────────── Geräuschkulisse ─────────────

function lfo(target: AudioParam, rate: number, depth: number) {
  const c = ctx!
  const o = c.createOscillator()
  o.frequency.value = rate
  const g = c.createGain()
  g.gain.value = depth
  o.connect(g).connect(target)
  o.start()
  return o
}

function startAmbience(kind: Ambience): Running {
  const c = ctx!
  const out = c.createGain()
  out.gain.setValueAtTime(0, c.currentTime)
  out.gain.linearRampToValueAtTime(1, c.currentTime + 2.5)
  out.connect(ambBus)
  const nodes: (AudioScheduledSourceNode)[] = []
  const timers: number[] = []
  const filt = (type: BiquadFilterType, f: number, q = 0.7) => {
    const b = c.createBiquadFilter()
    b.type = type
    b.frequency.value = f
    b.Q.value = q
    return b
  }
  const bed = (kind: 'weiss' | 'rosa' | 'braun', f: BiquadFilterNode, vol: number) => {
    const s = noiseSrc(kind)
    const g = c.createGain()
    g.gain.value = vol
    s.connect(f).connect(g).connect(out)
    s.start()
    nodes.push(s)
    return g
  }
  const every = (ms: number, jitter: number, fn: (t: number) => void) => {
    const run = () => {
      fn(c.currentTime + 0.05)
      timers.push(window.setTimeout(run, ms + Math.random() * jitter))
    }
    timers.push(window.setTimeout(run, 300 + Math.random() * jitter))
  }
  const blip = (t: number, f: number, dur: number, vol: number, type: OscillatorType = 'sine', glide?: number) => {
    const o = c.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f, t)
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur)
    const g = c.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
    o.connect(g).connect(out)
    o.start(t)
    o.stop(t + dur + 0.05)
  }
  const click = (t: number, f: number, vol: number) => {
    const s = noiseSrc('weiss', false)
    const b = filt('bandpass', f, 4)
    const g = c.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.04)
    s.connect(b).connect(g).connect(out)
    s.start(t, Math.random() * 3, 0.06)
  }

  switch (kind) {
    case 'regen':
      bed('weiss', filt('highpass', 900), 0.35)
      every(60, 120, (t) => click(t, 2500 + Math.random() * 3000, 0.25))
      break
    case 'wellen': {
      const g = bed('braun', filt('lowpass', 700), 0.6)
      g.gain.value = 0.35
      nodes.push(lfo(g.gain, 0.09, 0.3))
      break
    }
    case 'wind': {
      const f = filt('bandpass', 500, 1.2)
      bed('rosa', f, 0.8)
      nodes.push(lfo(f.frequency, 0.07, 280))
      break
    }
    case 'herz':
      every(950, 0, (t) => {
        kick(out, t, 0.5)
        kick(out, t + 0.22, 0.32)
      })
      break
    case 'uhr': {
      let hi = true
      every(1000, 0, (t) => {
        click(t, hi ? 3200 : 2400, 0.5)
        hi = !hi
      })
      break
    }
    case 'feuer':
      bed('braun', filt('lowpass', 500), 0.5)
      every(90, 260, (t) => click(t, 1200 + Math.random() * 4000, 0.15 + Math.random() * 0.3))
      break
    case 'stadt':
      bed('braun', filt('lowpass', 380), 0.7)
      bed('rosa', filt('bandpass', 1200, 0.5), 0.05)
      every(5000, 7000, (t) => blip(t, 330 + Math.random() * 60, 0.6, 0.03, 'sawtooth'))
      break
    case 'nacht':
      bed('braun', filt('lowpass', 300), 0.25)
      every(1400, 1800, (t) => {
        for (let k = 0; k < 3; k++) blip(t + k * 0.07, 4400 + Math.random() * 200, 0.05, 0.05)
      })
      break
    case 'blasen':
      bed('braun', filt('lowpass', 400), 0.3)
      every(260, 700, (t) => blip(t, 300 + Math.random() * 500, 0.12, 0.08, 'sine', 900 + Math.random() * 900))
      break
    case 'weltraum': {
      const f = filt('lowpass', 400)
      bed('rosa', f, 0.3)
      nodes.push(lfo(f.frequency, 0.04, 260))
      for (const d of [-8, 9]) {
        const o = c.createOscillator()
        o.frequency.value = 55
        o.detune.value = d
        const g = c.createGain()
        g.gain.value = 0.12
        o.connect(g).connect(out)
        o.start()
        nodes.push(o)
      }
      break
    }
    case 'glocke':
      every(6500, 4000, (t) => {
        const base = [196, 220, 262][Math.floor(Math.random() * 3)]
        for (const [k, v] of [[1, 0.12], [2.76, 0.05], [5.4, 0.03], [0.5, 0.06]] as const) blip(t, base * k, 4, v)
      })
      break
    case 'atem': {
      const f = filt('bandpass', 700, 0.8)
      const g = bed('rosa', f, 0.4)
      g.gain.value = 0.25
      nodes.push(lfo(g.gain, 0.22, 0.24))
      nodes.push(lfo(f.frequency, 0.22, 250))
      break
    }
  }
  return {
    out,
    stop: () => {
      timers.forEach(clearTimeout)
      nodes.forEach((n) => { try { n.stop() } catch { /* schon gestoppt */ } })
      out.disconnect()
    },
  }
}

/** Neues Häppchen: Musik und Kulisse überblenden */
export function startBite(mood: Mood, ambience?: Ambience) {
  const c = ac()
  if (!c) return
  fadeOut(music)
  fadeOut(amb)
  music = startMusic(mood)
  amb = ambience ? startAmbience(ambience) : null
}

export function stopAll() {
  fadeOut(music, 0.6)
  fadeOut(amb, 0.6)
  music = null
  amb = null
}

// ───────────── Effekte ─────────────

function whooshAt(t: number, from: number, to: number, dur: number, vol: number) {
  const c = ctx!
  const s = noiseSrc('rosa', false)
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 1.4
  f.frequency.setValueAtTime(from, t)
  f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + dur * 0.4)
  g.gain.linearRampToValueAtTime(0, t + dur)
  s.connect(f).connect(g).connect(fxBus)
  s.start(t, Math.random() * 2, dur + 0.1)
}

function now(): number | null {
  const c = ctx
  if (!c || !enabled || c.state !== 'running') return null
  return c.currentTime + 0.01
}

export const sfx = {
  /** Begrüßung: aufsteigender Akkord-Lauf mit Luftzug */
  intro(mood: Mood) {
    const t = now()
    if (t == null) return
    const ch = MOODS[mood].chords[0]
    whooshAt(t, 300, 2400, 0.9, 0.5)
    ;[...ch, ch[0] + 12, ch[2] + 12].forEach((n, i) => tone(fxBus, n + 12, t + 0.25 + i * 0.07, 1.4, { type: 'sine', vol: 0.16, r: 1.2 }))
    tone(fxBus, ch[0] - 12, t + 0.25, 1.8, { type: 'sine', vol: 0.3, a: 0.02, r: 1.5 })
  },
  /** Absatzwechsel, Richtung je nach Wischen */
  whoosh(forward = true) {
    const t = now()
    if (t == null) return
    whooshAt(t, forward ? 500 : 2400, forward ? 2400 : 500, 0.35, 0.45)
  },
  /** nächstes Häppchen (nach oben gewischt) */
  swipe() {
    const t = now()
    if (t == null) return
    whooshAt(t, 200, 3200, 0.5, 0.6)
  },
  /** Text erscheint */
  pluck(mood: Mood) {
    const t = now()
    if (t == null) return
    const sc = MOODS[mood].scale
    tone(fxBus, sc[Math.floor(Math.random() * sc.length)], t, 0.6, { type: 'triangle', vol: 0.14, r: 0.5, cutoff: 3000 })
  },
  /** Schlüsselwort wird unterstrichen: Federstrich */
  stroke() {
    const t = now()
    if (t == null) return
    whooshAt(t, 2600, 5200, 0.18, 0.18)
  },
  /** Stempel schlägt auf */
  stamp() {
    const t = now()
    if (t == null) return
    kick(fxBus, t, 0.9)
    const s = noiseSrc('braun', false)
    const g = ctx!.createGain()
    g.gain.setValueAtTime(0.6, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    s.connect(g).connect(fxBus)
    s.start(t, 0, 0.3)
  },
  /** Zusammenfassung: aufgelöster Schlussakkord */
  outro(mood: Mood) {
    const t = now()
    if (t == null) return
    const ch = MOODS[mood].chords[0]
    ch.forEach((n, i) => tone(fxBus, n + 12, t + i * 0.12, 2.4, { type: 'sine', vol: 0.12, a: 0.02, r: 2 }))
  },
  /** gemerkt */
  save() {
    const t = now()
    if (t == null) return
    tone(fxBus, 84, t, 0.3, { type: 'sine', vol: 0.2 })
    tone(fxBus, 91, t + 0.09, 0.5, { type: 'sine', vol: 0.2, r: 0.4 })
  },
}
