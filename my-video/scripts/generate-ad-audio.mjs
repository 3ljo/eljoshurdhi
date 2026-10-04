// Synthesizes the soundtrack of the 20-second Meta ad (src/ad/MetaAd.tsx): a
// music bed arranged to the picture plus six one-shot sound effects. Like
// scripts/generate-audio.mjs (whose DSP helpers are copied here), everything
// comes from oscillators and noise: no samples, no network.
// Run with: node scripts/generate-ad-audio.mjs
//
// 120 BPM against 30 fps: one beat = 0.5 s = 15 frames. The music follows the
// ad's sections (seconds):
//   0.0-3.0   HOOK   impact on the downbeat, kick on every beat
//   3.0-7.5   PAIN   filtered, half-time, darker; room for the stamp hits
//   7.5-13.0  PROOF  full groove and the synth hook, chords change on the cuts
//   13.0-16.5 OFFER  lighter groove, then a build into 16.5
//   16.5-20.0 CTA    big impact, groove, final hit at 19.0 ringing out
// The master is normalized to TARGET_LUFS with a true-peak-safe limiter.

import { Buffer } from "node:buffer";
import console from "node:console";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT =
  process.env.AD_AUDIO_OUT ??
  join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
// AD_AUDIO_STEMS=1 also writes the unmastered stems (for checking the mix).
const STEMS = process.env.AD_AUDIO_STEMS === "1";

const TARGET_LUFS = -13;
const CEILING_DB = -1.9;

// ---------------------------------------------------------------------------
// DSP helpers (from scripts/generate-audio.mjs, Biquad extended with shelves)
// ---------------------------------------------------------------------------

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rand = mulberry32(20);
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

// RBJ cookbook coefficients [b0, b1, b2, a0, a1, a2].
const coefficients = (type, freq, q, gainDb) => {
  const w0 = (2 * Math.PI * Math.min(freq, SR * 0.45)) / SR;
  const cos = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const A = 10 ** (gainDb / 40);
  if (type === "lp") {
    return [
      (1 - cos) / 2,
      1 - cos,
      (1 - cos) / 2,
      1 + alpha,
      -2 * cos,
      1 - alpha,
    ];
  }
  if (type === "hp") {
    return [
      (1 + cos) / 2,
      -(1 + cos),
      (1 + cos) / 2,
      1 + alpha,
      -2 * cos,
      1 - alpha,
    ];
  }
  if (type === "hs") {
    const s = 2 * Math.sqrt(A) * alpha;
    return [
      A * (A + 1 + (A - 1) * cos + s),
      -2 * A * (A - 1 + (A + 1) * cos),
      A * (A + 1 + (A - 1) * cos - s),
      A + 1 - (A - 1) * cos + s,
      2 * (A - 1 - (A + 1) * cos),
      A + 1 - (A - 1) * cos - s,
    ];
  }
  if (type === "peak") {
    return [
      1 + alpha * A,
      -2 * cos,
      1 - alpha * A,
      1 + alpha / A,
      -2 * cos,
      1 - alpha / A,
    ];
  }
  // band-pass, constant 0 dB peak gain
  return [alpha, 0, -alpha, 1 + alpha, -2 * cos, 1 - alpha];
};

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

  set(type, freq, q, gainDb = 0) {
    const [b0, b1, b2, a0, a1, a2] = coefficients(type, freq, q, gainDb);
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;
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
};

const normalize = (bus, peakDb) => {
  let peak = 0;
  for (const ch of bus) for (const v of ch) peak = Math.max(peak, Math.abs(v));
  const gain = 10 ** (peakDb / 20) / (peak || 1);
  for (const ch of bus) for (let i = 0; i < ch.length; i++) ch[i] *= gain;
  return bus;
};

// ---------------------------------------------------------------------------
// Metering: ITU-R BS.1770 integrated loudness and 4x oversampled true peak
// ---------------------------------------------------------------------------

const lufs = (bus) => {
  const n = bus[0].length;
  const power = new Float64Array(n + 1);
  for (const ch of bus) {
    const shelf = new Biquad().set("hs", 1681.974, 0.7071752, 3.999843);
    const hp = new Biquad().set("hp", 38.13547, 0.500327);
    let acc = 0;
    for (let i = 0; i < n; i++) {
      const y = hp.process(shelf.process(ch[i]));
      acc += y * y;
      power[i + 1] += acc;
    }
  }
  // power[] holds the running sum of the K-weighted power of both channels.
  const block = Math.round(0.4 * SR);
  const hop = Math.round(0.1 * SR);
  const blocks = [];
  for (let s = 0; s + block <= n; s += hop) {
    blocks.push((power[s + block] - power[s]) / block);
  }
  const loud = (z) => -0.691 + 10 * Math.log10(z);
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const abs = blocks.filter((z) => loud(z) > -70);
  const rel = loud(mean(abs)) - 10;
  return loud(mean(abs.filter((z) => loud(z) > rel)));
};

