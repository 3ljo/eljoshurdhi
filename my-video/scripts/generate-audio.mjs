// Synthesizes the music bed and the sound effects used by the promo video.
// Everything is generated from oscillators and noise, so no samples or network
// access are needed. Run with: node scripts/generate-audio.mjs
//
// The music is 120 BPM (one beat = 15 frames at 30 fps, one bar = 60 frames),
// 25 bars long, so scene cuts in src/Promo.tsx land on bar lines.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "audio",
);

// ---------------------------------------------------------------------------
// DSP helpers
// ---------------------------------------------------------------------------

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rand = mulberry32(7);
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

class Biquad {
  constructor() {
    this.b0 = 1;
    this.b1 = 0;
    this.b2 = 0;
    this.a1 = 0;
    this.a2 = 0;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
  }

  set(type, freq, q) {
    const w0 = (2 * Math.PI * Math.min(freq, SR * 0.45)) / SR;
    const cos = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    let b0;
    let b1;
    let b2;
    if (type === "lp") {
      b1 = 1 - cos;
      b0 = b1 / 2;
      b2 = b0;
    } else if (type === "hp") {
      b1 = -(1 + cos);
      b0 = (1 + cos) / 2;
      b2 = b0;
    } else {
      b0 = alpha;
      b1 = 0;
      b2 = -alpha;
    }
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * cos) / a0;
    this.a2 = (1 - alpha) / a0;
    return this;
  }

  process(x) {
    const y =
      this.b0 * x +
      this.b1 * this.x1 +
      this.b2 * this.x2 -
      this.a1 * this.y1 -
      this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

// Band-limited step correction, removes aliasing from saw and square waves.
const polyblep = (t, dt) => {
  if (t < dt) {
    const x = t / dt;
    return x + x - x * x - 1;
  }
  if (t > 1 - dt) {
    const x = (t - 1) / dt;
    return x * x + x + x + 1;
  }
  return 0;
};

const makeBus = (n) => [new Float32Array(n), new Float32Array(n)];

const addTo = (bus, i, l, r = l) => {
  if (i >= 0 && i < bus[0].length) {
    bus[0][i] += l;
    bus[1][i] += r;
  }
};

// Freeverb-style reverb: 8 parallel combs into 4 series allpasses per channel.
class Comb {
  constructor(size) {
    this.buf = new Float32Array(size);
    this.i = 0;
    this.store = 0;
  }

  process(x, feedback, damp) {
    const out = this.buf[this.i];
    this.store = out * (1 - damp) + this.store * damp;
    this.buf[this.i] = x + this.store * feedback;
    this.i = (this.i + 1) % this.buf.length;
    return out;
  }
}

class Allpass {
  constructor(size) {
    this.buf = new Float32Array(size);
    this.i = 0;
  }

  process(x) {
    const b = this.buf[this.i];
    this.buf[this.i] = x + b * 0.5;
    this.i = (this.i + 1) % this.buf.length;
    return b - x;
  }
}

const reverb = ([inL, inR], { feedback = 0.84, damp = 0.3 } = {}) => {
  const combSizes = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const allpassSizes = [556, 441, 341, 225];
  const spread = 23;
  const cl = combSizes.map((s) => new Comb(s));
  const cr = combSizes.map((s) => new Comb(s + spread));
  const al = allpassSizes.map((s) => new Allpass(s));
  const ar = allpassSizes.map((s) => new Allpass(s + spread));
  const n = inL.length;
  const out = makeBus(n);
  for (let i = 0; i < n; i++) {
    const x = (inL[i] + inR[i]) * 0.015;
    let l = 0;
    let r = 0;
    for (let c = 0; c < 8; c++) {
      l += cl[c].process(x, feedback, damp);
      r += cr[c].process(x, feedback, damp);
    }
    for (let a = 0; a < 4; a++) {
      l = al[a].process(l);
      r = ar[a].process(r);
    }
    out[0][i] = l;
    out[1][i] = r;
  }
  return out;
};

// Ping-pong delay: echoes alternate left and right.
const pingPong = ([l, r], delaySec, feedback, mix) => {
  const d = Math.round(delaySec * SR);
  const n = l.length;
  const bl = new Float32Array(n);
  const br = new Float32Array(n);
  const out = makeBus(n);
  for (let i = 0; i < n; i++) {
    const dl = i >= d ? bl[i - d] : 0;
    const dr = i >= d ? br[i - d] : 0;
    bl[i] = (l[i] + r[i]) * 0.5 + dr * feedback;
    br[i] = dl;
    out[0][i] = l[i] + dl * mix;
    out[1][i] = r[i] + dr * mix;
  }
  return out;
};

const writeWav = (file, [l, r]) => {
  const n = l.length;
  const buffer = Buffer.alloc(44 + n * 4);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + n * 4, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(SR, 24);
  buffer.writeUInt32LE(SR * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    const sl = Math.max(-1, Math.min(1, l[i]));
    const sr = Math.max(-1, Math.min(1, r[i]));
    buffer.writeInt16LE(Math.round(sl * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(sr * 32767), 46 + i * 4);
  }
  writeFileSync(join(OUT, file), buffer);
  console.log(`wrote ${file} (${(n / SR).toFixed(2)}s)`);
};

const normalize = (bus, peakDb) => {
  let peak = 0;
  for (const ch of bus) for (const v of ch) peak = Math.max(peak, Math.abs(v));
  const gain = 10 ** (peakDb / 20) / (peak || 1);
  for (const ch of bus) for (let i = 0; i < ch.length; i++) ch[i] *= gain;
  return bus;
};

// ---------------------------------------------------------------------------
// Instruments. Each one writes into a bus starting at time t0 (seconds).
// ---------------------------------------------------------------------------

const kick = (bus, t0, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(0.5 * SR);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (46 + 120 * Math.exp(-t * 32))) / SR;
    const env = Math.min(1, t / 0.0015) * Math.exp(-t * 7);
    let s = Math.sin(ph) * env;
    if (t < 0.005) s += noise() * 0.3 * (1 - t / 0.005);
    addTo(bus, start + i, Math.tanh(s * 1.6) * 0.85 * vel);
  }
};

