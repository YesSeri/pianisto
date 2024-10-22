<script>
  // Used to create a clickable overlay over the piano.
  // When user interacts with this the sampler gets loaded.
  // Also displays a message if user tries to click key,
  // before the audio for the key has been loaded.
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";

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
  <div
    on:click={handleClick}
    on:keypress={handleSoundClick}
    class="overlay"
    out:fade
  >
    <div class="inner-load">CLICK TO LOAD</div>
  </div>
{/if}

{#if showSoundMessage && !visible}
  <div
    on:click={handleSoundClick}
    on:keypress={handleSoundClick}
    class="overlay"
    out:fade
  >
    LOADING AUDIO
  </div>
{/if}

<!-- {#if fullscreen} -->
{#if showRotateMessage && fullscreen}
  <div
    class="overlay rotate-message"
    on:click={handleRotateMessageClick}
    on:keypress={handleSoundClick}
  >
    <div class="inner-rotate">ROTATE PHONE</div>
  </div>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: #fffd;
    cursor: default;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 64px;
    display: none;
  }

  @media screen and (max-width: 600px) {
    .overlay {
      font-size: 32px;
    }
  }
  @media (orientation: landscape) {
    .rotate-message {
      display: none;
    }
  }

  @media (hover: none) and (orientation: portrait) and (display-mode: fullscreen) {
    .overlay {
      background-color: transparent;
    }
    .overlay > .inner-load {
      margin-bottom: -130px;
    }
    .overlay > .inner-rotate {
      margin-bottom: 130px;
    }
    .overlay.rotate-message {
      background-color: #fffd;
      z-index: 1;
    }
  }
</style>
