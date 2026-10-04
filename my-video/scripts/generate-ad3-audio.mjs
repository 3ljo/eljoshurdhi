// Synthesizes the soundtrack of the 20-second Meta ad "Nothing Happened."
// (src/ad3/): a music bed arranged to the picture plus the one-shot sound
// effects that src/ad3/Ad3Sound.tsx places on it. Built from
// scripts/generate-ad-audio.mjs (whose DSP helpers, metering and limiter are
// kept as they were): oscillators and noise only, no samples, no network.
// Run with: node scripts/generate-ad3-audio.mjs
//
// 120 BPM against 30 fps: one beat = 0.5 s = 15 frames, one bar = 60 frames.
// The bed follows the ad's sections (absolute frames):
//   0-75     HOOK   muffled A minor pad through a ~500 Hz low-pass, soft kick
//                   on 0/15/30/45; from 60 the kick is gone and the filter
//                   sinks to 300 Hz ("the room empties")
//   75-150   COST   heavy sub hit at 75, the filter opens to 1.2 kHz over
//                   84-147, a riser peaks on 150; 147-150 is a breath of
//                   silence under the riser
//   150      DROP   impact, four-on-the-floor, claps on 2 and 4, a side-chained
//                   pad, a marimba hook; C G Am F C G, one chord per bar;
//                   16th hats from 270; thinner 360-405; a one-beat break
//                   480-495 with a reverse-cymbal swell; back on 495
//   513      OUTRO  the drums stop, a C add9 chord lands in a wide hall and
//                   fades to silence over 570-600
// The master is normalized to TARGET_LUFS under a true-peak-safe limiter.

import { Buffer } from "node:buffer";
import console from "node:console";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT =
  process.env.AD3_AUDIO_OUT ??
  join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
// AD3_AUDIO_STEMS=1 also writes the unmastered stems (for checking the mix).
const STEMS = process.env.AD3_AUDIO_STEMS === "1";

const TARGET_LUFS = -14;
// Sample-peak ceiling of the limiter; lowered in steps if the true peak of
// the master still comes out above TRUE_PEAK_MAX.
const CEILING_DB = -2.0;
const TRUE_PEAK_MAX = -2.0;
// Peak level of every one-shot effect; the mix level lives in Ad3Sound.tsx.
const SFX_PEAK_DB = -3;

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

// Detuned saw stack with a sub square and an enveloped low-pass: the chord
// stabs on the drop and the outro.
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

// Marimba-like pluck: the partials of a struck bar (1, 4 and 10 times the
// fundamental, the upper ones dying fast), a soft octave for brightness and
// a short mallet knock, rounded off by a touch of tanh.
const marimba = (bus, send, t0, midi, vel = 1, pan = 0) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(0.9 * SR);
  const f = mtof(midi);
  const mallet = new Biquad().set("bp", Math.min(f * 6, 9000), 1.2);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const gr = Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const w = 2 * Math.PI * f * t;
    const att = Math.min(1, t / 0.0015);
    const s =
      Math.sin(w) * Math.exp(-t * 7) +
      Math.sin(2 * w) * 0.22 * Math.exp(-t * 14) +
      Math.sin(3.98 * w) * 0.3 * Math.exp(-t * 26) +
      Math.sin(9.85 * w) * 0.1 * Math.exp(-t * 60) +
      mallet.process(noise()) * 0.5 * Math.exp(-t * 400);
    const y = Math.tanh(s * att * 1.3) * 0.75 * vel;
    addTo(bus, start + i, y * gl, y * gr);
    addTo(send, start + i, y * 0.12);
  }
};

// Riser: band-passed noise and a pitch sweep (with a fifth) climbing
// together under a tremolo that speeds up; it ends at full level, dead on
// t0 + seconds.
const riser = (bus, t0, seconds, vel = 1) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(seconds * SR);
  const bp = [new Biquad(), new Biquad()];
  let ph = 0;
  let ph5 = 0;
  let trem = 0;
  for (let i = 0; i < len; i++) {
    const p = i / len;
    if (i % 32 === 0) {
      const fc = 400 * 22 ** p;
      bp[0].set("bp", fc, 2);
      bp[1].set("bp", fc * 1.07, 2);
    }
    const f = 110 * 8 ** (p ** 1.3);
    ph += (2 * Math.PI * f) / SR;
    ph5 += (2 * Math.PI * f * 1.5) / SR;
    trem += (5 + 25 * p * p) / SR;
    const g = 0.8 + 0.2 * Math.cos(2 * Math.PI * trem);
    const env = p ** 2.2 * g * Math.min(1, (len - i) / (0.002 * SR)) * vel;
    const tone = (Math.sin(ph) + 0.5 * Math.sin(ph5)) * 0.2;
    addTo(
      bus,
      start + i,
      (bp[0].process(noise()) * 1.8 + tone) * env,
      (bp[1].process(noise()) * 1.8 + tone) * env,
    );
  }
};

