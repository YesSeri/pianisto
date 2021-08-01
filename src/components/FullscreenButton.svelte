<script>
	export let fullscreen;
	function enterFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		}
	}
	document.onfullscreenchange = (e) => {
		if (!document.fullscreenElement) {
			fullscreen = false;
		} else {
			fullscreen = true;
		}
	};
</script>

<button on:click={enterFullscreen}>Fullscreen</button>
