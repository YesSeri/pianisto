<script>
	function handleKeydown(){
		console.log('kd')
	}
</script>
<svelte:window on:keydown={handleKeydown} />