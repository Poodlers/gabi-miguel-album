<script>
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Slide from './Slide.svelte';

	let started = false;
	let slideOrder = 1;

	onMount(() => {
		var loaded = true;
		var el = document.querySelector('.slide[data-story="1"]');
		if (!el) return;
		const observer = new MutationObserver(() => {
			// @ts-ignore
			if (el.classList.contains('active')) {
				started = true;
			} else {
				started = false;
			}
		});

		observer.observe(el, { attributes: true, attributeFilter: ['class'] });

		return () => observer.disconnect();
	});
</script>

<Slide song="" {slideOrder}>
	<div class="container">
		<!-- Intro Text -->
		<div class="text-wrapper" class:top={started} transition:fly={{ y: 20, duration: 1500 }}>
			<h1 class="title">Vamos voltar a onde tudo começou</h1>
			<p class="subtitle">Mais ou menos há um ano...</p>
		</div>
		<!-- Show images after animation starts -->
		{#if started}
			<div class="images" transition:fade>
				<img class="image" src="/images/memory1.jpg" alt="Memory 1" />
				<img class="image" src="/images/memory2.jpg" alt="Memory 2" />
				<img class="image" src="/images/memory3.jpg" alt="Memory 3" />
			</div>
		{/if}
	</div>
</Slide>

<style>
	.container {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
		background: #fef6f9;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.text-wrapper {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		text-align: center;
		transition: top 0.8s ease;
	}

	.text-wrapper.top {
		top: 2rem;
		transform: translateY(0);
	}

	.images {
		margin-top: 8rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.image {
		width: 150px;
		height: 150px;
		object-fit: cover;
		border-radius: 1rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>
