<script>
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/css';
	import 'swiper/css/effect-cube';
	import 'swiper/css/pagination';
	import { EffectCube, Pagination } from 'swiper/modules';
	import Slide from './Slide.svelte';
	import { fly } from 'svelte/transition';

	let slideOrder = 2;
	let song = 'my_kind_of_woman';
	const images = [
		'https://placehold.co/600x400',
		'https://placehold.co/600x400',
		'https://placehold.co/600x400'
	];

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

<Slide {song} {slideOrder}>
	<div
		class="swiper mySwiper"
		bind:this={swiperContainer}
		transition:fly={{ y: 40, duration: 1000 }}
	>
		<div class="swiper-wrapper">
			{#each images as img}
				<div class="swiper-slide">
					<img src={img} alt="cube face" style="width: 100%; height: 100%; object-fit: cover;" />
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>
</Slide>

<style>
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

	.swiper-slide img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 12px;
	}
</style>
