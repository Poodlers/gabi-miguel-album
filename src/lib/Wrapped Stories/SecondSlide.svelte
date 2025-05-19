<script>
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/css';
	import 'swiper/css/effect-cube';
	import 'swiper/css/pagination';
	import { EffectCube, Pagination } from 'swiper/modules';
	import Slide from './Slide.svelte';
	import { fade, fly } from 'svelte/transition';

	let loaded = false;
	let slideOrder = 1;
	let song = 'my_kind_of_woman';
	const images = [
		'https://placehold.co/600x400',
		'https://placehold.co/600x400',
		'https://placehold.co/600x400'
	];
	let showInitialText = true;
	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let initialTextInterval;

	$: if (loaded) {
		initialTextInterval = setTimeout(() => {
			showInitialText = false;
		}, 2000);
	} else {
		clearTimeout(initialTextInterval);
		showInitialText = true;
	}

	/**
	 * @type {import("swiper/types").CSSSelector | HTMLElement}
	 */
	let swiperContainer;

	$: if (swiperContainer) {
		const swiper = new Swiper(swiperContainer, {
			modules: [EffectCube, Pagination],
			effect: 'cube',
			grabCursor: true,
			loop: true,
			cubeEffect: {
				shadow: true,
				slideShadows: true,
				shadowOffset: 20,
				shadowScale: 0.94
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			}
		});
	}
</script>

<Slide {song} {slideOrder} bind:loaded>
	<div class="container">
		<div class="text-wrapper" transition:fly={{ y: 200, duration: 2000, delay: 2000 }}>
			<h2 class="font-bold text-2xl mt-1">Vamos voltar a onde tudo começou</h2>
		</div>
		{#if showInitialText}
			<div class="text-wrapper-center" transition:fade={{ delay: 1000, duration: 1000 }}>
				<p class="subtitle">Todas as relações têm de começar pelas primeiras vezes...</p>
			</div>
		{/if}
		<div
			class="swiper mySwiper"
			bind:this={swiperContainer}
			transition:fly={{ y: 40, duration: 1000, delay: 4000 }}
		>
			<div class="swiper-wrapper">
				<div class="swiper-slide">
					{#each images as img}
						<div class="swiper-slide">
							<img
								src={img}
								alt="cube face"
								style="width: 100%; height: 100%; object-fit: cover;"
							/>
						</div>
					{/each}
				</div>
			</div>
			<div class="swiper-pagination"></div>
		</div>
	</div>
</Slide>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.text-wrapper-center {
		position: absolute;
		top: 50%;
	}

	.text-wrapper {
		position: absolute;
		top: 2rem;
		text-align: center;
		z-index: 10;
		transition: top 0.8s ease;
	}
	.swiper {
		width: 300px;
		height: 300px;
		z-index: 20;
	}

	.swiper-slide {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
	}
</style>
