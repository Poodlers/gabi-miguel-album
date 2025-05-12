<script>
	// @ts-nocheck

	import Stories from '$lib/Components/Stories.svelte';
	import IntroSlide from '$lib/Wrapped Stories/IntroSlide.svelte';
	import SecondSlide from '$lib/Wrapped Stories/SecondSlide.svelte';
</script>

<Stories count={3}>
	<IntroSlide />

	<SecondSlide />

	<div class="story" data-story="2" style="color:white;text-align:center">
		<h1>Story 3</h1>
		<p>Final one!</p>
	</div>
</Stories>
