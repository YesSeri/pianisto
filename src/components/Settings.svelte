<script>
	let notes = [
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
		"C6",
		"D6",
		"E6",
		"F6",
		"G6",
		"A6",
	];
	let lowestNote = "C4";
	let highestNote = "C5";
	export let displayedNotes = notes.slice(
		notes.indexOf(lowestNote),
		notes.indexOf(highestNote) + 1
	);

	$: displayedNotes = notes.slice(
		notes.indexOf(lowestNote),
		notes.indexOf(highestNote) + 1
	);
	export let showSettings;
</script>

<div class:hide={!showSettings}>
	<label for="lowestNote">Select lowest note:</label>
	<select bind:value={lowestNote} name="lowestNote" id="lowestNote">
		{#each notes.slice(0, notes.indexOf(highestNote)) as note, key}
			<option selected={note === lowestNote} {key} value={note}
				>{note}
			</option>
		{/each}
	</select>
	<label for="highestNote">Select highest note:</label>
	<select bind:value={highestNote} name="highestNote" id="highestNote">
		{#each notes.slice(notes.indexOf(lowestNote) + 1) as note, key}
			<option selected={note === highestNote} {key} value={note}
				>{note}
			</option>
		{/each}
	</select>
</div>

<style>
	.hide {
		display: none;
	}
</style>