// Heavy sub hit: a sine diving from two octaves up into the note, driven
// into tanh (so phone speakers get its harmonics), over a low noise thump.
const subHit = (bus, t0, midi, vel = 1, decay = 1.6, seconds = 2.5) => {
  const start = Math.round(t0 * SR);
  const len = Math.round(seconds * SR);
  const f0 = mtof(midi);
  const lp = new Biquad().set("lp", 240, 0.7);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f0 * (1 + 3 * Math.exp(-t * 26))) / SR;
    const att = Math.min(1, t / 0.002);
    const boom =
      Math.tanh(Math.sin(ph) * att * Math.exp(-t * decay) * 2.4) * 0.8;
    const thump = lp.process(noise()) * Math.exp(-t * 14) * 0.7;
    const fade = Math.min(1, (len - i) / (0.05 * SR));
    addTo(bus, start + i, (boom + thump) * vel * fade);
  }
};

// Runs both channels of a bus through a filter whose cutoff may move with
// time (a function of seconds, re-read every 32 samples).
const filterBus = (bus, type, cutoff, q = 0.7071) => {
  const at = typeof cutoff === "function" ? cutoff : () => cutoff;
  for (const ch of bus) {
    const f = new Biquad();
    for (let i = 0; i < ch.length; i++) {
      if (i % 32 === 0) f.set(type, at(i / SR), q);
      ch[i] = f.process(ch[i]);
    }
  }
  return bus;
};

// ---------------------------------------------------------------------------
// Music arrangement
// ---------------------------------------------------------------------------

const BEAT = 0.5;
const BAR = 4 * BEAT;
const SIXTEENTH = BEAT / 4;
const LEN = 20;
const N = LEN * SR;
const sec = (frame) => frame / 30;
const EPS = 1e-6;

const DROP = sec(150);
const HATS_IN = sec(270);
const THIN = [sec(360), sec(405)];
const BREAK = [sec(480), sec(495)];
const OUTRO = sec(513);
const FADE = [sec(570), sec(600)];

// The drop progression, one chord per 60-frame bar from frame 150. Pads
// voice-lead around C4, bass roots sit in the first octave and the marimba
// hook picks from the riff tones.
const CHORDS = {
  C: { root: 36, pad: [55, 60, 64, 67], riff: [72, 76, 79, 84, 88] },
  G: { root: 31, pad: [55, 59, 62, 67], riff: [71, 74, 79, 83, 86] },
  Am: { root: 33, pad: [57, 60, 64, 67], riff: [72, 76, 81, 84, 88] },
  F: { root: 29, pad: [53, 57, 60, 64], riff: [72, 77, 81, 84, 89] },
};
const PROGRESSION = ["C", "G", "Am", "F", "C", "G"];
const chordAt = (t) => {
  const k = Math.floor((t - DROP + EPS) / BAR);
  return CHORDS[PROGRESSION[Math.max(0, Math.min(PROGRESSION.length - 1, k))]];
};
// A minor for the hook, low enough to survive a 300 Hz low-pass.
const HOOK_PAD = [45, 52, 57, 60, 64];
// C add9 for the outro: C3 G3 D4 E4 G4 C5.
const CADD9 = [48, 55, 62, 64, 67, 72];
// The hook, per bar: [16th position, index into the chord's riff tones,
// velocity]. Over C it reads G5 E5 G5 C6 G5 E6 C6.
const RIFF = [
  [0, 2, 1],
  [3, 1, 0.7],
  [6, 2, 0.85],
  [8, 3, 0.8],
  [10, 2, 0.9],
  [12, 4, 0.85],
  [14, 3, 0.75],
];

const beats = (from, to) => {
  const out = [];
  for (let t = from; t < to - EPS; t += BEAT) out.push(t);
  return out;
};
const inThin = (t) => t >= THIN[0] - EPS && t < THIN[1] - EPS;
const inBreak = (t) => t >= BREAK[0] - EPS && t < BREAK[1] - EPS;

