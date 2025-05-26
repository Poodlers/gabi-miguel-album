<script>
	import { onMount } from 'svelte';

	export let loaded = false;

	/**
	 * @type {Node}
	 */
	let el;

	export let slideOrder = 0;
	export let song;

	onMount(() => {
		const observer = new MutationObserver(() => {
			// @ts-ignore
			if (el.classList.contains('active')) {
				loaded = true;
			} else {
				loaded = false;
			}
		});

		observer.observe(el, { attributes: true, attributeFilter: ['class'] });

		return () => observer.disconnect();
	});
</script>

<div bind:this={el} class="slide story" data-story={slideOrder} data-song={song}>
	<div class="slide">
		<slot />
	</div>
</div>

<style>
	.slide {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		text-align: center;
		background: linear-gradient(135deg, #ffb6c1, #ffe4e1);
	}
</style>