const truePeakDb = (bus) => {
  const taps = 16;
  const kernels = [0.25, 0.5, 0.75].map((frac) => {
    const k = [];
    for (let j = -taps + 1; j <= taps; j++) {
      const x = frac - j;
      const sinc = Math.sin(Math.PI * x) / (Math.PI * x);
      k.push(sinc * 0.5 * (1 + Math.cos((Math.PI * x) / taps)));
    }
    return k;
  });
  let peak = 0;
  for (const ch of bus) {
    for (let i = 0; i < ch.length; i++) {
      peak = Math.max(peak, Math.abs(ch[i]));
      if (i < taps || i >= ch.length - taps) continue;
      for (const k of kernels) {
        let y = 0;
        for (let j = 0; j < k.length; j++) y += ch[i - taps + 1 + j] * k[j];
        peak = Math.max(peak, Math.abs(y));
      }
    }
  }
  return 20 * Math.log10(peak);
};

// Look-ahead brickwall limiter. The gain is the forward minimum of the
// required gain (5 ms window) smoothed by a 5 ms box filter, which keeps it
// at or below the requirement on every sample; it recovers with an 80 ms
// release.
const limiter = ([inL, inR], ceilingDb, gain = 1) => {
  const c = 10 ** (ceilingDb / 20);
  const n = inL.length;
  const la = Math.round(0.005 * SR);
  const req = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = Math.max(Math.abs(inL[i]), Math.abs(inR[i])) * gain;
    req[i] = p > c ? c / p : 1;
  }
  // Forward-looking moving minimum over [i, i + la] with a monotonic deque.
  const fmin = new Float32Array(n);
  const dq = new Int32Array(n);
  let head = 0;
  let tail = 0;
  let next = 0;
  for (let i = 0; i < n; i++) {
    while (next < n && next <= i + la) {
      while (tail > head && req[dq[tail - 1]] >= req[next]) tail--;
      dq[tail++] = next++;
    }
    while (dq[head] < i) head++;
    fmin[i] = req[dq[head]];
  }
  const out = makeBus(n);
  const release = Math.exp(-1 / (0.08 * SR));
  let sum = la + 1;
  let g = 1;
  let reduction = 1;
  for (let i = 0; i < n; i++) {
    sum += fmin[i] - (i > la ? fmin[i - la - 1] : 1);
    const target = sum / (la + 1);
    g = target < g ? target : target - (target - g) * release;
    reduction = Math.min(reduction, g);
    out[0][i] = inL[i] * gain * g;
    out[1][i] = inR[i] * gain * g;
  }
  out.reduction = 20 * Math.log10(reduction);
  return out;
};

// ---------------------------------------------------------------------------
// Instruments. Each one writes into a bus starting at time t0 (seconds).
// ---------------------------------------------------------------------------

const kick = (bus, t0, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(0.42 * SR);
  const hp = new Biquad().set("hp", 2500, 0.7);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (51 + 160 * Math.exp(-t * 30))) / SR;
    const env = Math.min(1, t / 0.0008) * Math.exp(-t * 7.5);
    const body = Math.tanh(Math.sin(ph) * env * 2.2) * 0.8;
    const beater =
      hp.process(noise()) * Math.exp(-t * 420) * 0.3 +
      Math.sin(2 * Math.PI * 1700 * t) * Math.exp(-t * 260) * 0.1;
    addTo(bus, start + i, (body + beater) * vel);
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

// Backbeat: clap layered on a snare.
const backbeat = (bus, send, t0, vel = 1) => {
  clap(bus, send, t0, vel * 0.85);
  snare(bus, send, t0, vel * 0.45);
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

const crash = (bus, send, t0, vel = 1, seconds = 2.2) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(seconds * SR);
  const hp = [
    new Biquad().set("hp", 3600, 0.6),
    new Biquad().set("hp", 3600, 0.6),
  ];
  const pk = [
    new Biquad().set("peak", 5200, 1.5, 4),
    new Biquad().set("peak", 5600, 1.5, 4),
  ];
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const fade = Math.min(1, (len - i) / (0.05 * SR));
    const env =
      Math.min(1, t / 0.002) *
      (0.55 * Math.exp(-t * 2.3) + 0.45 * Math.exp(-t * 16)) *
      fade *
      vel *
      0.42;
    const l = pk[0].process(hp[0].process(noise())) * env;
    const r = pk[1].process(hp[1].process(noise())) * env;
    addTo(bus, start + i, l, r);
    addTo(send, start + i, (l + r) * 0.12);
  }
};