// muffle: everything in the hook and the cost that sits behind the moving
// low-pass. free: the riser and the swell, the only sounds the gaps let
// through. hall: the outro's wide reverb send.
const muffle = makeBus(N);
const drums = makeBus(N);
const bass = makeBus(N);
const pads = makeBus(N);
const lead = makeBus(N);
const low = makeBus(N);
const fx = makeBus(N);
const free = makeBus(N);
const send = makeBus(N);
const hall = makeBus(N);
// Kicks that pump the bass, the pads and (lightly) the marimba.
const duckTimes = [];

const kickAt = (t, vel = 1) => {
  kick(drums, t, vel);
  duckTimes.push(t);
};

// HOOK 0-75: an A minor pad and a soft kick on the first four beats, both
// behind the low-pass (muffleCut), as if heard through a wall.
padChord(muffle, 0, sec(147), HOOK_PAD, 2.2, 0.01);
for (const t of beats(0, sec(60))) kick(muffle, t, 0.6);

// THE COST 75-150: a heavy sub hit, the filter opens, a riser into the drop.
subHit(low, sec(75), 33, 1, 1.4);
riser(free, sec(120), DROP - sec(120), 0.9);

// THE DROP 150: impact, crash and a chord stab on the downbeat.
impact(fx, send, DROP, 0.9);
crash(fx, send, DROP, 0.8);
stab(
  lead,
  send,
  DROP,
  CHORDS.C.pad.map((n) => n + 12),
  0.8,
  0.4,
);

// The groove from 150 to 513: kick on every beat (beats 1 and 3 only in the
// thin bars), backbeat on 2 and 4, 16th hats from 270 (-6 dB in the thin
// bars), offbeat bass. Nothing in the break; no kick on 510, 0.1 s before the
// outro chord lands.
for (const t of beats(DROP, OUTRO)) {
  if (inBreak(t)) continue;
  const beat = Math.round((t - DROP) / BEAT) % 4;
  if (t <= BREAK[1] + EPS && (!inThin(t) || beat % 2 === 0)) kickAt(t);
  if (beat % 2 === 1) backbeat(drums, send, t, 1);
  if (t >= HATS_IN - EPS) {
    const v = inThin(t) ? 0.5 : 1;
    for (const [o, h] of [
      [0, 0.07],
      [1, 0.045],
      [2, 0.16],
      [3, 0.05],
    ]) {
      if (t + o * SIXTEENTH < OUTRO - EPS) {
        hat(drums, t + o * SIXTEENTH, h * v);
      }
    }
  }
  if (t + BEAT / 2 < OUTRO - EPS) {
    bassNote(bass, t + BEAT / 2, BEAT / 2 - 0.02, chordAt(t).root, 0.9);
  }
}
// Cymbals on the hats' entry, out of the thin bars and out of the break.
crash(fx, send, HATS_IN, 0.4, 1.6);
crash(fx, send, THIN[1], 0.45, 1.6);
crash(fx, send, BREAK[1], 0.8);
impact(fx, send, BREAK[1], 0.35);
// The reverse cymbal sucking into the return (it stops dead on 495).
swell(free, BREAK[0] - 0.3, BREAK[1] - BREAK[0] + 0.3, 1);

// Side-chained pads, one chord per bar; the last one holds to the outro.
PROGRESSION.forEach((name, k) => {
  const s = DROP + k * BAR;
  const e = k === PROGRESSION.length - 1 ? OUTRO : s + BAR;
  padChord(pads, s, e - s, CHORDS[name].pad, 1, 0.05);
});

// The marimba hook, panned a little left and right note by note.
PROGRESSION.forEach((name, k) => {
  RIFF.forEach(([pos, idx, vel], n) => {
    const t = DROP + k * BAR + pos * SIXTEENTH;
    if (inBreak(t) || t >= OUTRO - EPS) return;
    marimba(lead, send, t, CHORDS[name].riff[idx], vel, n % 2 ? 0.25 : -0.2);
  });
});

