// Zero-dependency Web Audio API synthesizer for tactile UI sounds
window.SoundFX = {
  enabled: true,
  ctx: null,

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'add') {
        // High cheery pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === 'click') {
        // Subtle micro-click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
      } else if (type === 'remove') {
        // Downward tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(240, t + 0.09);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === 'success') {
        // 4-note ascending fanfare
        [
          { f: 523.25, time: 0 },
          { f: 659.25, time: 0.1 },
          { f: 783.99, time: 0.2 },
          { f: 1046.50, time: 0.3 }
        ].forEach(note => {
          const nOsc = this.ctx.createOscillator();
          const nGain = this.ctx.createGain();
          nOsc.type = 'triangle';
          nOsc.frequency.setValueAtTime(note.f, t + note.time);
          nGain.gain.setValueAtTime(0.12, t + note.time);
          nGain.gain.exponentialRampToValueAtTime(0.001, t + note.time + 0.25);
          nOsc.connect(nGain);
          nGain.connect(this.ctx.destination);
          nOsc.start(t + note.time);
          nOsc.stop(t + note.time + 0.25);
        });
      }
    } catch (e) {
      // Audio not permitted or unsupported, fail gracefully
    }
  }
};
