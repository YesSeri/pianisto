type Note = string;
type Subscriber = (notes: Note[]) => void;

type ElementSideEffectFn = (el: Element) => void;

export interface NotesState {
	notes: string[];
	readonly allNotes: string[];
	subscribe(fn: Subscriber): () => void;
}

function createState(): NotesState {
	let allNotes = [
		"G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4",
		"A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5",
		"C6", "D6", "E6", "F6", "G6", "A6"
	];
	let notes = [...allNotes].slice(3, 3+10);
	let subscribers: Subscriber[] = [];

	return {
		get notes() {
			return [...notes];
		},
		set notes(newNotes) {
			notes = newNotes;
			subscribers.forEach(fn => fn([...notes]))
		},
		get allNotes() {
			return [...allNotes];
		},
		subscribe(fn: Subscriber) {
			subscribers.push(fn);
			return () => {
				subscribers = subscribers.filter(f => f !== fn);
			};
		}
	};
}
const notesState = createState();

export { ElementSideEffectFn, notesState }