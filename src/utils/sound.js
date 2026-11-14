// Zero-asset Web Audio API synthesizer for Jezero 6: Mission Mars

class SpaceAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientGain = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientRunning = false;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  }

  ensureContext() {
    if (!this.enabled) return false;
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  setEnabled(value) {
    this.enabled = value;
    if (!value) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  startAmbient() {
    if (!this.ensureContext() || this.ambientRunning) return;
    try {
      const now = this.ctx.currentTime;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(220, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 1.5);

      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(65.41, now); // C2 warm hum

      const osc2 = this.ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(98.0, now); // G2 fifth

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientGain = gain;
      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
      this.ambientRunning = true;
    } catch {
      // Ignore audio errors on restricted environments
    }
  }

  stopAmbient() {
    if (!this.ambientRunning || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.ambientGain) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      }
      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
        } catch {
          // ignore
        }
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientGain = null;
        this.ambientRunning = false;
      }, 350);
    } catch {
      this.ambientRunning = false;
    }
  }

  playTone(freq, duration = 0.12, type = "sine", volume = 0.12, delay = 0) {
    if (!this.ensureContext()) return;
    try {
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // ignore
    }
  }

  playClick() {
    this.playTone(540, 0.07, "sine", 0.09);
  }

  playSuccess() {
    this.playTone(523.25, 0.14, "sine", 0.1, 0);
    this.playTone(659.25, 0.16, "sine", 0.1, 0.08);
    this.playTone(783.99, 0.22, "sine", 0.11, 0.16);
  }

  playAlert() {
    this.playTone(320, 0.18, "triangle", 0.12, 0);
    this.playTone(240, 0.25, "triangle", 0.12, 0.18);
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone(n, 0.28, "sine", 0.11, i * 0.11);
    });
  }
}

export const spaceAudio = new SpaceAudio();