const clap = (bus, send, t0, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(0.35 * SR);
  const bp = new Biquad().set("bp", 1300, 0.9);
  const hp = new Biquad().set("hp", 700, 0.7);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let env = 0;
    for (const o of [0, 0.011, 0.023]) {
      if (t >= o) env = Math.max(env, Math.exp(-(t - o) * 180));
    }
    if (t >= 0.023) env = Math.max(env, 0.55 * Math.exp(-(t - 0.023) * 14));
    const s = hp.process(bp.process(noise())) * env * vel * 2.2;
    addTo(bus, start + i, s * 0.9, s);
    addTo(send, start + i, s * 0.4);
  }
};

const snare = (bus, send, t0, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(0.2 * SR);
  const bp = new Biquad().set("bp", 1800, 0.7);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (190 + 60 * Math.exp(-t * 40))) / SR;
    const s =
      (bp.process(noise()) * 1.4 * Math.exp(-t * 22) +
        Math.sin(ph) * 0.35 * Math.exp(-t * 30)) *
      vel;
    addTo(bus, start + i, s);
    addTo(send, start + i, s * 0.25);
  }
};

const hat = (bus, t0, vel = 1, open = false) => {
  const start = Math.round(t0 * SR);
  const len = Math.round((open ? 0.45 : 0.08) * SR);
  const hp = new Biquad().set("hp", open ? 6500 : 8000, 0.8);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const s = hp.process(noise()) * Math.exp(-t * (open ? 9 : 50)) * vel;
    addTo(bus, start + i, s * 0.75, s);
  }
};

const bassNote = (bus, t0, dur, midi, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round((dur + 0.03) * SR);
  const f = mtof(midi + 12);
  const fSub = mtof(midi);
  const lp = new Biquad();
  let ph = 0;
  let phSub = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    if (i % 16 === 0) lp.set("lp", 160 + 1700 * Math.exp(-t * 14), 1.1);
    ph = (ph + f / SR) % 1;
    phSub = (phSub + fSub / SR) % 1;
    const saw = 2 * ph - 1 - polyblep(ph, f / SR);
    const rel = t > dur ? Math.max(0, 1 - (t - dur) / 0.03) : 1;
    const env =
      Math.min(1, t / 0.004) * rel * (0.75 + 0.25 * Math.exp(-t * 10));
    const s =
      (lp.process(saw) * 0.5 + Math.sin(2 * Math.PI * phSub) * 0.55) *
      env *
      vel;
    addTo(bus, start + i, s);
  }
};

