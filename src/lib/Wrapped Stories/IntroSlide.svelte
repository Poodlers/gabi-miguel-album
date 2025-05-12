<script>
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let loaded = false;
	/**
	 * @type {Node}
	 */
	let el;

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

<div bind:this={el} class="intro-slide story active" data-story="0" data-song="my_kind_of_woman">
	{#if loaded}
		<h1 in:fly={{ y: 40, duration: 1000 }} class="title">Um ano juntinhos...</h1>
		<p in:fade={{ delay: 1000, duration: 1000 }} class="subtitle">
			365 dias, imensas memórias... vamos ver como foi...
		</p>
	{/if}
</div>

<style>
	.intro-slide {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		text-align: center;
		padding: 2rem;
		background: linear-gradient(135deg, #ffb6c1, #ffe4e1);
	}

	.title {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #333;
	}
</style>
