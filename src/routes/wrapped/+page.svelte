<script>
	// @ts-nocheck

	import Stories from '$lib/Components/Stories.svelte';
	import IntroSlide from '$lib/Wrapped Stories/IntroSlide.svelte';
	import SecondSlide from '$lib/Wrapped Stories/SecondSlide.svelte';
	import ThirdSlide from '$lib/Wrapped Stories/ThirdSlide.svelte';
</script>

<Stories count={3}>
	<IntroSlide />

	<SecondSlide />

	<ThirdSlide />
</Stories>
