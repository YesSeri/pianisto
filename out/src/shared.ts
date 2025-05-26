type Subscriber = (notes: string[]) => void;

type ElementSideEffectFn = (el: Element) => void;

type Note =
  | "G3"
  | "A3"
  | "B3"
  | "C4"
  | "D4"
  | "E4"
  | "F4"
  | "G4"
  | "A4"
  | "B4"
  | "C5"
  | "D5"
  | "E5"
  | "F5"
  | "G5"
  | "A5"
  | "B5"
  | "C6"
  | "D6"
  | "E6"
  | "F6"
  | "G6"
  | "A6";

interface CheckboxState {
  showNoteValue: boolean;
  showKeybindings: boolean;
  subscribe(fn: (showNotes: boolean, showKeys: boolean) => void): void;
  init(showNotes: boolean, showKeys: boolean): void;
}

function createCheckboxState(): CheckboxState {
  let showNoteValue = false;
  let showKeybindings = false;
  let subscribers: ((showNotes: boolean, showKeys: boolean) => void)[] = [];

  return {
    get showNoteValue() {
      return showNoteValue;
    },
    set showNoteValue(val: boolean) {
      showNoteValue = val;
      subscribers.forEach((fn) => fn(showNoteValue, showKeybindings));
    },
    get showKeybindings() {
      return showKeybindings;
    },
    set showKeybindings(val: boolean) {
      showKeybindings = val;
      subscribers.forEach((fn) => fn(showNoteValue, showKeybindings));
    },
    subscribe(fn: (showNotes: boolean, showKeys: boolean) => void) {
      subscribers.push(fn);
    },
    init(showNotes, showKeys) {
      showNoteValue = showNotes;
      showKeybindings = showKeys;
      subscribers.forEach((fn) => fn(showNoteValue, showKeybindings));
    },
  };
}

export interface NotesState {
  init(): void;
  notes: string[];
  lowestNote: string;
  highestNote: string;
  getMaxKeys: () => number;
  readonly allNotes: string[];
  subscribe(fn: Subscriber): () => void;
}

function createState(): NotesState {
  let allNotes = [
    "G3",
    "A3",
    "B3",
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B5",
    "C6",
    "D6",
    "E6",
    "F6",
    "G6",
  ];
  let notes = [...allNotes].slice(3, 3 + 10);
  let subscribers: Subscriber[] = [];

  return {
    getMaxKeys() {
      return allNotes.length;
    },
    set lowestNote(val: string) {
      let lowIdx = allNotes.indexOf(val);
      let highIdx = allNotes.indexOf(this.notes[this.notes.length - 1]);
      this.notes = [...allNotes].slice(lowIdx, highIdx + 1);
    },
    set highestNote(val: string) {
      let lowIdx = allNotes.indexOf(this.notes[0]);
      let highIdx = allNotes.indexOf(val);
      this.notes = [...allNotes].slice(lowIdx, highIdx + 1);
    },
    get notes() {
      return [...notes];
    },
    set notes(newNotes) {
      notes = newNotes;
      subscribers.forEach((fn) => fn([...notes]));
    },
    get allNotes() {
      return [...allNotes];
    },
    init() {
      let lowestNote = notes[0];
      let highestNote = notes[notes.length - 1];

      let lowIdx = allNotes.indexOf(lowestNote);
      let highIdx = allNotes.indexOf(highestNote);
      this.notes = [...allNotes].slice(lowIdx, highIdx + 1);
    },

    subscribe(fn: Subscriber): () => void {
      subscribers.push(fn);
      return () => {
        subscribers = subscribers.filter((f) => f !== fn);
      };
    },
  };
}
type KeyTranslation = {
  note: string;
  key: string;
};

type KeyCode =
  | "KeyZ"
  | "KeyS"
  | "KeyX"
  | "KeyD"
  | "KeyC"
  | "KeyV"
  | "KeyG"
  | "KeyB"
  | "KeyH"
  | "KeyN"
  | "KeyM"
  | "KeyK"
  | "Comma"
  | "KeyL"
  | "Period"
  | "Semicolon"
  | "Slash"
  | "KeyQ"
  | "Digit2"
  | "KeyW"
  | "Digit3"
  | "KeyE"
  | "KeyR"
  | "Digit5"
  | "KeyT"
  | "Digit6"
  | "KeyY"
  | "Digit7"
  | "KeyU"
  | "KeyI"
  | "Digit9"
  | "KeyO"
  | "Digit0"
  | "KeyP"
  | "BracketLeft"
  | "Equal"
  | "BracketRight";

const translations: Record<KeyCode, KeyTranslation> = {
  KeyZ: { note: "G3", key: "z" },
  KeyS: { note: "G#3", key: "s" },
  KeyX: { note: "A3", key: "x" },
  KeyD: { note: "A#3", key: "d" },
  KeyC: { note: "B3", key: "c" },
  KeyV: { note: "C4", key: "v" },
  KeyG: { note: "C#4", key: "g" },
  KeyB: { note: "D4", key: "b" },
  KeyH: { note: "D#4", key: "h" },
  KeyN: { note: "E4", key: "n" },
  KeyM: { note: "F4", key: "m" },
  KeyK: { note: "F#4", key: "k" },
  Comma: { note: "G4", key: "," },
  KeyL: { note: "G#4", key: "l" },
  Period: { note: "A4", key: "." },
  Semicolon: { note: "A#4", key: ";" },
  Slash: { note: "B4", key: "/" },
  KeyQ: { note: "C5", key: "q" },
  Digit2: { note: "C#5", key: "2" },
  KeyW: { note: "D5", key: "w" },
  Digit3: { note: "D#5", key: "3" },
  KeyE: { note: "E5", key: "e" },
  KeyR: { note: "F5", key: "r" },
  Digit5: { note: "F#5", key: "5" },
  KeyT: { note: "G5", key: "t" },
  Digit6: { note: "G#5", key: "6" },
  KeyY: { note: "A5", key: "y" },
  Digit7: { note: "A#5", key: "7" },
  KeyU: { note: "B5", key: "u" },
  KeyI: { note: "C6", key: "i" },
  Digit9: { note: "C#6", key: "9" },
  KeyO: { note: "D6", key: "o" },
  Digit0: { note: "D#6", key: "0" },
  KeyP: { note: "E6", key: "p" },
  BracketLeft: { note: "F6", key: "[" },
  Equal: { note: "F#6", key: "=" },
  BracketRight: { note: "G6", key: "]" },
} as const;

const noteToKey: Record<string, string> = {};
for (const keyCode in translations) {
  const { note, key } = translations[keyCode as keyof typeof translations];
  noteToKey[note] = key;
}

const notesState = createState();
const checkboxState = createCheckboxState();

export {
  ElementSideEffectFn,
  notesState,
  translations,
  noteToKey,
  KeyCode,
  checkboxState,
  CheckboxState,
};
