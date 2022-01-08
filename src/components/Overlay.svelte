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
	export let fullscreen;
	let showRotateMessage = true;
	function handleClick() {
		visible = false;
		dispatch("loadSampler");
	}
	function handleSoundClick() {
		visible = false;
	}
	function handleRotateMessageClick() {
		showRotateMessage = false;
	}
</script>

{#if visible}
	<div on:click={handleClick} class="overlay" out:fade>
		<div id="text">CLICK TO LOAD</div>
	</div>
{/if}

{#if showSoundMessage && !visible}
	<div on:click={handleSoundClick} class="overlay" out:fade>
		<div id="text">LOADING AUDIO</div>
	</div>
{/if}

<!-- {#if fullscreen} -->
{#if showRotateMessage && fullscreen}
	<div class="overlay rotate-message" on:click={handleRotateMessageClick}>
		Rotate phone
	</div>
{/if}

<style>
	.overlay {
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
	@media (orientation: landscape) {
		.rotate-message {
			display: none;
		}
	}

	@media (hover: none) and (orientation: portrait) {
		.overlay.rotate-message {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 10vw;
			background-color: #fff;
		}
	}
</style>
