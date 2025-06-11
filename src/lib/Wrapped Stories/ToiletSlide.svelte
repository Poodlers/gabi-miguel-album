<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { gsap } from 'gsap';
	import Slide from './Slide.svelte';
	let song = 'now_you_wont_let_go';
	let slideOrder = 5;
	let loaded = false;
	let initialText: HTMLDivElement;
	let images: HTMLImageElement[] = [];
	$: if (loaded) {
		gsap.fromTo(
			initialText,
			{ opacity: 1 },
			{
				opacity: 0,
				scale: 1,
				duration: 2,
				ease: 'power3.out',
				delay: 3.4
			}
		);

		gsap.fromTo(
			images[0],
			{ x: 0, y: 0, opacity: 0, scale: 1 },
			{
				opacity: 1,
				scale: 1,
				duration: 2,
				ease: 'power3.out',
				delay: 4
			}
		);
	}
</script>

<Slide {song} {slideOrder} bind:loaded>
	<div bind:this={initialText} class="text-container">
		<h1 in:fly={{ y: 100, duration: 2000 }} class="text-3xl font-bold mb-4">
			POV: Tens de cagar desesperadamente...
		</h1>
		<h2 in:fly={{ y: 100, duration: 2000, delay: 2000 }} class="text-xl mb-4">
			Em qual das seguintes vais cagar com mais força...
		</h2>
	</div>

	<div class="toilets">
		{#each [1, 2, 3, 4, 5] as _, i}
			<img
				bind:this={images[i]}
				class="image"
				src={'funny_toilet_' + _ + '.jpg'}
				alt={`photo-${i}`}
			/>
		{/each}
	</div>
</Slide>

<style>
	.text-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.toilets {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	.image {
		position: absolute;
		transform: translate(-50%, -50%);
		opacity: 0;
		width: 90%;
		object-fit: cover;
		border-radius: 1rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>
