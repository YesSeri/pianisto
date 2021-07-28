import * as Tone from 'tone'

const g3 = new Tone.Buffer("./audio/1.g3.ogg")
const a3 = new Tone.Buffer("./audio/3.a3.ogg")
const c4 = new Tone.Buffer('./audio/6.c4.ogg');
const ds4 = new Tone.Buffer('./audio/9.ds4.ogg');
const fs4 = new Tone.Buffer('./audio/12.fs4.ogg');
const a4 = new Tone.Buffer('./audio/15.a4.ogg');
const c5 = new Tone.Buffer('./audio/18.c5.ogg');
const ds5 = new Tone.Buffer('./audio/21.ds5.ogg');
const fs5 = new Tone.Buffer('./audio/24.fs5.ogg');
const a5 = new Tone.Buffer('./audio/27.a5.ogg');
const c6 = new Tone.Buffer('./audio/29.c6.ogg');
const ds6 = new Tone.Buffer('./audio/30.ds6.ogg');
const fs6 = new Tone.Buffer('./audio/31.fs6.ogg');
const a6 = new Tone.Buffer('./audio/32.a6.ogg');

export default function sampler() {
	return new Tone.Sampler({
		urls: {
			"G1": g3,
			"A1": a3,
			"C2": c4,
			"D#2": ds4,
			"F#2": fs4,
			"A2": a4,
			"C3": c5,
			"D#3": ds5,
			"F#3": fs5,
			"A3": a5,
			"C4": c6,
			"D#4": ds6,
			"F#4": fs6,

		},
		release: 2,
	}).toDestination();
}