// OUTRO 513-600: the drums stop and a C add9 chord lands in a wide hall: a
// marimba strum, a long saw-stack stab, the pad and a C2 808, all fading to
// silence over 570-600 (see fadeOut).
[72, 76, 79, 86].forEach((m, k) => {
  marimba(lead, hall, OUTRO + k * 0.022, m, 0.85 - k * 0.08, -0.3 + k * 0.2);
});
stab(lead, hall, OUTRO, [60, 64, 67, 74], 0.7, 1.3);
padChord(pads, OUTRO, LEN - OUTRO, CADD9, 1.15, 0);
sub808(bass, OUTRO, LEN - OUTRO, 36, 0.65);

// ---------------------------------------------------------------------------
// Mix
// ---------------------------------------------------------------------------

// The hook's low-pass: 500 Hz, down to 300 Hz over 60-75, held, then open to
// 1.2 kHz over 84-147. 4th-order (two biquads) so it sounds like a wall.
const muffleCut = (t) => {
  if (t < sec(60)) return 500;
  if (t < sec(75)) return 500 * (300 / 500) ** ((t - sec(60)) / sec(15));
  if (t < sec(84)) return 300;
  if (t < sec(147)) return 300 * (1200 / 300) ** ((t - sec(84)) / sec(63));
  return 1200;
};
filterBus(muffle, "lp", muffleCut, 0.541);
filterBus(muffle, "lp", muffleCut, 1.307);
// ... and it swells by 3.5 dB as it opens.
for (const ch of muffle) {
  for (let i = Math.round(sec(84) * SR); i < N; i++) {
    ch[i] *= 1 + 0.5 * Math.min(1, (i / SR - sec(84)) / sec(63));
  }
}
// The drop's pads stay warm under the marimba.
filterBus(pads, "lp", 2600, 0.7);

// Silence (apart from the free bus) in the breath before the drop and in the
// one-beat break; closes over 6 ms, reopens over 1.5 ms.
const GAPS = [
  [sec(147), DROP],
  [BREAK[0], BREAK[1]],
];
const gate = (t) => {
  let g = 1;
  for (const [a, b] of GAPS) {
    if (t > a - 0.006 && t < b + 0.0015) {
      g = Math.min(g, Math.max(0, (a - t) / 0.006, (t - b) / 0.0015));
    }
  }
  return g;
};
// 1 ms in, then a raised-cosine fade to silence over 570-600.
const fadeOut = (t) => {
  if (t < 0.001) return t / 0.001;
  if (t < FADE[0]) return 1;
  return 0.5 * (1 + Math.cos((Math.PI * (t - FADE[0])) / (FADE[1] - FADE[0])));
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

const leadFx = pingPong(lead, BEAT * 0.75, 0.3, 0.26);
for (let i = 0; i < N; i++) {
  const outro = i >= OUTRO * SR ? 1 : 0;
  for (let ch = 0; ch < 2; ch++) {
    send[ch][i] +=
      muffle[ch][i] * 0.3 + pads[ch][i] * 0.3 + leadFx[ch][i] * 0.12;
    hall[ch][i] += pads[ch][i] * 0.5 * outro;
  }
}
const verb = reverb(send, { feedback: 0.84, damp: 0.3 });
// The outro hall: longer and brighter, then widened (side +4 dB).
const hallWet = reverb(hall, { feedback: 0.9, damp: 0.2 });
for (let i = 0; i < N; i++) {
  const m = (hallWet[0][i] + hallWet[1][i]) * 0.5;
  const s = (hallWet[0][i] - hallWet[1][i]) * 0.5 * 1.6;
  hallWet[0][i] = m + s;
  hallWet[1][i] = m - s;
}

// Stem levels; d is the sidechain (0 on a pumping kick, back to 1 after).
const LEVEL = {
  muffle: () => 1.0,
  drums: () => 0.9,
  bass: (d) => 0.85 * (0.3 + 0.7 * d),
  pads: (d) => 2.1 * (0.4 + 0.6 * d),
  lead: (d) => 0.7 * (0.8 + 0.2 * d),
  low: () => 0.7,
  fx: () => 0.8,
  verb: () => 0.9,
  hall: () => 1.7,
  free: () => 0.8,
};
const STEM_BUSES = {
  muffle,
  drums,
  bass,
  pads,
  lead: leadFx,
  low,
  fx,
  verb,
  hall: hallWet,
  free,
};

if (STEMS) {
  mkdirSync(OUT, { recursive: true });
  for (const [name, bus] of Object.entries(STEM_BUSES)) {
    const level = LEVEL[name];
    writeWav(
      `ad3-stem-${name}.wav`,
      bus.map((ch) => ch.map((v, i) => v * level(duck[i]) * 0.5)),
    );
  }
}

// Everything but the free bus goes through the gate.
const GATED = Object.entries(STEM_BUSES)
  .filter(([name]) => name !== "free")
  .map(([name, bus]) => [bus, LEVEL[name]]);
const mix = makeBus(N);
for (let ch = 0; ch < 2; ch++) {
  const dc = new Biquad().set("hp", 28, 0.7);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const d = duck[i];
    let bed = 0;
    for (const [bus, level] of GATED) bed += bus[ch][i] * level(d);
    const out = bed * gate(t) + free[ch][i] * LEVEL.free(d);
    mix[ch][i] = dc.process(out) * fadeOut(t);
  }
}

