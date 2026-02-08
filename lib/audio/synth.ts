// A simple wrapper around Web Audio API to generate "8-bit" style sounds
// This avoids the need for external MP3 assets in the MVP

class AudioSynth {
  private ctx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Init on first user interaction usually, but we'll try lazy loading
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, vol: number = 0.1) {
    const ctx = this.init();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // Character Voices
  speakMerchant() {
    // Low, rough square wave
    const variance = Math.random() * 20 - 10;
    this.playTone(150 + variance, 'square', 0.05, 0.05);
  }

  speakPhoton() {
    // High, pure sine wave
    const variance = Math.random() * 50 - 25;
    this.playTone(800 + variance, 'sine', 0.05, 0.05);
  }

  speakSystem() {
    // Mechanical, consistent digital blip
    this.playTone(1000, 'square', 0.02, 0.03);
  }

  playClick() {
    this.playTone(1200, 'triangle', 0.05, 0.02);
  }

  playSuccess() {
    this.playTone(440, 'sine', 0.1);
    setTimeout(() => this.playTone(554, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(659, 'sine', 0.2), 200);
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.3, 0.2);
  }
}

export const synth = new AudioSynth();