// Reverse-cymbal swell that stops dead at t0 + seconds.
const swell = (bus, t0, seconds, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(seconds * SR);
  const hp = [
    new Biquad().set("hp", 1800, 0.7),
    new Biquad().set("hp", 1800, 0.7),
  ];
  const lp = [new Biquad(), new Biquad()];
  for (let i = 0; i < len; i++) {
    const p = i / len;
    if (i % 32 === 0) {
      lp[0].set("lp", 2500 * 6 ** p, 0.8);
      lp[1].set("lp", 2700 * 6 ** p, 0.8);
    }
    const env = p ** 3 * Math.min(1, (len - i) / (0.004 * SR)) * vel * 0.5;
    addTo(
      bus,
      start + i,
      lp[0].process(hp[0].process(noise())) * env,
      lp[1].process(hp[1].process(noise())) * env,
    );
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
    if (i % 16 === 0) lp.set("lp", 180 + 1900 * Math.exp(-t * 14), 1.1);
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

// 808-style sub: a sine that drops into pitch, driven into tanh so its
// harmonics stay audible on phone speakers.
const sub808 = (bus, t0, dur, midi, vel = 1) => {
  const start = Math.round(t0 * SR);
  const release = 0.08;
  const len = Math.round((dur + release) * SR);
  const f0 = mtof(midi);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f0 * (1 + 0.6 * Math.exp(-t * 45))) / SR;
    const r = t > dur ? Math.max(0, 1 - (t - dur) / release) : 1;
    const a = Math.min(1, t / 0.003) * (0.6 + 0.4 * Math.exp(-t * 1.5)) * r;
    addTo(bus, start + i, Math.tanh(Math.sin(ph) * a * 2) * 0.55 * vel);
  }
};

const padChord = (bus, t0, dur, notes, vel = 1, release = 0.3) => {
  const start = Math.round(t0 * SR);
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
          const a = Math.min(1, t / 0.06);
          const r = t > dur ? Math.max(0, 1 - (t - dur) / release) : 1;
          data[idx] += saw * a * r * 0.035 * vel;
        }
      }
    }
  }
};

// Detuned saw stack with a sub square and an enveloped low-pass: the synth
// hook (short pluck) and the chord stabs on the big hits (longer decay).
const VOICES = [
  [-14, 0.9, 0.3],
  [-5, 0.65, 0.65],
  [5, 0.65, 0.65],
  [14, 0.3, 0.9],
];
const sawStack = (bus, send, t0, midi, o) => {
  const start = Math.round(t0 * SR);
  const len = Math.round((o.dur + o.release) * SR);
  const f = mtof(midi);
  const ph = VOICES.map(() => rand());
  let phSq = rand();
  const lp = [new Biquad(), new Biquad()];
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    if (i % 16 === 0) {
      const fc = o.fcBase + o.fcEnv * Math.exp(-t * o.fcRate);
      lp[0].set("lp", fc, 1.3);
      lp[1].set("lp", fc, 1.3);
    }
    let l = 0;
    let r = 0;
    for (let v = 0; v < VOICES.length; v++) {
      const [c, gl, gr] = VOICES[v];
      const dt = (f * 2 ** (c / 1200)) / SR;
      ph[v] += dt;
      if (ph[v] >= 1) ph[v] -= 1;
      const saw = 2 * ph[v] - 1 - polyblep(ph[v], dt);
      l += saw * gl;
      r += saw * gr;
    }
    const dq = f / 2 / SR;
    phSq += dq;
    if (phSq >= 1) phSq -= 1;
    const sq =
      (phSq < 0.5 ? 1 : -1) +
      polyblep(phSq, dq) -
      polyblep((phSq + 0.5) % 1, dq);
    l += sq * o.sub;
    r += sq * o.sub;
    const rel = t > o.dur ? Math.max(0, 1 - (t - o.dur) / o.release) : 1;
    const env =
      Math.min(1, t / 0.002) *
      (o.sustain + (1 - o.sustain) * Math.exp(-t * o.decay)) *
      rel *
      o.vel;
    const sL = lp[0].process(l) * env * 0.16;
    const sR = lp[1].process(r) * env * 0.16;
    addTo(bus, start + i, sL, sR);
    addTo(send, start + i, (sL + sR) * o.send);
  }
};

const pluck = (bus, send, t0, dur, midi, vel = 1) =>
  sawStack(bus, send, t0, midi, {
    dur,
    release: 0.08,
    vel,
    sustain: 0.3,
    decay: 9,
    fcBase: 800,
    fcEnv: 5200,
    fcRate: 15,
    sub: 0.35,
    send: 0.18,
  });

