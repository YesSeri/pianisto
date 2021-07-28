<script>
	import touchable from "./touchable.js";
	import keyboard from "./keyboard.js";
	import createSampler from "./sampler.js";
	import Overlay from "./Overlay.svelte";
	import Window from "./Window.svelte";
	export let keys;
	$: width = keys.length * 100 + 2;
	let clicked = null;
	let touches = [];

	let sampler;
	function loadSampler() {
		sampler = createSampler();
	}

	function playKey(e) {
		if (e.target.id === clicked || !leftMouseIsPressed(e)) return;
		clicked = e.target.id;
		playSound(clicked);
	}
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
		stopSound(e.target.id);
	}
	function stopKeyUp(e) {
		stopSound(e.target.id);
		clicked = null;
	}
	function handleTouch(event) {
		touches = event.detail.touches;
		for (const touch of touches) {
			playSound(touch);
		}
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
	function handleRelease() {
		for (const touch of touches) {
			stopSound(touch);
		}
		touches = [];
	}
	function idToNote(id) {
		const newNum = id[id.length - 1] - 2;
		return id.slice(0, -1) + newNum;
	}
	function playSound(id) {
		if (!sampler) return;
		const note = idToNote(id);
		sampler.triggerAttack(note);
	}
	function stopSound(id) {
		if (!sampler) return;
		const note = idToNote(id);
		sampler.triggerRelease(note);
	}
</script>

<Window />
<div id="container">
	<svg
		viewbox="-1 -1 {width} 302"
		preserveAspectRatio="none"
		use:touchable
		on:touched={handleTouch}
		on:moved={handleMoved}
		on:released={handleRelease}
		use:keyboard
	>
		<g id="white-keys">
			{#each keys as key, i}
				<path
					class:activeWhite={clicked === key.note ||
						touches.includes(key.note)}
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
			{/each}
		</g>
		<g id="black-keys">
			{#each keys as key, i}
				{#if key.hasNeighbour && i !== keys.length - 1}
					<path
						class:activeBlack={clicked ===
							key.note[0] + "#" + key.note[1] ||
							touches.includes(key.note[0] + "#" + key.note[1])}
						on:mousedown={playKey}
						on:mousemove={playKey}
						on:mouseleave={stopKeyMove}
						on:mouseup={stopKeyUp}
						id={key.note[0] + "#" + key.note[1]}
						d="M{100 * i +
							65} 0 v170 a 10 10 0 0 0 10 10 h50 a 10 10 0 0 0 10 -10 V0 Z"
					/>
				{/if}
			{/each}
		</g>
	</svg>
	<Overlay on:loadSampler={loadSampler} text="CLICK TO LOAD" />
</div>

<style>
	#container {
		position: relative;
	}
	#overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
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
</style>
