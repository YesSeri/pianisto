<script>
	import Piano from "./Piano.svelte";
	import Settings from "./Settings.svelte";
	import Top from "./Top.svelte";
	import FullscreenButton from "./FullscreenButton.svelte";

	// These are all settings that gets sent to the settings component and piano.
	let showSettings = false;
	let fullscreen = false;
	let displayedNotes = [];
	let showKeybindings = false;
	let showNotes = false;
	// These are all the white keys that have been picked in settings.
	let keys = [];

	const hasNeighbours = ["A", "C", "D", "F", "G"];
	// These are all the white keys, including a true or false
	// if the key has a black key as a neighbour to its right.
	// E.g. displayedNotes = [ "C4", "D4" ]
	// E.g. keys = [{ note: "C4", hasNeighbour: true }, { note: "D4", hasNeighbour: true }]
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