const stab = (bus, send, t0, notes, vel = 1, ring = 0.35) => {
  for (const m of notes) {
    sawStack(bus, send, t0, m, {
      dur: ring,
      release: ring * 1.5,
      vel: vel * 0.55,
      sustain: 0,
      decay: 2.2 / ring,
      fcBase: 500,
      fcEnv: 6500,
      fcRate: 2.5 / ring,
      sub: 0.15,
      send: 0.3,
    });
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
    const hit = lp.process(noise()) * Math.exp(-t * 3.2) * 0.5;
    addTo(bus, start + i, (Math.tanh(boom * 1.4) * 0.8 + hit) * vel);
    addTo(send, start + i, hit * vel * 0.8);
  }
};

// ---------------------------------------------------------------------------
// Music arrangement
// ---------------------------------------------------------------------------

const BEAT = 0.5;
const LEN = 20;
const N = LEN * SR;

// A minor. Pads voice-lead around C4; bass roots sit in the first octave.
const CHORDS = {
  Am: { root: 33, notes: [57, 60, 64, 67] },
  F: { root: 29, notes: [53, 57, 60, 64] },
  C: { root: 36, notes: [55, 60, 64, 67] },
  G: { root: 31, notes: [55, 59, 62, 67] },
  G6: { root: 31, notes: [55, 59, 62, 64] },
  E: { root: 28, notes: [56, 59, 62, 64] },
};

// [start second, chord]. Proof changes chord on each project cut (8.5, 10,
// 11.5); pain walks F-G-E so it resolves into the proof drop.
const TIMELINE = [
  [0, "Am"],
  [2, "F"],
  [3, "F"],
  [5, "G6"],
  [6, "E"],
  [7.5, "Am"],
  [8.5, "F"],
  [10, "C"],
  [11.5, "G"],
  [13, "F"],
  [14, "G"],
  [15, "E"],
  [16.5, "Am"],
  [18, "F"],
  [18.5, "G"],
  [19, "Am"],
];
const chordAt = (t) => {
  let name = TIMELINE[0][1];
  for (const [s, c] of TIMELINE) if (t + 1e-6 >= s) name = c;
  return CHORDS[name];
};
const beats = (from, to) => {
  const out = [];
  for (let t = from; t < to - 1e-6; t += BEAT) out.push(t);
  return out;
};

const drums = makeBus(N);
const bass = makeBus(N);
const pads = makeBus(N);
const lead = makeBus(N);
const fx = makeBus(N);
const send = makeBus(N);
// Kicks that pump the bass, pads and hook (not the half-time and big hits,
// where the kick and the 808 land together).
const duckTimes = [];

const kickAt = (t, vel = 1, pump = true) => {
  kick(drums, t, vel);
  if (pump) duckTimes.push(t);
};

// Four-on-the-floor groove: offbeat hats, 16th ghost hats, offbeat bass.
const groove = (from, to, { open = true, roll16 = false } = {}) => {
  for (const t of beats(from, to)) {
    hat(drums, t + BEAT / 2, 0.17);
    hat(drums, t + BEAT / 4, 0.05);
    hat(drums, t + (3 * BEAT) / 4, 0.05);
    if (open) hat(drums, t + BEAT / 2, 0.055, true);
    const root = chordAt(t + BEAT / 2).root;
    bassNote(bass, t + BEAT / 2, BEAT / 2 - 0.02, root, 0.9);
    if (roll16) bassNote(bass, t + (3 * BEAT) / 4, BEAT / 4 - 0.02, root, 0.55);
  }
};

// HOOK 0.0-3.0: impact on the downbeat, kick on every beat.
impact(fx, send, 0, 0.8);
crash(fx, send, 0, 0.7);
stab(
  lead,
  send,
  0,
  CHORDS.Am.notes.map((n) => n + 12),
  1,
  0.45,
);
for (const t of beats(0, 3)) kickAt(t);
for (const t of [0.5, 1.5, 2.5]) backbeat(drums, send, t, 0.95);
groove(0, 3, { open: false });
stab(
  lead,
  send,
  2,
  CHORDS.F.notes.map((n) => n + 12),
  0.8,
  0.35,
);

