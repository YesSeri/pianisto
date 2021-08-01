<script>
	import { fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	export let text = "";
	const dispatch = createEventDispatcher();
	let visible = true;

	function handleClick() {
		visible = false;
		dispatch("loadSampler");
	}
</script>

{#if visible}
	<div on:click={handleClick} id="overlay" out:fade>
		<div id="text">
			{text}
		</div>
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
