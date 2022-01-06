<script>
	// We add event listeners to the window object so we can play the piano, with our keyboard,
	// regardless of whether the piano object is in focus or not.
	export let translation = {};
	export let keys = [];
	// The keys map looks like this:
	// E.g. keys = [{ note: "C4", hasNeighbour: true }, { note: "D4", hasNeighbour: true }]
	// We want to take this and transform it into an array of all notes,
	// that we then can use to trigger the notes on them being clicked.
	// All keys look like this:
	// [ "C4", "C#4", "D4" ]
	$: allKeys = keys.flatMap(({ note, hasNeighbour }) => {
		const neighbour = hasNeighbour ? `${note[0]}#${note[1]}` : null;
		return neighbour ? [note, neighbour] : [note];
	});
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	$: availableKeys = translation.filter((el) => allKeys.includes(el.note));
	const handleKeydown = (event) => {
		// This is to disable the quickfind on firefox
		if (event.code === "Slash") {
			event.preventDefault();
		}
		const playedKeyObj = availableKeys.find(
			(el) => el.keycode === event.code
		);
		if (playedKeyObj === undefined) return;
		const { note } = playedKeyObj;
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
		const playedKeyObj = translation.find((el) => el.keycode === e.code);
		if (playedKeyObj === undefined) return;
		const { note } = playedKeyObj;
		dispatch("keyup", {
			note,
		});
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyUp} />
