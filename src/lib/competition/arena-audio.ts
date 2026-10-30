export type ArenaCue = 'click' | 'select' | 'lock' | 'start' | 'tick' | 'win';
export interface ArenaAudioPreferences { music: boolean; effects: boolean; musicVolume: number; effectsVolume: number }
export const defaultArenaAudio: ArenaAudioPreferences = { music: false, effects: false, musicVolume: 55, effectsVolume: 65 };

/** Original procedural soundtrack. No remote audio, downloads or licensed samples. */
export class ArenaAudio {
  private context: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private effectsBus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private sources = new Set<OscillatorNode>();
  private nextBeat = 0;
  private beat = 0;
  private hidden = false;
  private focused = false;
  private settings = { ...defaultArenaAudio };

  async unlock() {
    if (!this.context) {
      this.context = new AudioContext();
      this.musicBus = this.context.createGain();
      this.effectsBus = this.context.createGain();
      this.musicBus.connect(this.context.destination);
      this.effectsBus.connect(this.context.destination);
    }
    await this.context.resume();
    this.apply();
  }

  configure(settings: ArenaAudioPreferences, focused: boolean) {
    this.settings = settings;
    this.focused = focused;
    this.apply();
  }

  visibility(hidden: boolean) {
    this.hidden = hidden;
    if (hidden) { this.stopMusic(); void this.context?.suspend(); }
    else if (this.context) { void this.context.resume().then(() => this.apply()).catch(() => {}); }
  }

  private apply() {
    const ctx = this.context;
    if (!ctx || !this.musicBus || !this.effectsBus) return;
    this.musicBus.gain.setTargetAtTime(this.settings.music && !this.hidden ? this.settings.musicVolume / 100 * (this.focused ? .20 : .55) : 0, ctx.currentTime, .12);
    this.effectsBus.gain.setTargetAtTime(this.settings.effects && !this.hidden ? this.settings.effectsVolume / 100 * .45 : 0, ctx.currentTime, .025);
    if (this.settings.music && !this.hidden && ctx.state === 'running') this.startMusic();
    else this.stopMusic();
  }

  private note(frequency: number, when: number, duration: number, bus: GainNode, volume = .4, type: OscillatorType = 'sine', slide?: number) {
    const ctx = this.context;
    if (!ctx) return;
    const source = ctx.createOscillator(), envelope = ctx.createGain();
    source.type = type;
    source.frequency.setValueAtTime(frequency, when);
    if (slide) source.frequency.exponentialRampToValueAtTime(slide, when + duration * .85);
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(volume, when + .012);
    envelope.gain.exponentialRampToValueAtTime(.0001, when + duration);
    source.connect(envelope); envelope.connect(bus);
    this.sources.add(source);
    source.onended = () => { source.disconnect(); envelope.disconnect(); this.sources.delete(source); };
    source.start(when); source.stop(when + duration + .02);
  }

  private startMusic() {
    if (this.timer || !this.context || !this.musicBus) return;
    this.nextBeat = this.context.currentTime + .06;
    const schedule = () => {
      if (!this.context || !this.musicBus || this.context.state !== 'running') return;
      // Four-bar, syncopated C-major/A-minor loop, with soft bass and a pulse.
      const melody = [72, 0, 76, 79, 0, 76, 74, 0, 69, 0, 72, 76, 0, 74, 72, 0, 65, 0, 69, 72, 0, 69, 67, 0, 67, 0, 71, 74, 0, 71, 72, 0];
      const roots = [48, 45, 41, 43];
      while (this.nextBeat < this.context.currentTime + .32) {
        const step = this.beat % 32, pitch = melody[step];
        const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
        if (pitch) this.note(hz(pitch), this.nextBeat, .19, this.musicBus, .24, 'triangle');
        if (step % 4 === 0) this.note(hz(roots[Math.floor(step / 8)]), this.nextBeat, .38, this.musicBus, .4);
        if (step % 8 === 0) this.note(110, this.nextBeat, .12, this.musicBus, .25, 'sine', 43);
        this.nextBeat += .24; this.beat++;
      }
    };
    schedule(); this.timer = setInterval(schedule, 180);
  }

  private stopMusic() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  cue(cue: ArenaCue) {
    if (!this.context || !this.effectsBus || !this.settings.effects || this.hidden || this.context.state !== 'running') return;
    const at = this.context.currentTime, bus = this.effectsBus;
    if (cue === 'win') [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((hz, i) => this.note(hz, at + i * .105, .28, bus, .32, 'triangle'));
    else if (cue === 'start') [261.6, 392, 523.25].forEach((hz, i) => this.note(hz, at + i * .08, .18, bus, .3, 'triangle'));
    else if (cue === 'select') this.note(440, at, .075, bus, .28, 'sine', 660);
    else if (cue === 'lock') { this.note(392, at, .08, bus, .3); this.note(784, at + .07, .12, bus, .24); }
    else if (cue === 'tick') this.note(880, at, .065, bus, .2);
    else this.note(340, at, .045, bus, .18, 'sine', 520);
  }

  dispose() {
    this.stopMusic();
    this.sources.forEach(source => { try { source.stop(); } catch { /* Already ended. */ } });
    this.sources.clear();
    void this.context?.close(); this.context = null;
  }
}
