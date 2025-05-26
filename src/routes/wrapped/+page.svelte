<script>
	// @ts-nocheck

	import Stories from '$lib/Components/Stories.svelte';

	import IntroSlide from '$lib/Wrapped Stories/IntroSlide.svelte';
	import LeafletSlide from '$lib/Wrapped Stories/LeafletSlide.svelte';
	import QuizSlide from '$lib/Wrapped Stories/QuizSlide.svelte';
	import SecondSlide from '$lib/Wrapped Stories/SecondSlide.svelte';

	import ThirdSlide from '$lib/Wrapped Stories/ThirdSlide.svelte';
	import ToiletSlide from '$lib/Wrapped Stories/ToiletSlide.svelte';
</script>

<Stories count={6}>
	<IntroSlide />
	<SecondSlide />
	<ThirdSlide />
	<QuizSlide />
	<LeafletSlide />
	<ToiletSlide />
</Stories>