// Long sine sub note for the breakdown.
const subNote = (bus, t0, dur, midi, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round((dur + 0.2) * SR);
  const f = mtof(midi);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const a = Math.min(1, t / 0.08);
    const r = t > dur ? Math.max(0, 1 - (t - dur) / 0.2) : 1;
    addTo(bus, start + i, Math.sin(2 * Math.PI * f * t) * a * r * 0.5 * vel);
  }
};

const padChord = (bus, t0, dur, notes, vel = 1) => {
  const start = Math.round(t0 * SR);
  const release = 0.8;
  const len = Math.round((dur + release) * SR);
  const cents = [
    [-8, 3],
    [8, -3],
  ];
  for (const m of notes) {
    const base = mtof(m);
    for (let ch = 0; ch < 2; ch++) {
      for (const c of cents[ch]) {
        const f = base * 2 ** (c / 1200);
        const dt = f / SR;
        let ph = rand();
        const data = bus[ch];
        for (let i = 0; i < len; i++) {
          const idx = start + i;
          if (idx >= data.length) break;
          const t = i / SR;
          ph += dt;
          if (ph >= 1) ph -= 1;
          const saw = 2 * ph - 1 - polyblep(ph, dt);
          const a = Math.min(1, t / 0.35);
          const r = t > dur ? Math.max(0, 1 - (t - dur) / release) : 1;
          data[idx] += saw * a * r * 0.035 * vel;
        }
      }
    }
  }
};

const arpNote = (bus, t0, midi, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(0.3 * SR);
  const f = mtof(midi);
  const dt = f / SR;
  let ph = rand();
  const lp = new Biquad().set("lp", 3200, 0.8);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += dt;
    if (ph >= 1) ph -= 1;
    const sq =
      (ph < 0.5 ? 1 : -1) + polyblep(ph, dt) - polyblep((ph + 0.5) % 1, dt);
    const tri = 1 - 4 * Math.abs(ph - 0.5);
    const env = Math.min(1, t / 0.002) * Math.exp(-t * 16);
    addTo(bus, start + i, lp.process(sq * 0.35 + tri * 0.65) * env * vel);
  }
};

const riser = (bus, send, t0, dur, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(dur * SR);
  const bpL = new Biquad();
  const bpR = new Biquad();
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const p = t / dur;
    if (i % 32 === 0) {
      const fc = 300 * 30 ** p;
      bpL.set("bp", fc, 2.5);
      bpR.set("bp", fc * 1.05, 2.5);
    }
    ph += (2 * Math.PI * 180 * 6 ** p) / SR;
    const env = p ** 2.2 * vel;
    const tone = Math.sin(ph) * 0.12 * env;
    const sL = bpL.process(noise()) * 1.8 * env + tone;
    const sR = bpR.process(noise()) * 1.8 * env + tone;
    addTo(bus, start + i, sL, sR);
    addTo(send, start + i, (sL + sR) * 0.25);
  }
};

const impact = (bus, send, t0, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(2.5 * SR);
  const lp = new Biquad();
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    if (i % 32 === 0) lp.set("lp", 300 + 7000 * Math.exp(-t * 6), 0.7);
    ph += (2 * Math.PI * (32 + 60 * Math.exp(-t * 5))) / SR;
    const boom = Math.sin(ph) * Math.exp(-t * 2.2) * Math.min(1, t / 0.003);
    const crash = lp.process(noise()) * Math.exp(-t * 3.2) * 0.5;
    addTo(bus, start + i, (Math.tanh(boom * 1.4) * 0.8 + crash) * vel);
    addTo(send, start + i, crash * vel * 0.8);
  }
};

// ---------------------------------------------------------------------------
// Music arrangement
// ---------------------------------------------------------------------------

const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 25;
const LEN = BARS * BAR;
const N = Math.ceil(LEN * SR);

