<script>
	import svgData from "./pianoSvg.js";
</script>

<div>
	<div id="top">
		<h1 id="title">Pianisto</h1>
		<div class="header responsive">
			<div class="pane">
				<h2>Play the piano</h2>
				<p>
					Your site for playing piano online. Use the piano with
					keyboard, touch or mouse.
				</p>
			</div>
			<div class="pane">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 218.758 121.527"><path d={svgData} /></svg
				>
			</div>
		</div>
	</div>
</div>

<style>
	h1 {
		margin: 0;
		padding: 10px;
		font-size: 4em;
		border-bottom: solid 1px black;
	}
	svg {
		max-width: 300px;
		justify-self: center;
	}
	#top {
		background-color: rgb(196, 226, 255);
		border-bottom: solid 1px black;
	}
	.header {
		display: flex;
	}
	.pane {
		width: 50%;
		padding: 10px;
		display: grid;
		align-items: center;
	}
</style>