// PAIN 3.0-7.5: half-time (kick on 1, backbeat on 3), sub pedal, ticking
// hats; the whole bed is low-passed (see lpCut) so the stamps cut through.
for (const t of [3, 5, 7]) kickAt(t, 1.05, false);
for (const t of [4, 6]) {
  clap(drums, send, t, 1);
  snare(drums, send, t, 0.6);
  // Extra reverb send: the backbeat blooms in the dark half-time.
  clap(send, send, t, 0.7);
}
sub808(bass, 3, 1.92, CHORDS.F.root + 12, 0.6);
sub808(bass, 5, 0.94, CHORDS.G6.root + 12, 0.6);
sub808(bass, 6, 1.0, CHORDS.E.root + 12, 0.6);
for (let s = 0; s < 32; s++) {
  hat(fx, 3 + s * (BEAT / 4), s % 2 === 0 ? 0.045 : 0.022);
}
// Roll and swell lift the filter back open into the proof drop.
for (const [t, v] of [
  [7, 0.3],
  [7.125, 0.4],
  [7.25, 0.5],
  [7.3125, 0.6],
  [7.375, 0.7],
  [7.4375, 0.85],
]) {
  snare(fx, send, t, v);
}
swell(fx, 6.6, 0.9, 0.9);

// PROOF 7.5-13.0: full groove, chords on the cuts, the synth hook.
crash(fx, send, 7.5, 0.75);
stab(
  lead,
  send,
  7.5,
  CHORDS.Am.notes.map((n) => n + 12),
  0.8,
  0.3,
);
for (const t of beats(7.5, 13)) kickAt(t);
for (const t of [8, 9, 10, 11, 12]) backbeat(drums, send, t, 1);
groove(7.5, 13, { roll16: true });
snare(drums, send, 12.75, 0.45);
snare(drums, send, 12.875, 0.6);

// The hook: a 3-beat cell (16ths 0, 3, 6, 8, 10), one per project cut.
const CELL = [
  [0, 2],
  [3, 2],
  [6, 1.5],
  [8, 1.5],
  [10, 2],
];
const hookCell = (t0, notes, vel = 1) => {
  CELL.forEach(([pos, len], k) => {
    pluck(
      lead,
      send,
      t0 + pos * (BEAT / 4),
      len * (BEAT / 4) - 0.02,
      notes[k],
      vel,
    );
  });
};
hookCell(8.5, [76, 76, 79, 81, 79]);
hookCell(10, [76, 76, 79, 81, 84]);
hookCell(11.5, [74, 74, 79, 81, 83]);

// OFFER 13.0-15.0: lighter groove under the promises, quiet arpeggio.
for (const t of beats(13, 15)) kickAt(t);
for (const t of [13.5, 14.5]) backbeat(drums, send, t, 0.85);
groove(13, 15, { open: false });
for (let s = 0; s < 16; s++) {
  const t = 13 + s * (BEAT / 4);
  const n = chordAt(t).notes.map((x) => x + 12);
  arpNote(
    lead,
    t,
    n[[0, 1, 2, 3, 2, 1, 2, 3][s % 8]],
    s % 4 === 0 ? 0.42 : 0.3,
  );
}

// OFFER 15.0-16.5: the price lands, then the build: kicks thin out, the bed
// is high-passed upwards (hpCut), rolling bass and an accelerating snare roll,
// and 16.375-16.5 drops to silence before the CTA.
// No kick or 808 on 15.0: the price stamp and its impact own that low end.
stab(
  lead,
  send,
  15,
  CHORDS.E.notes.map((n) => n + 12),
  0.7,
  0.3,
);
for (const t of [15.5, 16, 16.25]) kickAt(t, 0.9);
for (const [t, v] of [
  [15.25, 0.5],
  [15.75, 0.55],
  [15.875, 0.6],
  [16.125, 0.7],
]) {
  bassNote(bass, t, BEAT / 4 - 0.02, CHORDS.E.root, v);
}
{
  let t = 15;
  while (t < 16.375 - 1e-6) {
    const p = (t - 15) / 1.375;
    snare(fx, send, t, 0.22 + 0.7 * p ** 1.5);
    t += t < 15.5 ? BEAT / 2 : t < 16 ? BEAT / 4 : BEAT / 8;
  }
}
swell(fx, 15.6, 0.775, 0.7);
padChord(
  pads,
  15,
  1.375,
  CHORDS.E.notes.map((n) => n + 12),
  0.5,
  0.02,
);

// CTA 16.5-20.0: impact, groove with the hook, final hit at 19.0.
impact(fx, send, 16.5, 0.55);
crash(fx, send, 16.5, 0.8);
stab(
  lead,
  send,
  16.5,
  CHORDS.Am.notes.map((n) => n + 12),
  0.9,
  0.35,
);
for (const t of beats(16.5, 19)) kickAt(t);
for (const t of [17, 18]) backbeat(drums, send, t, 1);
groove(16.5, 18.75, { roll16: true });
hookCell(16.5, [76, 76, 79, 81, 79]);
for (const [pos, m] of [
  [0, 81],
  [3, 81],
  [6, 83],
]) {
  pluck(lead, send, 18 + pos * (BEAT / 4), 0.16, m, 0.9);
}