const CHORDS = {
  Am: { root: 33, notes: [57, 60, 64, 67] },
  F: { root: 29, notes: [53, 57, 60, 64] },
  C: { root: 36, notes: [55, 60, 64, 67] },
  G: { root: 31, notes: [55, 59, 62, 64] },
  Dm: { root: 38, notes: [53, 57, 60, 62] },
  E: { root: 28, notes: [52, 56, 59, 62] },
};

// One chord per bar. Bars 5-8 are the "problem" breakdown.
const PROGRESSION = [
  "Am",
  "F",
  "C",
  "G",
  "F",
  "Am",
  "F",
  "Dm",
  "E",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "G",
  "C",
];

const isBreakdown = (bar) => bar >= 5 && bar <= 8;
const hasGroove = (bar) => (bar >= 1 && bar <= 4) || (bar >= 9 && bar <= 23);

// Short silences right before the drops at 18 s and 42 s.
const GAPS = [
  [17.875, 18],
  [41.875, 42],
];
const inGap = (t) => GAPS.some(([a, b]) => t >= a && t < b);

const drums = makeBus(N);
const bass = makeBus(N);
const pads = makeBus(N);
const arp = makeBus(N);
const fx = makeBus(N);
const send = makeBus(N);
const kickTimes = [];

for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * BAR;
  const chord = CHORDS[PROGRESSION[bar]];

  // Pads play everywhere except the very last bar, which holds the final chord.
  if (bar < BARS - 1) {
    padChord(pads, t0, BAR, chord.notes, isBreakdown(bar) ? 1.1 : 1);
  } else {
    padChord(pads, t0, BAR - 0.9, chord.notes, 1.1);
    padChord(
      pads,
      t0,
      BAR - 0.9,
      chord.notes.map((n) => n + 12),
      0.45,
    );
  }

  if (hasGroove(bar)) {
    for (let beat = 0; beat < 4; beat++) {
      const t = t0 + beat * BEAT;
      const buildCut = bar === 20 && beat >= 2;
      if (!buildCut && !inGap(t)) {
        kick(drums, t);
        kickTimes.push(t);
      }
      if ((beat === 1 || beat === 3) && bar >= 2 && !buildCut) {
        clap(drums, send, t, 0.9);
      }
      const off = t + BEAT / 2;
      if (!inGap(off)) {
        hat(drums, off, 0.16);
        if (bar >= 13 && bar !== 20) hat(drums, off, 0.06, true);
        bassNote(bass, off, BEAT / 2 - 0.02, chord.root, 0.9);
      }
      if (bar >= 9) {
        hat(drums, t + BEAT / 4, 0.05);
        hat(drums, t + (3 * BEAT) / 4, 0.05);
      }
    }
  }

  if (isBreakdown(bar)) {
    subNote(bass, t0, BAR - 0.05, chord.root + 12, 0.8);
    for (let s = 0; s < 16; s++) {
      const t = t0 + s * (BEAT / 4);
      if (!inGap(t) && !(bar === 8 && s >= 8)) {
        hat(drums, t, s % 4 === 2 ? 0.07 : 0.035);
      }
    }
  }

  // Arpeggio: quiet in the intro, full from the first post-breakdown drop.
  const arpOn = bar === 0 || (bar >= 2 && bar <= 4) || (bar >= 9 && bar <= 23);
  if (arpOn) {
    const n = chord.notes.map((x) => x + 12);
    const pattern = [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 2, 1, 0];
    const pick = (k) => (k < 4 ? n[k] : n[k - 4] + 12);
    const vel = bar === 0 ? 0.35 : bar <= 4 ? 0.5 : 0.75;
    for (let s = 0; s < 16; s++) {
      const t = t0 + s * (BEAT / 4);
      if (!inGap(t) && !(bar === 20 && s >= 12)) {
        arpNote(arp, t, pick(pattern[s]), vel * (s % 4 === 0 ? 1 : 0.7));
      }
    }
  }
}