// Master: find the gain that lands the limited mix on TARGET_LUFS, and pull
// the ceiling down if the true peak still comes out too high.
let ceiling = CEILING_DB;
let gain = 1;
let master = limiter(mix, ceiling, gain);
for (let attempt = 0; attempt < 6; attempt++) {
  for (let pass = 0; pass < 5; pass++) {
    gain *= 10 ** ((TARGET_LUFS - lufs(master)) / 20);
    master = limiter(mix, ceiling, gain);
  }
  if (truePeakDb(master) <= TRUE_PEAK_MAX) break;
  ceiling -= 0.25;
  master = limiter(mix, ceiling, gain);
}

mkdirSync(OUT, { recursive: true });
writeWav("ad3-bed.wav", master);
console.log(
  `ad3-bed.wav         ${(N / SR).toFixed(3)} s  ${lufs(master).toFixed(2)} LUFS  ` +
    `true peak ${truePeakDb(master).toFixed(2)} dBTP  ` +
    `ceiling ${ceiling.toFixed(2)} dB  ` +
    `max gain reduction ${master.reduction.toFixed(1)} dB`,
);

// ---------------------------------------------------------------------------
// Sound effects (each peak-normalized; the mix level lives in Ad3Sound.tsx)
// ---------------------------------------------------------------------------

const sfx = (file, seconds, fn, peakDb = SFX_PEAK_DB) => {
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
    `${file.padEnd(20)}${seconds.toFixed(3)} s  true peak ${truePeakDb(bus).toFixed(2)} dBTP`,
  );
};

const semis = (n) => 2 ** (n / 12);
const panGains = (pan) => [
  Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2,
  Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2,
];

// A small room around a dry bus, mixed in at `mix`.
const addRoom = (bus, mix, opts = { feedback: 0.78, damp: 0.4 }) => {
  const wet = reverb(bus, opts);
  for (let ch = 0; ch < 2; ch++) {
    for (let i = 0; i < bus[0].length; i++) bus[ch][i] += wet[ch][i] * mix;
  }
};

// One struck, bell-like note: partials [ratio, level, decay multiplier], a
// slight detune on the right for width, a 1.5 ms attack.
const bellNote = (bus, t0, midi, { vel = 1, decay = 3, partials, pan = 0 }) => {
  const start = Math.round(t0 * SR);
  const f = mtof(midi);
  const [gl, gr] = panGains(pan);
  for (let i = 0; start + i < bus[0].length; i++) {
    const t = i / SR;
    const att = Math.min(1, t / 0.0015);
    let l = 0;
    let r = 0;
    for (const [ratio, amp, rate] of partials) {
      const e = amp * Math.exp(-t * decay * rate);
      l += Math.sin(2 * Math.PI * f * ratio * t) * e;
      r += Math.sin(2 * Math.PI * f * ratio * 1.0015 * t) * e;
    }
    addTo(bus, start + i, l * att * vel * gl, r * att * vel * gr);
  }
};
// Glassy and bright (chime, confirm); rounder and shorter (ding).
const GLASS = [
  [1, 1, 1],
  [2, 0.45, 1.8],
  [3, 0.12, 2.8],
  [4, 0.18, 3.6],
  [8, 0.05, 9],
];
const SOFT_BELL = [
  [1, 1, 1],
  [2, 0.3, 2.2],
  [2.76, 0.06, 4],
  [4, 0.05, 5],
];

