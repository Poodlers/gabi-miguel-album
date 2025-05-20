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
		loaded = true;
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

<div
	bind:this={el}
	class="slide story"
	class:active={slideOrder == 3}
	data-story={slideOrder}
	data-song={song}
>
	{#if loaded}
		<slot />
	{/if}
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
