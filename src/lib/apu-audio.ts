/**
 * Tiny WebAudio engine — no asset files needed, never autoplays.
 * Everything is synthesised so the experience can never break on a 404.
 */

type Ctx = AudioContext | null;

let ctx: Ctx = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicNodes: { stop: () => void } | null = null;
let muted = false;
const listeners = new Set<(m: boolean) => void>();

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isMuted() {
  return muted;
}

export function onMuteChange(fn: (m: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.05);
  listeners.forEach((l) => l(muted));
}

export function toggleMute() {
  setMuted(!muted);
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.15,
  delay = 0,
  slideTo?: number,
) {
  const c = ac();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur: number, gain = 0.12, filterFreq = 1200) {
  const c = ac();
  if (!c || !master) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = filterFreq;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(master);
  src.start();
}

export const sfx = {
  type: () => tone(1400 + Math.random() * 300, 0.03, "square", 0.02),
  click: () => tone(520, 0.08, "triangle", 0.09, 0, 900),
  hover: () => tone(880, 0.05, "sine", 0.03),
  glitch: () => {
    noise(0.18, 0.09, 700 + Math.random() * 1800);
    tone(90, 0.15, "sawtooth", 0.06, 0, 40);
  },
  deny: () => {
    tone(220, 0.18, "sawtooth", 0.09, 0, 110);
    tone(160, 0.25, "square", 0.05, 0.08, 80);
  },
  success: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.35, "triangle", 0.1, i * 0.07));
  },
  unlock: () => {
    [392, 523.25, 659.25, 880, 1174.66].forEach((f, i) => tone(f, 0.5, "sine", 0.11, i * 0.08));
    noise(0.4, 0.05, 2400);
  },
  boom: () => {
    noise(0.9, 0.28, 220);
    tone(70, 0.9, "sine", 0.28, 0, 30);
    [261, 329, 392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.8, "triangle", 0.09, 0.12 + i * 0.05));
  },
  funny: () => {
    tone(400, 0.12, "square", 0.08, 0, 200);
    tone(300, 0.14, "square", 0.07, 0.1, 140);
  },
  pop: () => tone(1200, 0.06, "sine", 0.07, 0, 400),
  whoosh: () => noise(0.5, 0.08, 500),
  heartbeat: () => {
    tone(60, 0.22, "sine", 0.22);
    tone(55, 0.26, "sine", 0.18, 0.24);
  },
};

/** Ambient pad. mood: "dark" | "warm" | "party" */
export function startMusic(mood: "dark" | "warm" | "party" = "dark") {
  const c = ac();
  if (!c || !master) return;
  stopMusic();
  musicGain = c.createGain();
  musicGain.gain.value = 0;
  musicGain.connect(master);
  musicGain.gain.setTargetAtTime(mood === "party" ? 0.16 : 0.1, c.currentTime, 1.2);

  const chords: Record<string, number[]> = {
    dark: [110, 164.81, 220, 277.18],
    warm: [130.81, 196, 261.63, 329.63],
    party: [146.83, 220, 293.66, 440],
  };
  const oscs = chords[mood].map((f, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = i % 2 ? "sine" : "triangle";
    o.frequency.value = f;
    g.gain.value = 0.25 / (i + 1);
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 0.06 + i * 0.03;
    lg.gain.value = 0.12 / (i + 1);
    lfo.connect(lg).connect(g.gain);
    lfo.start();
    o.connect(g).connect(musicGain!);
    o.start();
    return () => {
      o.stop();
      lfo.stop();
    };
  });
  musicNodes = { stop: () => oscs.forEach((s) => s()) };
}

export function stopMusic() {
  if (musicNodes) {
    try {
      musicNodes.stop();
    } catch {
      /* noop */
    }
    musicNodes = null;
  }
  musicGain?.disconnect();
  musicGain = null;
}
