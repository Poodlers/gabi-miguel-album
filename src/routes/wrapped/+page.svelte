<script>
	// @ts-nocheck

	import Stories from '$lib/Components/Stories.svelte';
</script>

<Stories count={3}>
	<div class="story active" data-story="0" style="color:white;text-align:center">
		<h1>Story 1</h1>
		<p>Hello from the first story!</p>
	</div>

	<div class="story" data-story="1" style="color:white;text-align:center">
		<h1>Story 2</h1>
		<p>Second story content here</p>
	</div>

	<div class="story" data-story="2" style="color:white;text-align:center">
		<h1>Story 3</h1>
		<p>Final one!</p>
	</div>
</Stories>

<style>
	.story {
		width: 100%;
		height: 100%;
		display: none;
	}

	.story.active {
		display: block;
	}
</style>
