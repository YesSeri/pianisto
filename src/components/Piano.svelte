<script>
	import touchable from "./touchable.js";
	import createSampler from "./sampler.js";
	import Overlay from "./Overlay.svelte";
	import Window from "./Window.svelte";
	import { translation } from "./keybindings";
	export let keys;
	export let fullscreen;
	export let showKeybindings;
	export let showNotes;
	// If sound resources have not loaded yet we use this in triggering a message that is has not loaded.
	$: showSoundMessage = false;

	$: width = keys.length * 100 + 2;

	let clicked = null;
	let touches = [];
	let pressed = [];

	let sampler;
	// We should load the sampler (the thing that makes sounds) first after the user have interacted with website.
	// Some browsers disable sound before that.
	function loadSampler() {
		sampler = createSampler();
	}

	function playKey(e) {
		if (e.target.id === clicked || !leftMouseIsPressed(e)) return;
		clicked = e.target.id;
		playSound(clicked);
	}

	// We want to trigger on left mouse button, regardless if other buttons are pressed.
	function leftMouseIsPressed(e) {
		let buttons = e.buttons;
		if (buttons >= 16) {
			buttons -= 16;
		}
		if (buttons >= 8) {
			buttons -= 8;
		}
		if (buttons >= 4) {
			buttons -= 4;
		}
		if (buttons >= 2) {
			buttons -= 2;
		}
		return buttons === 1;
	}
	function stopKeyMove(e) {
		if (!leftMouseIsPressed(e)) return;
		clicked = null;
		stopSound(e.target.id);
	}
	function stopKeyUp(e) {
		stopSound(e.target.id);
		clicked = null;
	}
	function handleTouch(event) {
		const touch = event.detail.touch;
		touches.push(touch);
		touches = touches;
		playSound(touch);
	}
	function handleMoved(event) {
		touches = touches.filter(
			(touch) => !touch.includes(event.detail.released)
		);
		touches = [...event.detail.pressed, ...touches];
		for (const press of event.detail.pressed) {
			playSound(press);
		}
		for (const release of event.detail.released) {
			stopSound(release);
		}
	}
	function handleRelease(event) {
		const releasedNote = event.detail.released;
		stopSound(releasedNote);
		touches = touches.filter((el) => el !== releasedNote);
	}
	function idToNote(id) {
		const newNum = id[id.length - 1] - 2;
		return id.slice(0, -1) + newNum;
	}
	function playSound(id) {
		if (!sampler) return;
		const note = idToNote(id);
		try {
			sampler.triggerAttack(note);
		} catch (error) {
			console.error(error);
			showSoundMessage = true;
			setTimeout(() => {
				showSoundMessage = false;
			}, 2500);
		}
	}
	function stopSound(id) {
		if (!sampler) return;
		const note = idToNote(id);
		sampler.triggerRelease(note);
	}
	function keyDown({ detail: { note } }) {
		playSound(note);
		pressed = [...pressed, note];
	}
	function keyUp({ detail: { note } }) {
		stopSound(note);
		pressed = pressed.filter((el) => el !== note);
	}
	function addSharp(note) {
		return note[0] + "#" + note[1];
	}
</script>

<Window {keys} {translation} on:keydown={keyDown} on:keyup={keyUp} />
<div id="container" class:fullscreen>
	<svg
		class:fullscreen
		viewbox="-1 -1 {width} 302"
		preserveAspectRatio="none"
		use:touchable
		on:touched={handleTouch}
		on:moved={handleMoved}
		on:released={handleRelease}
	>
		<g id="white-keys">
			{#each keys as key, i}
				<path
					class:activeWhite={clicked === key.note ||
						touches.includes(key.note) ||
						pressed.includes(key.note)}
					on:mousedown={playKey}
					on:mousemove={playKey}
					on:mouseleave={stopKeyMove}
					on:mouseup={stopKeyUp}
					id={key.note}
					d={i === 0
						? "M0 0 v290 a 10 10 0 0 0 10 10 h90 v-300 Z"
						: i === keys.length - 1
						? `M${i * 100} 0 v300 h90 a 10 10 0 0 0 10 -10 v-290 Z`
						: `M${i * 100} 0 v300 h100 v-300 Z`}
				/>

				{#if showKeybindings}
					<!-- Used to display keybinding  -->
					<text
						x={i * 100 + 38}
						font-family="monospace"
						font-size="30"
						y="275"
						fill="black"
					>
						{translation.find((el) => el.note === key.note).key}
					</text>
				{/if}

				{#if showNotes}
					<!-- Used to display note name  -->
					<text
						x={i * 100 + 38}
						font-family="monospace"
						font-size="30"
						y="235"
						fill="black">{key.note.slice(0, 1)}</text
					>
				{/if}
			{/each}
		</g>
		<g id="black-keys">
			{#each keys as key, i}
				{#if key.hasNeighbour}
					<path
						class:activeBlack={clicked === addSharp(key.note) ||
							touches.includes(addSharp(key.note)) ||
							pressed.includes(addSharp(key.note))}
						on:mousedown={playKey}
						on:mousemove={playKey}
						on:mouseleave={stopKeyMove}
						on:mouseup={stopKeyUp}
						id={addSharp(key.note)}
						d="M{100 * i +
							65} 0 v170 a 10 10 0 0 0 10 10 h50 a 10 10 0 0 0 10 -10 V0 Z"
					/>
					{#if showKeybindings}
						<!-- Used to display keybinding name  -->
						<text
							x={i * 100 + 90}
							font-family="monospace"
							font-size="30"
							y="165"
							fill="white"
							stroke="white"
						>
							{translation.find(
								(el) => el.note === addSharp(key.note)
							).key}
						</text>
					{/if}

					{#if showNotes}
						<!-- Used to display note name  -->
						<text
							x={i * 100 + 82}
							font-family="monospace"
							font-size="30"
							y="125"
							fill="white"
							stroke="white"
						>
							{addSharp(key.note).slice(0, 2)}</text
						>
					{/if}
				{/if}
			{/each}
		</g>
	</svg>
	<Overlay bind:showSoundMessage on:loadSampler={loadSampler} />
</div>

<style>
	#loading-sound-info {
		padding-bottom: 5px;
	}
	#container {
		position: relative;
		margin: auto;
		padding-top: 5px;
	}
	@media screen and (min-width: 1000px) {
		#container {
			max-width: 80vw;
		}
	}

	#white-keys {
		fill: white;
		stroke: black;
	}
	#black-keys {
		fill: black;
		stroke: black;
	}
	.activeWhite {
		fill: #ddd;
	}
	.activeBlack {
		fill: #444;
	}
	svg.fullscreen {
		height: 100%;
		width: 100%;
	}
	#container.fullscreen {
		position: absolute;
		top: -10px;
		background-color: green;
		width: 100%;
		height: calc(100% + 10px);
		max-width: none;
	}

	/* @media only screen and (orientation: portrait) {
		#container.fullscreen {
			width: 100vh;
			height: 100vw;
			-webkit-transform: rotate(90deg);
			-moz-transform: rotate(90deg);
			-o-transform: rotate(90deg);
			-ms-transform: rotate(90deg);
			transform: rotate(90deg);
		}
	}
	@media only screen and (orientation: landscape) {
		#container.fullscreen {
			-webkit-transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			-ms-transform: rotate(0deg);
			transform: rotate(0deg);
		}
	} */
</style>
