<script>
	import Piano from "./Piano.svelte";
	import Settings from "./Settings.svelte";
	let showSettings = false;
	let displayedNotes = [];
	let keys = [];
	const hasNeighbours = ["A", "C", "D", "F", "G"];
	$: keys = displayedNotes.map((note) => {
		return {
			note,
			hasNeighbour: hasNeighbours.includes(note[0]),
		};
	});
</script>

<div>
	<button on:click={() => (showSettings = !showSettings)}> Settings </button>
	<Settings bind:displayedNotes {showSettings} />
	<Piano {keys} />
</div>
