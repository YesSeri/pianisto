<script>
	import Piano from "./Piano.svelte";
	import Settings from "./Settings.svelte";
	import Top from "./Top.svelte";
	let showSettings = false;
	let displayedNotes = [];
	let keys = [];
	const hasNeighbours = ["A", "C", "D", "F", "G"];
	$: keys = displayedNotes.map((note, i) => {
		return {
			note,
			hasNeighbour:
				i === displayedNotes.length - 1
					? false
					: hasNeighbours.includes(note[0]),
		};
	});
</script>

<div>
	<Top />
	<Settings bind:displayedNotes {showSettings} />
	<Piano {keys} />
	<button on:click={() => (showSettings = !showSettings)}> Settings </button>
</div>
