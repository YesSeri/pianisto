<script>
	import Piano from "./Piano.svelte";
	import Settings from "./Settings.svelte";
	import Top from "./Top.svelte";
	import FullscreenButton from "./FullscreenButton.svelte";
	let showSettings = false;
	let fullscreen = false;
	let displayedNotes = [];
	let showKeybindings = false;
	let showNotes = false;
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
	<Settings
		bind:displayedNotes
		bind:showKeybindings
		bind:showNotes
		{showSettings}
	/>
	<Piano {keys} {fullscreen} {showKeybindings} {showNotes} />
	<button on:click={() => (showSettings = !showSettings)}> Settings </button>
	<FullscreenButton bind:fullscreen />
</div>
