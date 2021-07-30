<script>
	export let keys = [];
	$: allKeys = keys.flatMap(({ note, hasNeighbour }) => {
		const neighbour = hasNeighbour ? `${note[0]}#${note[1]}` : null;
		return neighbour ? [note, neighbour] : [note];
	});
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	class KeyNotePair {
		constructor(keycode, note, key) {
			this.keycode = keycode;
			this.note = note;
			this.key = key;
		}
	}
	const translation = [
		new KeyNotePair("KeyZ", "G3", "z"),
		new KeyNotePair("KeyS", "G#3", "s"),
		new KeyNotePair("KeyX", "A3", "x"),
		new KeyNotePair("KeyD", "A#3", "d"),
		new KeyNotePair("KeyC", "B3", "c"),
		new KeyNotePair("KeyV", "C4", "v"),
		new KeyNotePair("KeyG", "C#4", "g"),
		new KeyNotePair("KeyB", "D4", "b"),
		new KeyNotePair("KeyH", "D#4", "h"),
		new KeyNotePair("KeyN", "E4", "n"),
		new KeyNotePair("KeyM", "F4", "m"),
		new KeyNotePair("KeyK", "F#4", "k"),
		new KeyNotePair("Comma", "G4", ","),
		new KeyNotePair("KeyL", "G#4", "l"),
		new KeyNotePair("Period", "A4", "."),
		new KeyNotePair("Semicolon", "A#4", ";"),
		new KeyNotePair("Slash", "B4", "/"),
		new KeyNotePair("KeyQ", "C5", "q"),
		new KeyNotePair("Digit2", "C#5", "2"),
		new KeyNotePair("KeyW", "D5", "w"),
		new KeyNotePair("Digit3", "D#5", "3"),
		new KeyNotePair("KeyE", "E5", "e"),
		new KeyNotePair("KeyR", "F5", "r"),
		new KeyNotePair("Digit5", "F#5", "5"),
		new KeyNotePair("KeyT", "G5", "t"),
		new KeyNotePair("Digit6", "G#5", "6"),
		new KeyNotePair("KeyY", "A5", "y"),
		new KeyNotePair("Digit7", "A#5", "7"),
		new KeyNotePair("KeyU", "B5", "u"),
		new KeyNotePair("KeyI", "C6", "i"),
		new KeyNotePair("Digit9", "C#6", "9"),
		new KeyNotePair("KeyO", "D6", "o"),
		new KeyNotePair("Digit0", "D#6", "0"),
		new KeyNotePair("KeyP", "E6", "p"),
		new KeyNotePair("BracketLeft", "F6", "["),
		new KeyNotePair("Equal", "F#6", "="),
		new KeyNotePair("BracketRight", "G6", "]"),
	];

	$: activeKeys = translation.filter((pair) => allKeys.includes(pair.note));
	const handleKeydown = (event) => {
		// This is to disable the quickfind on firefox
		if (event.code === "Slash") {
			event.preventDefault();
		}
		const keyNotePair = activeKeys.find((el) => el.keycode === event.code);
		if (keyNotePair === undefined) return;
		const { note } = keyNotePair;
		if (
			!note ||
			event.repeat ||
			event.ctrlKey ||
			event.altKey ||
			event.shiftKey
		) {
			return;
		}

		dispatch("keydown", {
			note,
		});
	};
	function handleKeyUp(e) {
		const keyNotePair = translation.find((el) => el.keycode === e.code);
		if (keyNotePair === undefined) return;
		const { note } = keyNotePair;
		dispatch("keyup", {
			note,
		});
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyUp} />
