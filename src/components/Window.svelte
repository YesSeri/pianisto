<script>
	export let translation = {};
	export let keys = [];
	$: allKeys = keys.flatMap(({ note, hasNeighbour }) => {
		const neighbour = hasNeighbour ? `${note[0]}#${note[1]}` : null;
		return neighbour ? [note, neighbour] : [note];
	});
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
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