// Crisp UI tap: a noise click, a short pitched "tock" and a little body.
const tap = (pitch) => (bus) => {
  const k = semis(pitch);
  const hp = new Biquad().set("hp", 3200 * k, 0.7);
  const body = new Biquad().set("bp", 1250 * k, 2.5);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * k * (1900 + 1100 * Math.exp(-t * 500))) / SR;
    const att = Math.min(1, t / 0.0002);
    const s =
      hp.process(noise()) * Math.exp(-t * 2400) * 0.9 +
      Math.sin(ph) * Math.exp(-t * 330) * 0.5 * att +
      body.process(noise()) * Math.exp(-t * 220) * 1.4 +
      Math.sin(2 * Math.PI * 340 * k * t) * Math.exp(-t * 140) * 0.16 * att;
    addTo(bus, i, s * 0.94, s);
  }
};
sfx("ad3-tap.wav", 0.08, tap(0));
// The toggle's "clack", a semitone above the "click".
sfx("ad3-tap-up1.wav", 0.08, tap(1));

// Tiny high tick: a 3.6 kHz blip and a hiss of noise, 30 ms.
const tick = (pitch) => (bus) => {
  const k = semis(pitch);
  const hp = new Biquad().set("hp", 5200 * k, 0.7);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * k * (3600 + 1400 * Math.exp(-t * 600))) / SR;
    const s =
      Math.sin(ph) * Math.exp(-t * 520) * 0.55 * Math.min(1, t / 0.00015) +
      hp.process(noise()) * Math.exp(-t * 1600) * 0.7;
    addTo(bus, i, s);
  }
};
sfx("ad3-tick.wav", 0.035, tick(0));
// A second key for the typing, so it does not machine-gun.
sfx("ad3-tick-down2.wav", 0.035, tick(-2));

// Dull low thud: a driven sine diving 140 -> 55 Hz over low-passed noise.
sfx("ad3-thud.wav", 0.45, (bus) => {
  const lp = new Biquad().set("lp", 350, 0.7);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (55 + 85 * Math.exp(-t * 30))) / SR;
    const att = Math.min(1, t / 0.002);
    const body = Math.tanh(Math.sin(ph) * Math.exp(-t * 10) * att * 1.8) * 0.85;
    const thump = lp.process(noise()) * Math.exp(-t * 28) * 0.9;
    addTo(bus, i, body + thump);
  }
});

// Muted low "bonk", a dead button: a hollow G3 (wood-like inharmonic
// partials) that sags a little in pitch, behind a 1.3 kHz low-pass.
sfx("ad3-bonk.wav", 0.32, (bus) => {
  const lp = new Biquad().set("lp", 1300, 0.7);
  const knockLp = new Biquad().set("lp", 900, 0.7);
  const f0 = mtof(55);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    const f =
      f0 * (1 + 0.18 * Math.exp(-t * 70)) * (1 - 0.06 * Math.min(1, t / 0.3));
    ph += (2 * Math.PI * f) / SR;
    const att = Math.min(1, t / 0.001);
    const tone =
      Math.sin(ph) * Math.exp(-t * 14) +
      0.3 * Math.sin(2.71 * ph) * Math.exp(-t * 30) +
      0.12 * Math.sin(4.2 * ph) * Math.exp(-t * 55);
    const knock = knockLp.process(noise()) * Math.exp(-t * 600) * 0.4;
    addTo(bus, i, lp.process(Math.tanh((tone * att + knock) * 1.4)));
  }
});

// Fast whoosh rising in pitch: resonant and broad band-passes climbing
// 600 Hz -> 7 kHz, peaking at 0.3 s, panned left to right.
sfx("ad3-swipe.wav", 0.4, (bus) => {
  const narrow = [new Biquad(), new Biquad()];
  const broad = [new Biquad(), new Biquad()];
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    if (i % 32 === 0) {
      const fc = 600 * (7000 / 600) ** Math.min(1, t / 0.32);
      narrow[0].set("bp", fc, 3.5);
      narrow[1].set("bp", fc * 1.06, 3.5);
      broad[0].set("bp", fc * 0.8, 0.8);
      broad[1].set("bp", fc * 0.85, 0.8);
    }
    const env = t < 0.3 ? (t / 0.3) ** 2 : Math.max(0, (0.4 - t) / 0.1) ** 1.5;
    const pan = Math.min(1, t / 0.35);
    const l =
      (narrow[0].process(noise()) * 1.4 + broad[0].process(noise())) * env;
    const r =
      (narrow[1].process(noise()) * 1.4 + broad[1].process(noise())) * env;
    addTo(bus, i, l * (1 - 0.6 * pan), r * (0.4 + 0.6 * pan));
  }
});