// Snare rolls into the drops.
for (const [from, to] of [
  [17, 17.875],
  [41, 41.875],
]) {
  let t = from;
  while (t < to - 0.001) {
    const p = (t - from) / (to - from);
    snare(drums, send, t, 0.25 + 0.6 * p);
    t += p < 0.5 ? BEAT / 4 : BEAT / 8;
  }
}

riser(fx, send, 1, 1, 0.8);
riser(fx, send, 16, 1.875, 1);
riser(fx, send, 40, 1.875, 1);

impact(fx, send, 2, 0.9);
impact(fx, send, 16, 0.55);
impact(fx, send, 18, 1);
impact(fx, send, 42, 1);
impact(fx, send, 48, 0.6);
kick(drums, 48);
kickTimes.push(48);

// Pad filter follows the arrangement: closed in the intro and the breakdown.
const padCutoff = (t) => {
  const bar = Math.floor(t / BAR);
  if (bar === 0) return 500 + 900 * (t / BAR);
  if (isBreakdown(bar)) return 750;
  if (bar >= 21) return 2600;
  return 2000;
};
for (let ch = 0; ch < 2; ch++) {
  const lp = new Biquad();
  const data = pads[ch];
  for (let i = 0; i < N; i++) {
    if (i % 64 === 0) lp.set("lp", padCutoff(i / SR), 0.7);
    data[i] = lp.process(data[i]);
  }
}

const arpWithDelay = pingPong(arp, BEAT * 0.75, 0.38, 0.35);

for (let i = 0; i < N; i++) {
  send[0][i] += pads[0][i] * 0.5 + arpWithDelay[0][i] * 0.3;
  send[1][i] += pads[1][i] * 0.5 + arpWithDelay[1][i] * 0.3;
}
const verb = reverb(send, { feedback: 0.86, damp: 0.3 });

// Sidechain: everything melodic ducks under the kick.
kickTimes.sort((a, b) => a - b);
const duck = new Float32Array(N).fill(1);
let k = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  while (k + 1 < kickTimes.length && kickTimes[k + 1] <= t) k++;
  const since = t - kickTimes[k];
  if (kickTimes.length && since >= 0) duck[i] = 1 - 0.65 * Math.exp(-since * 9);
}

const music = makeBus(N);
const hp = [new Biquad().set("hp", 28, 0.7), new Biquad().set("hp", 28, 0.7)];
for (let ch = 0; ch < 2; ch++) {
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const d = duck[i];
    const x =
      drums[ch][i] * 0.9 +
      bass[ch][i] * 0.75 * d +
      pads[ch][i] * (0.55 + 0.45 * d) +
      arpWithDelay[ch][i] * 0.32 * (0.7 + 0.3 * d) +
      fx[ch][i] * 0.7 +
      verb[ch][i] * 1.1;
    const fadeIn = Math.min(1, t / 0.3);
    const fadeOut = Math.min(1, Math.max(0, (LEN - t) / 1.6));
    music[ch][i] = hp[ch].process(x) * fadeIn * fadeOut;
  }
}

// Gentle soft clip: scale so that only the top 0.1% of samples (kick and
// impact transients) reach the curved part of tanh().
const magnitudes = Float32Array.from(music[0], (v, i) =>
  Math.max(Math.abs(v), Math.abs(music[1][i])),
).sort();
const loud = magnitudes[Math.floor(magnitudes.length * 0.999)];
for (const ch of music) {
  for (let i = 0; i < N; i++) ch[i] = Math.tanh((ch[i] / loud) * 0.8);
}

mkdirSync(OUT, { recursive: true });
writeWav("music.wav", normalize(music, -1));

// ---------------------------------------------------------------------------
// Sound effects
// ---------------------------------------------------------------------------

const sfx = (seconds, fn, peakDb = -3) => {
  const bus = makeBus(Math.ceil(seconds * SR));
  fn(bus);
  return normalize(bus, peakDb);
};

const whoosh = sfx(0.9, (bus) => {
  const len = bus[0].length;
  const bp = [new Biquad(), new Biquad()];
  for (let i = 0; i < len; i++) {
    const p = i / len;
    if (i % 32 === 0) {
      const fc = 350 + 2600 * Math.sin(Math.PI * Math.min(1, p * 1.15));
      bp[0].set("bp", fc, 1.4);
      bp[1].set("bp", fc * 1.08, 1.4);
    }
    const env = Math.sin(Math.PI * p) ** 2;
    const pan = p;
    addTo(
      bus,
      i,
      bp[0].process(noise()) * env * (1 - pan * 0.7),
      bp[1].process(noise()) * env * (0.3 + pan * 0.7),
    );
  }
});

