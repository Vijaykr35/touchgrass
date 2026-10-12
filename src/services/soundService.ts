// Web Audio API ambient chime and sound generator for TouchGrass
// Works completely offline in the browser without any external sound file assets

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("touchgrass_sound_muted", muted ? "true" : "false");
      } catch {}
    }
  }

  public getMuted(): boolean {
    if (typeof window !== "undefined") {
      try {
        const val = localStorage.getItem("touchgrass_sound_muted");
        if (val !== null) this.isMuted = val === "true";
      } catch {}
    }
    return this.isMuted;
  }

  // Soft wooden click when picking custom timer or pressing buttons
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // Gentle outdoor chime when starting a walk
  public playStartChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.8);
      });
    } catch {}
  }

  // Warm bell chime when checking off a task
  public playStepComplete() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [587.33, 880]; // D5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch {}
  }

  // Relaxing gong/bowl chime when timer reaches 00:00 (walk finished)
  public playWalkFinished() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // Singing bowl harmonic frequencies
      const freqs = [392.0, 587.33, 783.99]; // G4, D5, G5
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 3.0);
      });
    } catch {}
  }
}

export const soundService = new SoundService();
