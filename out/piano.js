import state from "./shared.js";
import { createSampler, isSamplerLoaded } from './sampler.js';
import touchable from './touchable.js';
import mouseable from './mouseable.js';

const keyWidth = 100;
const whiteGroup = document.getElementById("white-keys");
const blackGroup = document.getElementById("black-keys");
const pianoSvg = document.getElementById("piano");

let sampler;

function hasSharp(note) {
	return ['C', 'D', 'F', 'G', 'A'].includes(note[0]);
}

function addSharp(note) {
	return `${note[0]}#${note.slice(1)}`;
}

function clearChildren(group) {
	while (group.firstChild) {
		group.removeChild(group.firstChild);
	}
}

function drawWhiteKeys(notes) {
	clearChildren(whiteGroup);
	notes.forEach((note, i) => {
		const isFirst = i === 0;
		const isLast = i === notes.length - 1;
		const x = i * keyWidth;

		let d = isFirst
			? `M0 0 v290 a10 10 0 0 0 10 10 h90 v-300 Z`
			: isLast
				? `M${x} 0 v300 h90 a10 10 0 0 0 10 -10 v-290 Z`
				: `M${x} 0 v300 h100 v-300 Z`;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", d);
		path.setAttribute("id", note);
		path.classList.add("white-key");
		whiteGroup.appendChild(path);
	});
}

function drawBlackKeys(notes) {
	clearChildren(blackGroup);
	notes.forEach((note, i) => {
		const isLast = i === notes.length - 1;
		if (!hasSharp(note) || isLast) return;

		const sharp = addSharp(note);
		const x = i * keyWidth + 65;
		const d = `M${x} 0 v170 a10 10 0 0 0 10 10 h50 a10 10 0 0 0 10 -10 V0 Z`;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", d);
		path.setAttribute("id", sharp);
		path.classList.add("black-key");
		blackGroup.appendChild(path);
	});
}

function draw(notes) {
	const viewBoxWidth = notes.length * keyWidth + 1;
	pianoSvg.setAttribute("viewBox", `-1 -1 ${viewBoxWidth} 302`);
	drawWhiteKeys(notes);
	drawBlackKeys(notes);
}

draw(state.notes);
state.subscribe(draw);

function idToNote(id) {
	const last = id.slice(-1);
	const base = id.slice(0, -1);
	return base + (+last - 2);
}

function playSound(el) {
	if (!sampler) {
		sampler = createSampler();
	};
	if (!isSamplerLoaded()) {
		return;
	}
	const note = idToNote(el?.id);
	try {
		sampler.triggerAttack(note);
	} catch (err) {
		console.error("Sampler not ready:", err);
	}
}

function stopSound(el) {
	console.log(el)
	if (!sampler) return;
	const note = idToNote(el?.id);
	sampler.triggerRelease(note);
}

[touchable, mouseable].forEach(xAble => xAble(pianoSvg, playSound, stopSound))

// touchable(pianoSvg, playSound, stopSound);