// Low falling whoosh: a band-pass sinking 2.2 kHz -> 140 Hz with a sine
// sliding 260 -> 50 Hz under it.
sfx("ad3-sink.wav", 0.6, (bus) => {
  const n = bus[0].length;
  const bp = [new Biquad(), new Biquad()];
  const lp = new Biquad();
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const p = i / n;
    if (i % 32 === 0) {
      const fc = 2200 * (140 / 2200) ** p;
      bp[0].set("bp", fc, 1.2);
      bp[1].set("bp", fc * 1.08, 1.2);
      lp.set("lp", fc * 0.6, 0.7);
    }
    ph += (2 * Math.PI * 260 * (50 / 260) ** p) / SR;
    const env = t < 0.07 ? (t / 0.07) ** 1.5 : Math.exp(-(t - 0.07) * 4.2);
    const tone = Math.tanh(Math.sin(ph) * 1.5) * 0.35;
    const rumble = lp.process(noise()) * 0.8;
    addTo(
      bus,
      i,
      (bp[0].process(noise()) + rumble + tone) * env,
      (bp[1].process(noise()) + rumble + tone) * env,
    );
  }
});

// Heavy sub hit on A1 (the hook's key) and on G1 (for the G bar at 466).
sfx("ad3-sub.wav", 1.4, (bus) => subHit(bus, 0, 33, 1, 2.2, 1.4));
sfx("ad3-sub-down2.wav", 1.4, (bus) => subHit(bus, 0, 31, 1, 2.2, 1.4));

// Airy, wide swoosh: independent noise left and right through a wide
// band-pass that climbs to 7 kHz at 0.2 s and settles back, with air on top.
sfx("ad3-swoosh.wav", 0.5, (bus) => {
  const bp = [new Biquad(), new Biquad()];
  const air = [
    new Biquad().set("hs", 7000, 0.7, 6),
    new Biquad().set("hs", 7000, 0.7, 6),
  ];
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    if (i % 32 === 0) {
      const fc =
        t < 0.2
          ? 1200 * (7000 / 1200) ** (t / 0.2)
          : 7000 * (2500 / 7000) ** ((t - 0.2) / 0.3);
      bp[0].set("bp", fc, 0.7);
      bp[1].set("bp", fc * 1.12, 0.7);
    }
    const env = t < 0.2 ? (t / 0.2) ** 2.2 : Math.exp(-(t - 0.2) * 9);
    const pan = Math.min(1, t / 0.45);
    const l = air[0].process(bp[0].process(noise())) * env;
    const r = air[1].process(bp[1].process(noise())) * env;
    addTo(bus, i, l * (1 - 0.5 * pan), r * (0.5 + 0.5 * pan));
  }
});

// Success chime: E5 then B5 0.1 s later, glassy, in a small room.
sfx("ad3-chime.wav", 1.4, (bus) => {
  bellNote(bus, 0, 76, { vel: 0.8, decay: 3.2, partials: GLASS, pan: -0.2 });
  bellNote(bus, 0.1, 83, { vel: 1, decay: 2.8, partials: GLASS, pan: 0.2 });
  addRoom(bus, 0.25);
});

// Phone buzz: two 90 ms bursts (60 ms apart) of a driven 180 Hz motor with a
// 30 Hz tremolo and a little rattle.
sfx("ad3-buzz.wav", 0.28, (bus) => {
  const lp = new Biquad().set("lp", 2200, 0.7);
  const rattle = new Biquad().set("bp", 1100, 2);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    let env = 0;
    let trem = 0;
    for (const o of [0, 0.15]) {
      const u = t - o;
      if (u >= 0 && u < 0.09) {
        env = Math.min(1, u / 0.006, (0.09 - u) / 0.008);
        trem = 0.55 + 0.45 * Math.cos(2 * Math.PI * 30 * u);
      }
    }
    ph += (2 * Math.PI * 180) / SR;
    const motor = Math.tanh(Math.sin(ph) * 2.2) + 0.25 * Math.sin(2 * ph);
    const s =
      lp.process(motor * 0.8 + rattle.process(noise()) * 0.5) * env * trem;
    addTo(bus, i, s);
  }
});

