import { touchable } from './touchable.ts';
import { mouseable } from './mouseable.ts';
import { createSampler } from './sampler.ts';
import { NotesState } from './shared.ts';

export default async function setupPiano(notesState: NotesState) {
	const whiteGroup = document.getElementById("white-keys");
	const blackGroup = document.getElementById("black-keys");
	const pianoSvg = document.getElementById("piano");
	const spinner = document.getElementById("spinner");
	if (!(pianoSvg instanceof SVGElement)) return
	const keyWidth = 100;

	const sampler = await createSampler();
	pianoSvg?.classList.remove('loading')
	spinner?.remove();


	function hasSharp(note: string[]) {
		return ['C', 'D', 'F', 'G', 'A'].includes(note[0]);
	}

	function addSharp(note: string | any[]) {
		return `${note[0]}#${note.slice(1)}`;
	}

	function clearChildren(group: HTMLElement | null) {
		while (group?.firstChild) {
			group.removeChild(group.firstChild);
		}
	}

	function drawWhiteKeys(notes: any[]) {
		clearChildren(whiteGroup);
		notes.forEach((note: string, i: number) => {
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
			whiteGroup?.appendChild(path);
		});
	}

	function drawBlackKeys(notes: any[]) {
		clearChildren(blackGroup);
		notes.forEach((note: any, i: number) => {
			const isLast = i === notes.length - 1;
			if (!hasSharp(note) || isLast) return;

			const sharp = addSharp(note);
			const x = i * keyWidth + 65;
			const d = `M${x} 0 v170 a10 10 0 0 0 10 10 h50 a10 10 0 0 0 10 -10 V0 Z`;

			const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", d);
			path.setAttribute("id", sharp);
			path.classList.add("black-key");
			blackGroup?.appendChild(path);
		});
	}

	function draw(notes: any[]) {
		const viewBoxWidth = notes.length * keyWidth + 1;
		pianoSvg?.setAttribute("viewBox", `-1 -1 ${viewBoxWidth} 302`);
		drawWhiteKeys(notes);
		drawBlackKeys(notes);
	}

	draw(notesState.notes);
	notesState.subscribe(draw);

	function idToNote(id: string) {
		const last = parseInt(id.slice(-1));
		const base = id.slice(0, -1);
		return base + (last - 2);
	}

	function playSound(el: Element) {
		const note = idToNote(el.id);
		sampler.triggerAttack(note);
	}

	function stopSound(el: Element) {
		const note = idToNote(el?.id);
		sampler.triggerRelease(note);
	}

	[touchable, mouseable].forEach(xAble => xAble(pianoSvg, playSound, stopSound))
}