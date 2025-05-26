import { touchable } from "./touchable.ts";
import { mouseable } from "./mouseable.ts";
import { createSampler } from "./sampler.ts";
import {
  NotesState,
  translations,
  noteToKey,
  CheckboxState,
} from "./shared.ts";
import { keyable } from "./keyable.ts";

export default async function setupPiano(
  notesState: NotesState,
  checkboxState: CheckboxState
) {
  const whiteGroup = document.getElementById("white-keys");
  const blackGroup = document.getElementById("black-keys");
  const pianoSvg = document.getElementById("piano");
  const spinner = document.getElementById("spinner");
  if (!(pianoSvg instanceof SVGElement)) return;
  const keyWidth = 100;

  const sampler = await createSampler();
  pianoSvg?.classList.remove("loading");
  spinner?.remove();

  function hasSharp(note: string[]) {
    return ["C", "D", "F", "G", "A"].includes(note[0]);
  }

  function addSharp(note: string | any[]) {
    return `${note[0]}#${note.slice(1)}`;
  }

  function clearChildren(group: HTMLElement | null) {
    while (group?.firstChild) {
      group.removeChild(group.firstChild);
    }
  }

  function drawWhiteText(x: number, key: string) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + 36 + "");
    text.setAttribute("y", 250 + "");
    text.innerHTML = key;
    text.classList.add("white-keyboard-char");
    whiteGroup?.appendChild(text);
  }
  function drawBlackText(x: number, key: string) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + 20 + "");
    text.setAttribute("y", 150 + "");
    text.innerHTML = key;
    blackGroup?.appendChild(text);
  }
  function drawWhiteKeys(notes: any[], showNotes: boolean, showKeys: boolean) {
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

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("id", note);
      path.classList.add("white-key");
      whiteGroup?.appendChild(path);
      const key = noteToKey[note];
      if (showKeys) {
        drawWhiteText(x, key);
      }
    });
  }

  function drawBlackKeys(notes: any[], showNotes: boolean, showKeys: boolean) {
    clearChildren(blackGroup);
    notes.forEach((note: any, i: number) => {
      const isLast = i === notes.length - 1;
      if (!hasSharp(note) || isLast) return;

      const sharp = addSharp(note);
      const x = i * keyWidth + 65;
      const d = `M${x} 0 v170 a10 10 0 0 0 10 10 h50 a10 10 0 0 0 10 -10 V0 Z`;

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("id", sharp);
      path.classList.add("black-key");
      blackGroup?.appendChild(path);
      const key = noteToKey[sharp];
      if (showKeys) {
        drawBlackText(x, key);
      }
    });
  }

  function draw(notes: any[], showNotes: boolean, showKeys: boolean) {
    const viewBoxWidth = notes.length * keyWidth + 1;
    pianoSvg?.setAttribute("viewBox", `-1 -1 ${viewBoxWidth} 302`);
    drawWhiteKeys(notes, showNotes, showKeys);
    drawBlackKeys(notes, showNotes, showKeys);
  }

  function idToNote(id: string) {
    const last = parseInt(id.slice(-1));
    const base = id.slice(0, -1);
    return base + (last - 2);
  }

  function playSound(el: Element) {
    const note = idToNote(el.id);
    sampler.triggerAttack(note);
  }
  function highlightKey(el: Element) {
    el.classList.add("highlight");
  }
  function unhighlightKey(el: Element) {
    el.classList.remove("highlight");
  }

  function stopSound(el: Element) {
    const note = idToNote(el?.id);
    sampler.triggerRelease(note);
  }

  const pressKey = (el: Element) => {
    playSound(el);
    highlightKey(el);
  };
  const releaseKey = (el: Element) => {
    stopSound(el);
    unhighlightKey(el);
  };

  const container = document.getElementById("container") as HTMLDivElement;
  function adjustWidth(notes: string[]) {
    const width = `${100 * notes.length}px`;
    container.style.maxWidth = width;
  }
  notesState.subscribe((notes) =>
    draw(notes, checkboxState.showNoteValue, checkboxState.showKeybindings)
  );
  notesState.subscribe(adjustWidth);
  checkboxState.subscribe((showNotes, showKeys) =>
    draw(notesState.notes, showNotes, showKeys)
  );
  [touchable, mouseable, keyable].forEach((xAble) =>
    xAble(pianoSvg, pressKey, releaseKey)
  );
}