// Tiny pop: a sine gliding up an octave into G5 in a few ms, gone in 0.1 s.
const pop = (pitch) => (bus) => {
  const f0 = mtof(79 + pitch);
  let ph = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f0 * (1 - 0.5 * Math.exp(-t * 180))) / SR;
    const env = Math.min(1, t / 0.0006) * Math.exp(-t * 48);
    addTo(bus, i, (Math.sin(ph) + 0.12 * Math.sin(2 * ph)) * env);
  }
};
sfx("ad3-pop.wav", 0.1, pop(0));
sfx("ad3-pop-up4.wav", 0.1, pop(4));
sfx("ad3-pop-up7.wav", 0.1, pop(7));

// Notification ding: a rounder, shorter bell on C6; +4 and +7 climb the
// triad (C6 E6 G6, Am7 tones over the Am bar they play in).
const ding = (pitch) => (bus) => {
  bellNote(bus, 0, 84 + pitch, { decay: 4, partials: SOFT_BELL });
  addRoom(bus, 0.2);
};
sfx("ad3-ding.wav", 1.0, ding(0));
sfx("ad3-ding-up4.wav", 1.0, ding(4));
sfx("ad3-ding-up7.wav", 1.0, ding(7));

// Pen scribble: noise through two band-passes (2-4 kHz) shaped into strokes
// of uneven length and pressure, the pitch lifting in the middle of each.
sfx("ad3-scribble.wav", 0.5, (bus) => {
  const strokes = [];
  for (let t = 0.008; t < 0.47; ) {
    const len = Math.min(0.03 + rand() * 0.05, 0.485 - t);
    strokes.push([t, len, 0.45 + rand() * 0.55]);
    t += len + rand() * 0.012;
  }
  const bpA = new Biquad();
  const bpB = new Biquad();
  const hp = new Biquad().set("hp", 1500, 0.7);
  let k = 0;
  for (let i = 0; i < bus[0].length; i++) {
    const t = i / SR;
    while (k < strokes.length - 1 && t >= strokes[k + 1][0]) k++;
    const [s0, len, amp] = strokes[k];
    const u = (t - s0) / len;
    const inStroke = u >= 0 && u <= 1;
    if (i % 32 === 0) {
      const fc = 2300 + 1300 * (inStroke ? Math.sin(Math.PI * u) : 0);
      bpA.set("bp", fc, 1.6);
      bpB.set("bp", fc * 1.3, 2);
    }
    const env = inStroke ? Math.sin(Math.PI * u) ** 0.6 * amp : 0;
    const grain = 0.7 + 0.3 * noise();
    const s =
      hp.process(bpA.process(noise()) + bpB.process(noise()) * 0.6) *
      env *
      grain;
    addTo(bus, i, s * 0.95, s);
  }
});

// Short shutter swish: a soft mechanical tick, then a band-pass falling
// 6.5 -> 1.6 kHz with a fast attack, panned right to left.
sfx("ad3-swish.wav", 0.3, (bus) => {
  const n = bus[0].length;
  const bp = [new Biquad(), new Biquad()];
  const hp = new Biquad().set("hp", 4000, 0.7);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const p = i / n;
    if (i % 32 === 0) {
      const fc = 6500 * (1600 / 6500) ** (p ** 0.7);
      bp[0].set("bp", fc * 1.08, 0.9);
      bp[1].set("bp", fc, 0.9);
    }
    const env = t < 0.018 ? (t / 0.018) ** 2 : Math.exp(-(t - 0.018) * 14);
    const click = hp.process(noise()) * Math.exp(-t * 1800) * 0.35;
    const pan = Math.min(1, t / 0.25);
    const l = bp[0].process(noise()) * env + click;
    const r = bp[1].process(noise()) * env + click;
    addTo(bus, i, l * (0.4 + 0.6 * pan), r * (1 - 0.6 * pan));
  }
});

// Bright confirm: a quick G5 C6 E6 sparkle (C add9 tones) in a small room.
sfx("ad3-confirm.wav", 1.5, (bus) => {
  [
    [0, 79, 0.7, -0.25],
    [0.055, 84, 0.85, 0.05],
    [0.11, 88, 1, 0.25],
  ].forEach(([t, m, vel, pan]) => {
    bellNote(bus, t, m, { vel, decay: 2.6, partials: GLASS, pan });
  });
  addRoom(bus, 0.3, { feedback: 0.8, damp: 0.35 });
});