const pop = sfx(
  0.16,
  (bus) => {
    let ph = 0;
    for (let i = 0; i < bus[0].length; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * (380 + 700 * Math.exp(-t * 45))) / SR;
      const s =
        Math.sin(ph) * Math.exp(-t * 38) * Math.min(1, t / 0.001) +
        (t < 0.002 ? noise() * 0.4 : 0);
      addTo(bus, i, s);
    }
  },
  -4,
);

const click = sfx(0.14, (bus) => {
  const hp = new Biquad().set("hp", 1500, 0.7);
  for (const [o, v] of [
    [0, 1],
    [0.07, 0.6],
  ]) {
    let ph = 0;
    const start = Math.round(o * SR);
    for (let i = 0; i < 0.03 * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * 3200) / SR;
      const s =
        (hp.process(noise()) * Math.exp(-t * 900) +
          Math.sin(ph) * 0.4 * Math.exp(-t * 500)) *
        v;
      addTo(bus, start + i, s);
    }
  }
});

const ding = sfx(1.6, (bus) => {
  const partials = [
    [1, 1, 1.4],
    [2.0, 0.35, 0.9],
    [2.76, 0.28, 0.6],
    [5.4, 0.12, 0.3],
  ];
  for (const [base, delay, gain] of [
    [1318.5, 0, 1],
    [1760, 0.09, 0.8],
  ]) {
    const start = Math.round(delay * SR);
    for (let i = 0; start + i < bus[0].length; i++) {
      const t = i / SR;
      let s = 0;
      for (const [ratio, amp, decay] of partials) {
        s +=
          Math.sin(2 * Math.PI * base * ratio * t) * amp * Math.exp(-t / decay);
      }
      s *= Math.min(1, t / 0.002) * gain;
      addTo(bus, start + i, s * 0.9, s);
    }
  }
});

const glitch = sfx(
  0.42,
  (bus) => {
    const len = bus[0].length;
    let i = 0;
    while (i < len) {
      const seg = Math.round((0.012 + rand() * 0.03) * SR);
      const kind = rand();
      const f = 120 + rand() * 1800;
      const crush = 4 + Math.floor(rand() * 12);
      let held = 0;
      for (let j = 0; j < seg && i + j < len; j++) {
        const t = j / SR;
        let s = 0;
        if (kind < 0.45) s = Math.sin(2 * Math.PI * f * t) > 0 ? 0.6 : -0.6;
        else if (kind < 0.8) {
          if (j % crush === 0) held = noise();
          s = held * 0.7;
        }
        const gate = Math.min(1, j / 40, (seg - j) / 40);
        addTo(bus, i + j, s * gate * (rand() < 0.5 ? 1 : 0.6), s * gate);
      }
      i += seg;
    }
  },
  -6,
);

const typing = sfx(
  1.7,
  (bus) => {
    let t = 0.02;
    while (t < 1.6) {
      const start = Math.round(t * SR);
      const bp = new Biquad().set("bp", 2200 + rand() * 2200, 1.2);
      const v = 0.5 + rand() * 0.5;
      let ph = 0;
      for (let i = 0; i < 0.035 * SR; i++) {
        const tt = i / SR;
        ph += (2 * Math.PI * (140 + rand() * 5)) / SR;
        const s =
          (bp.process(noise()) * 2.2 * Math.exp(-tt * 260) +
            Math.sin(ph) * 0.25 * Math.exp(-tt * 120)) *
          v;
        addTo(bus, start + i, s * (0.8 + rand() * 0.2), s);
      }
      t += 0.028 + rand() * 0.035;
    }
  },
  -6,
);

writeWav("whoosh.wav", whoosh);
writeWav("pop.wav", pop);
writeWav("click.wav", click);
writeWav("ding.wav", ding);
writeWav("glitch.wav", glitch);
writeWav("typing.wav", typing);
