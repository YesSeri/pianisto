<script>
	// Used to create a clickable overlay over the piano.
	// When user interacts with this the sampler gets loaded.
	// Also displays a message if user tries to click key,
	// before the audio for the key has been loaded.
	import { fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
	let visible = true;
	export let showSoundMessage = false;
	function handleClick() {
		visible = false;
		dispatch("loadSampler");
	}
	function handleSoundClick() {
		visible = false;
	}
</script>

{#if visible}
	<div on:click={handleClick} id="overlay" out:fade>
		<div id="text">CLICK TO LOAD</div>
	</div>
{/if}

{#if showSoundMessage && !visible}
	<div on:click={handleSoundClick} id="overlay" out:fade>
		<div id="text">LOADING AUDIO</div>
	</div>
{/if}

<style>
	#overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: #fffc;
		cursor: default;
	}

	#text {
		font-size: 64px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media screen and (max-width: 600px) {
		#text {
			font-size: 32px;
		}
	}
</style>
