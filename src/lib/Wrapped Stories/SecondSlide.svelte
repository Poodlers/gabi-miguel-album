<script>
	import { fly } from 'svelte/transition';

	import Slide from './Slide.svelte';
	import { gsap } from 'gsap';

	let loaded = false;
	let slideOrder = 1;

	/**
	 * @type {any[]}
	 */
	let images = [];

	const targets = [
		{ x: 20, y: 0 },
		{ x: -20, y: 50 }
	];
	/**
	 * @type {HTMLDivElement}
	 */
	let initialDownwardsText;

	/**
	 * @type {HTMLDivElement}
	 */
	let initialUpwardsText;

	let animationsFinished = false;

	$: if (loaded) {
		animationsFinished = false;
		gsap.fromTo(
			initialUpwardsText,
			{ x: 0, y: 0, opacity: 1, scale: 1 },
			{
				x: 0,
				y: -330,
				delay: 3,
				duration: 1,
				ease: 'power3.out'
			}
		);
		gsap.fromTo(
			initialDownwardsText,
			{ x: 0, y: 0, opacity: 1, scale: 1 },
			{
				x: 0,
				y: 350,
				delay: 3,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					animationsFinished = true;
				}
			}
		);

		images.forEach((el, i) => {
			gsap.fromTo(
				el,
				{ x: 0, y: 0, opacity: 0, scale: 0 },
				{
					x: targets[i].x,
					y: targets[i].y,
					opacity: 1,
					scale: 1,
					duration: 1,
					delay: i * 0.4 + 4,
					ease: 'power3.out',
					onComplete: () => {
						// Wobble / float
						gsap.to(el, {
							y: `+=25`,
							duration: 1.5,
							ease: 'sine.inOut',
							repeat: -1,
							yoyo: true
						});
					}
				}
			);
		});
	}
</script>

<Slide song="" {slideOrder} bind:loaded>
	<div class="container">
		<!-- Intro Text -->
		<div class="text-wrapper-center" in:fly={{ y: 200, duration: 2000 }}>
			<h2 bind:this={initialUpwardsText} class="font-bold text-2xl mt-1">
				Todas as relações começam pelas primeiras vezes...
			</h2>

			<h2 bind:this={initialDownwardsText} class="font-bold text-2xl mt-1">
				{animationsFinished ? 'Primeiro Date!' : 'Vamos voltar a esses momentos!'}
			</h2>
		</div>
		<div class="container">
			{#each [1, 2] as _, i}
				<img
					bind:this={images[i]}
					class="image"
					src={'https://placehold.co/600x400'}
					alt={`photo-${i}`}
				/>
			{/each}
		</div>
	</div>
</Slide>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.text-wrapper {
		position: absolute;
		top: 2rem;
		text-align: center;
		z-index: 10;
		transition: top 0.8s ease;
	}

	.images {
		margin-top: 8rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.image {
		width: 90%;
		object-fit: cover;
		border-radius: 1rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>