kickAt(19, 1.1, false);
impact(fx, send, 19, 0.75);
crash(fx, send, 19, 0.6, 1.0);
stab(
  lead,
  send,
  19,
  [...CHORDS.Am.notes, ...CHORDS.Am.notes.map((n) => n + 12)],
  0.75,
  0.55,
);
pluck(lead, send, 19, 0.4, 81, 0.8);
sub808(bass, 19, 0.6, CHORDS.Am.root + 12, 0.95);

// Pads under every section except the build (which has its own).
for (let k = 0; k < TIMELINE.length; k++) {
  const [s, name] = TIMELINE[k];
  const e = k + 1 < TIMELINE.length ? TIMELINE[k + 1][0] : 19.7;
  if (s >= 15 && s < 16.5) continue;
  const vel = s >= 3 && s < 7.5 ? 1.3 : s >= 19 ? 1.1 : 0.85;
  padChord(pads, s, e - s, CHORDS[name].notes, vel, s >= 19 ? 0.3 : 0.12);
}

// ---------------------------------------------------------------------------
// Mix
// ---------------------------------------------------------------------------

// Low-pass on the bed: closes at the pain cut, re-opens into the proof drop.
const lpCut = (t) => {
  if (t < 3) return 19000;
  if (t < 3.04) return 19000 * (850 / 19000) ** ((t - 3) / 0.04);
  if (t < 7) return 850;
  if (t < 7.5) return 850 * (19000 / 850) ** (((t - 7) / 0.5) ** 2);
  return 19000;
};
// High-pass build under the riser.
const hpCut = (t) => {
  if (t >= 15.02 && t < 16.5)
    return 25 * (480 / 25) ** Math.min(1, (t - 15.02) / 1.355);
  return 25;
};
// Gaps of silence right before the CTA drop and the final hit.
const GAPS = [
  [16.375, 16.5],
  [18.875, 19],
];
const gate = (t) => {
  let g = 1;
  for (const [a, b] of GAPS) {
    const ramp = 0.004;
    if (t > a - ramp && t < b) g = Math.min(g, Math.max(0, (a - t) / ramp));
  }
  return g;
};

// Sidechain: d dips to 0 on each pumping kick and recovers in ~0.3 s.
duckTimes.sort((a, b) => a - b);
const duck = new Float32Array(N).fill(1);
{
  let k = -1;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (k + 1 < duckTimes.length && duckTimes[k + 1] <= t) k++;
    if (k >= 0) duck[i] = 1 - Math.exp(-(t - duckTimes[k]) * 9);
  }
}

const leadFx = pingPong(lead, BEAT * 0.75, 0.32, 0.28);
for (let i = 0; i < N; i++) {
  send[0][i] += pads[0][i] * 0.35 + leadFx[0][i] * 0.15;
  send[1][i] += pads[1][i] * 0.35 + leadFx[1][i] * 0.15;
}
const verb = reverb(send, { feedback: 0.85, damp: 0.32 });

// Stem levels; d is the sidechain (0 on a pumping kick, back to 1 after).
const LEVEL = {
  drums: () => 0.9,
  bass: (d) => 0.8 * (0.35 + 0.65 * d),
  pads: (d) => 1.1 * (0.5 + 0.5 * d),
  lead: (d) => 1.6 * (0.75 + 0.25 * d),
  verb: () => 0.9,
  fx: () => 0.8,
};
const STEM_BUSES = { drums, bass, pads, lead: leadFx, verb, fx };

if (STEMS) {
  mkdirSync(OUT, { recursive: true });
  for (const [name, bus] of Object.entries(STEM_BUSES)) {
    const level = LEVEL[name];
    writeWav(
      `stem-${name}.wav`,
      bus.map((ch) => ch.map((v, i) => v * level(duck[i]) * 0.5)),
    );
  }
}

const mix = makeBus(N);
for (let ch = 0; ch < 2; ch++) {
  const lp = new Biquad();
  const hp = new Biquad();
  const lpV = new Biquad();
  const hpV = new Biquad();
  const dc = new Biquad().set("hp", 28, 0.7);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    if (i % 32 === 0) {
      lp.set("lp", lpCut(t), 0.75);
      lpV.set("lp", lpCut(t), 0.75);
      hp.set("hp", hpCut(t), 0.7);
      hpV.set("hp", hpCut(t), 0.7);
    }
    const d = duck[i];
    const dry =
      drums[ch][i] * LEVEL.drums(d) +
      bass[ch][i] * LEVEL.bass(d) +
      pads[ch][i] * LEVEL.pads(d) +
      leadFx[ch][i] * LEVEL.lead(d);
    const wet = verb[ch][i] * LEVEL.verb(d);
    const bed =
      hp.process(lp.process(dry)) * gate(t) + hpV.process(lpV.process(wet));
    mix[ch][i] = dc.process(bed + fx[ch][i] * LEVEL.fx(d));
  }
}

