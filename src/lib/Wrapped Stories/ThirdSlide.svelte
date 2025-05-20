<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/css';
	import 'swiper/css/effect-cube';
	import 'swiper/css/pagination';
	import { EffectCube, Pagination } from 'swiper/modules';
	import Slide from './Slide.svelte';

	import { gsap } from 'gsap';

	import { Fireworks } from '@fireworks-js/svelte';
	import type { FireworksOptions } from '@fireworks-js/svelte';

	let fw: Fireworks;

	let options: FireworksOptions = {
		opacity: 0.5,
		delay: {
			min: 50,
			max: 100
		},
		sound: {
			enabled: true
		},
		boundaries: {
			width: 10,
			height: 10,
			x: 20,
			y: 20
		}
	};

	function toggleFireworks() {
		const fireworks = fw.fireworksInstance();
		if (fireworks.isRunning) {
			fireworks.waitStop();
		} else {
			fireworks.start();
		}
	}
	let loaded = false;

	let slideOrder = 2;
	let song = 'my_kind_of_woman';
	const images = [
		'https://placehold.co/600x400',
		'https://placehold.co/600x400',
		'https://placehold.co/600x400'
	];

	let swiperContainer: HTMLElement;

	let textFromLeft: gsap.TweenTarget;

	let textFromRight: gsap.TweenTarget;

	$: if (loaded) {
		gsap.fromTo(
			textFromLeft,
			{ x: -1000, y: 0, opacity: 0, scale: 0.5 },
			{
				x: 0,
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(textFromLeft, {
						x: 0,
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.3
					});
				}
			}
		);

		gsap.fromTo(
			textFromRight,
			{ x: 1000, y: 0, opacity: 0, scale: 0.5 },
			{
				x: 0,
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(textFromRight, {
						x: 0,
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.3
					});
				}
			}
		);

		gsap.fromTo(
			swiperContainer,
			{
				x: -500,
				rotation: 0.01,
				textShadow: '5px 0 5px rgba(255,255,255,0.5)',
				boxShadow: '15px 0 10px -5px rgba(200,0,0,0.2)',
				scaleX: 0.6,
				skewX: 10,
				ease: 'Power1.easeInOut'
			},
			{
				x: 0,
				rotation: 0.01,
				textShadow: '-5px 0 5px rgba(255,255,255,1)',
				boxShadow: '-15px 0 10px -5px rgba(200,0,0,0.5)',
				scaleX: 1.2,
				skewX: -10,
				ease: 'Power1.easeInOut',
				duration: 1,
				delay: 0.5,
				onComplete: () => {
					gsap.to(swiperContainer, {
						rotation: 0,
						textShadow: '5px 0 5px rgba(255,255,255,0.5)',
						boxShadow: '15px 0 10px -5px rgba(200,0,0,0.2)',
						scaleX: 1,
						skewX: 0,
						ease: 'Power1.easeInOut',
						duration: 0.3
					});
				}
			}
		);
	}

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
	<div class="text-wrapper-top">
		<h2 bind:this={textFromLeft} class="font-bold text-2xl mt-1">
			Primeiro São João! (e único ainda)
		</h2>
		<h2 bind:this={textFromRight} class="font-bold text-2xl mt-1">Não me esqueço!</h2>
	</div>
	<div class="swiper mySwiper" bind:this={swiperContainer}>
		<div class="swiper-wrapper">
			{#each images as img}
				<div class="swiper-slide">
					<img src={img} alt="cube face" style="width: 100%; height: 100%; object-fit: cover;" />
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>
	<Fireworks bind:this={fw} autostart={true} {options} class="fireworks" />
</Slide>

<style>
	.swiper {
		width: 90%;
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
