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
  addEventListener("fullscreenchange", (event) => {
    const container = document.getElementById("container");
    // todo - add logic to handle the case when the piano is to stretched in full screen.
    // needs to be handled for all cases but this is most important one.
    // this will make it work in also standing mode on phone.
  });
</script>

<button on:click={enterFullscreen}>Fullscreen</button>