// Master: find the gain that lands the limited mix on TARGET_LUFS.
let gain = 1;
let master = limiter(mix, CEILING_DB, gain);
for (let pass = 0; pass < 5; pass++) {
  gain *= 10 ** ((TARGET_LUFS - lufs(master)) / 20);
  master = limiter(mix, CEILING_DB, gain);
}
// 1 ms in (the impact starts on sample 0), last 0.3 s out to silence.
for (const ch of master) {
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    ch[i] *= Math.min(1, t / 0.001, Math.max(0, (LEN - t) / 0.3));
  }
}

mkdirSync(OUT, { recursive: true });
writeWav("ad-music.wav", master);
console.log(
  `ad-music.wav  ${(N / SR).toFixed(3)} s  ${lufs(master).toFixed(2)} LUFS  ` +
    `true peak ${truePeakDb(master).toFixed(2)} dBTP  ` +
    `max gain reduction ${master.reduction.toFixed(1)} dB`,
);

// ---------------------------------------------------------------------------
// Sound effects (each peak-normalized; the mix level lives in AdSound.tsx)
// ---------------------------------------------------------------------------

const sfx = (file, seconds, fn, peakDb = -1) => {
  const bus = makeBus(Math.round(seconds * SR));
  fn(bus);
  // Click-free tail.
  const fade = Math.round(0.004 * SR);
  for (const ch of bus) {
    for (let i = 0; i < fade; i++) ch[ch.length - 1 - i] *= i / fade;
  }
  // Peak-normalize, then trim so the true (inter-sample) peak sits there too.
  normalize(bus, peakDb);
  const over = truePeakDb(bus) - peakDb;
  if (over > 0) normalize(bus, peakDb - over);
  writeWav(file, bus);
  console.log(
    `${file.padEnd(14)}${seconds.toFixed(3)} s  true peak ${truePeakDb(bus).toFixed(2)} dBTP`,
  );
};

// Deep boom (pitch-diving sine, driven) + noise burst + mid crunch + tail.
sfx("ad-impact.wav", 2.4, (bus) => {
  const n = bus[0].length;
  const tail = makeBus(n);
  const lp = [new Biquad(), new Biquad()];
  const mid = new Biquad().set("bp", 650, 0.9);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (i % 32 === 0) {
      const fc = 260 + 9000 * Math.exp(-t * 9);
      lp[0].set("lp", fc, 0.7);
      lp[1].set("lp", fc * 1.1, 0.7);
    }
    ph += (2 * Math.PI * (33 + 105 * Math.exp(-t * 10))) / SR;
    const att = Math.min(1, t / 0.0015);
    const boom = Math.tanh(Math.sin(ph) * att * Math.exp(-t * 1.9) * 2.4) * 0.8;
    const crunch = mid.process(noise()) * Math.exp(-t * 11) * 1.1;
    const crack = t < 0.012 ? noise() * (1 - t / 0.012) * 0.55 : 0;
    const l = lp[0].process(noise()) * Math.exp(-t * 4.5) * 0.55;
    const r = lp[1].process(noise()) * Math.exp(-t * 4.5) * 0.55;
    addTo(bus, i, boom + crunch + crack + l, boom + crunch + crack + r);
    addTo(tail, i, l + crunch * 0.6, r + crunch * 0.6);
  }
  const wet = reverb(tail, { feedback: 0.83, damp: 0.35 });
  for (let ch = 0; ch < 2; ch++) {
    for (let i = 0; i < n; i++) bus[ch][i] += wet[ch][i] * 0.8;
  }
});

// Short thud + paper slap (with two flutter reflections) in a small room.
sfx("ad-stamp.wav", 0.7, (bus) => {
  const n = bus[0].length;
  const room = makeBus(n);
  const bp = new Biquad().set("bp", 2100, 0.8);
  const hp = new Biquad().set("hp", 700, 0.7);
  const bright = new Biquad().set("bp", 3600, 1.2);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (66 + 120 * Math.exp(-t * 38))) / SR;
    const att = Math.min(1, t / 0.0008);
    const thud = Math.tanh(Math.sin(ph) * att * Math.exp(-t * 20) * 2.6) * 0.85;
    const knock =
      Math.sin(2 * Math.PI * 310 * t) * Math.exp(-t * 45) * 0.25 * att;
    let slapEnv = Math.exp(-t * 85);
    for (const [o, g] of [
      [0.009, 0.45],
      [0.021, 0.25],
    ]) {
      if (t >= o) slapEnv += g * Math.exp(-(t - o) * 130);
    }
    const slap =
      hp.process(bp.process(noise())) * slapEnv * 1.7 +
      bright.process(noise()) * Math.exp(-t * 160) * 0.8;
    addTo(bus, i, thud + knock + slap * 0.92, thud + knock + slap);
    addTo(room, i, slap * 0.6 + thud * 0.25);
  }
  const wet = reverb(room, { feedback: 0.68, damp: 0.5 });
  for (let ch = 0; ch < 2; ch++) {
    for (let i = 0; i < n; i++) bus[ch][i] += wet[ch][i] * 0.5;
  }
});

// Front-loaded noise sweep: peaks 75 ms in (on the cut), then trails off
// while it pans left to right.
sfx("ad-whoosh.wav", 0.6, (bus) => {
  const n = bus[0].length;
  const peakT = 0.075;
  const bp = [new Biquad(), new Biquad()];
  const lp = [new Biquad(), new Biquad()];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (i % 32 === 0) {
      const fc =
        t < peakT
          ? 500 * 9 ** (t / peakT)
          : 700 + 3800 * Math.exp(-(t - peakT) * 5);
      bp[0].set("bp", fc, 1.3);
      bp[1].set("bp", fc * 1.12, 1.3);
      lp[0].set("lp", fc * 0.5, 0.7);
      lp[1].set("lp", fc * 0.55, 0.7);
    }
    const env = t < peakT ? (t / peakT) ** 2 : Math.exp(-(t - peakT) * 7.5);
    const pan = Math.min(1, t / 0.35);
    const l = (bp[0].process(noise()) + lp[0].process(noise()) * 0.6) * env;
    const r = (bp[1].process(noise()) + lp[1].process(noise()) * 0.6) * env;
    addTo(bus, i, l * (1 - 0.6 * pan), r * (0.4 + 0.6 * pan));
  }
});

// Crisp two-part UI click (press and release).
sfx("ad-click.wav", 0.13, (bus) => {
  const hp = new Biquad().set("hp", 2500, 0.7);
  const body = new Biquad().set("bp", 1100, 2);
  for (const [o, v, f] of [
    [0, 1, 4200],
    [0.042, 0.55, 3600],
  ]) {
    const start = Math.round(o * SR);
    for (let i = 0; i < 0.03 * SR; i++) {
      const t = i / SR;
      const s =
        (hp.process(noise()) * Math.exp(-t * 1500) * 0.9 +
          Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 700) * 0.5 +
          body.process(noise()) * Math.exp(-t * 350) * 0.6) *
        v;
      addTo(bus, start + i, s);
    }
  }
});

// 1.5 s riser: band-passed noise and a pitch sweep (with a fifth) climbing
// together, with a tremolo that speeds up; it ends at full level.
sfx("ad-riser.wav", 1.5, (bus) => {
  const n = bus[0].length;
  const bp = [new Biquad(), new Biquad()];
  let ph = 0;
  let ph5 = 0;
  let trem = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    if (i % 32 === 0) {
      const fc = 350 * 26 ** p;
      bp[0].set("bp", fc, 2.2);
      bp[1].set("bp", fc * 1.07, 2.2);
    }
    const f = 110 * 8 ** (p ** 1.3);
    ph += (2 * Math.PI * f) / SR;
    ph5 += (2 * Math.PI * f * 1.5) / SR;
    trem += (6 + 26 * p * p) / SR;
    const g = 0.78 + 0.22 * Math.cos(2 * Math.PI * trem);
    const env = p ** 2.2 * g;
    const tone = (Math.sin(ph) + 0.5 * Math.sin(ph5)) * 0.2;
    addTo(
      bus,
      i,
      (bp[0].process(noise()) * 1.8 + tone) * env,
      (bp[1].process(noise()) * 1.8 + tone) * env,
    );
  }
});

// Tiny high tick for the text slams.
sfx("ad-tick.wav", 0.09, (bus) => {
  const hp = new Biquad().set("hp", 4500, 0.7);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (2600 + 900 * Math.exp(-t * 200))) / SR;
    const s =
      Math.sin(ph) * Math.exp(-t * 170) * 0.7 * Math.min(1, t / 0.0003) +
      hp.process(noise()) * Math.exp(-t * 700) * 0.6 +
      Math.sin(2 * Math.PI * 1050 * t) * Math.exp(-t * 220) * 0.3;
    addTo(bus, i, s);
  }
});
