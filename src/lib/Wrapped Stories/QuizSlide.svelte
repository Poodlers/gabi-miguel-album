<script lang="ts">
	import { fly } from 'svelte/transition';
	// @ts-ignore
	import FaLeaf from 'svelte-icons/fa/FaLeaf.svelte';
	// @ts-ignore
	import FaWalking from 'svelte-icons/fa/FaWalking.svelte';
	// @ts-ignore
	import FaSnowflake from 'svelte-icons/fa/FaSnowflake.svelte';
	// @ts-ignore
	import FaWater from 'svelte-icons/fa/FaWater.svelte';
	// @ts-ignore
	import FaCheckCircle from 'svelte-icons/fa/FaCheckCircle.svelte';
	// @ts-ignore
	import FaTimesCircle from 'svelte-icons/fa/FaTimesCircle.svelte';
	import { gsap } from 'gsap';
	// @ts-ignore
	import { Confetti } from 'svelte-confetti';

	import Slide from './Slide.svelte';

	let loaded = false;

	let song = 'my_kind_of_woman';
	let slideOrder = 3;

	let answer1Element: HTMLElement;
	let answer2Element: HTMLElement;
	let answer3Element: HTMLElement;
	let answer4Element: HTMLElement;

	let dateEscolhido = '';

	$: if (loaded) {
		dateEscolhido = '';
		gsap.fromTo(
			answer1Element,
			{ x: -1000, y: 0, opacity: 0, scale: 0.5 },
			{
				x: 0,
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(answer1Element, {
						y: 0,
						x: `+=10`,
						opacity: 1,
						scale: 1,
						duration: 1.5,
						yoyo: true,
						repeat: -1
					});
				}
			}
		);
		gsap.fromTo(
			answer2Element,
			{ x: 1000, y: 0, opacity: 0, scale: 0.5 },
			{
				x: 0,
				y: 0,
				opacity: 1,
				scale: 1,
				delay: 0.2,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(answer2Element, {
						y: 0,
						x: `+=10`,
						opacity: 1,
						scale: 1,
						duration: 1.5,
						yoyo: true,
						repeat: -1
					});
				}
			}
		);

		gsap.fromTo(
			answer3Element,
			{ x: -1000, y: 0, opacity: 0, scale: 0.5 },
			{
				x: 0,
				y: 0,
				opacity: 1,
				scale: 1,
				delay: 0.4,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(answer3Element, {
						y: 0,
						x: `+=10`,
						opacity: 1,
						scale: 1,
						duration: 1.5,
						yoyo: true,
						repeat: -1
					});
				}
			}
		);
		gsap.fromTo(
			answer4Element,
			{ x: 1000, y: 0, opacity: 0, scale: 0.5 },
			{
				x: 0,
				y: 0,
				opacity: 1,
				delay: 0.6,
				scale: 1,
				duration: 1,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(answer4Element, {
						y: 0,
						x: `+=10`,
						opacity: 1,
						scale: 1,
						duration: 1.5,
						yoyo: true,
						repeat: -1
					});
				}
			}
		);
	}

	function onClick(event: MouseEvent) {
		console.log('click');
		const target = event.currentTarget as HTMLElement;
		const id = target.id;
		const date = target.dataset.text!;
		dateEscolhido = date;
	}
</script>

<Slide {song} {slideOrder} bind:loaded>
	<h1 class="text-wrapper-top font-bold text-3xl mt-1" in:fly={{ y: 60, duration: 1000 }}>
		Qual destes dates/viagens foi o teu favorito?
	</h1>
	<div class="flex flex-col items-center w-full p-3">
		<button
			on:click={onClick}
			bind:this={answer1Element}
			class:correct={dateEscolhido == 'o Palácio de Cristal'}
			class:incorrect={dateEscolhido != 'o Palácio de Cristal' && dateEscolhido !== ''}
			class:disabled={dateEscolhido !== ''}
			class="bg-white rounded-lg shadow-lg p-4 mt-4 w-full text-lg flex flex-row items-center justify-between z-20"
			id="palacio-cristal"
			data-text="o Palácio de Cristal"
		>
			{#if dateEscolhido == 'o Palácio de Cristal'}
				<div class="fixed">
					<Confetti duration="3000" amount="400" fallDistance="100vh" />
				</div>
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaCheckCircle /></div>
			{:else if dateEscolhido !== ''}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaTimesCircle /></div>
			{:else}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaLeaf /></div>
			{/if}

			<p class="text-center text-gray-700 font-bold">Date do Palácio de Cristal</p>
		</button>
		<button
			on:click={onClick}
			bind:this={answer2Element}
			class:correct={dateEscolhido == 'o trilho Amarantino'}
			class:incorrect={dateEscolhido != 'o trilho Amarantino' && dateEscolhido !== ''}
			class:disabled={dateEscolhido !== ''}
			class="bg-white rounded-lg shadow-lg p-4 mt-4 w-full text-lg flex flex-row items-center justify-between z-20"
			id="trilho-amarante"
			data-text="o trilho Amarantino"
		>
			{#if dateEscolhido == 'o trilho Amarantino'}
				<div class="fixed">
					<Confetti duration="3000" amount="400" fallDistance="100vh" />
				</div>
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaCheckCircle /></div>
			{:else if dateEscolhido !== ''}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaTimesCircle /></div>
			{:else}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaWalking /></div>
			{/if}

			<p class="text-center text-gray-700 font-bold">Trilhos Amarantinos</p>
		</button>
		<button
			on:click={onClick}
			bind:this={answer3Element}
			class:correct={dateEscolhido == 'Füssen'}
			class:incorrect={dateEscolhido != 'Füssen' && dateEscolhido !== ''}
			class:disabled={dateEscolhido !== ''}
			class="bg-white rounded-lg shadow-lg p-4 mt-4 w-full text-lg flex flex-row items-center justify-between z-20"
			id="fussen"
			data-text="Füssen"
		>
			{#if dateEscolhido == 'Füssen'}
				<div class="fixed">
					<Confetti duration="3000" amount="400" fallDistance="100vh" />
				</div>
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaCheckCircle /></div>
			{:else if dateEscolhido !== ''}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaTimesCircle /></div>
			{:else}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaSnowflake /></div>
			{/if}
			<p class="text-center text-gray-700 font-bold">Füssen</p>
		</button>
		<button
			on:click={onClick}
			bind:this={answer4Element}
			class:disabled={dateEscolhido !== ''}
			class:incorrect={dateEscolhido != 'o Lago de Como' && dateEscolhido !== ''}
			class:correct={dateEscolhido == 'o Lago de Como'}
			class="bg-white rounded-lg shadow-lg p-4 mt-4 w-full text-lg flex flex-row items-center justify-between z-20"
			id="como"
			data-text="o Lago de Como"
		>
			{#if dateEscolhido == 'o Lago de Como'}
				<div class="fixed">
					<Confetti duration="3000" amount="400" fallDistance="100vh" />
				</div>
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaCheckCircle /></div>
			{:else if dateEscolhido !== ''}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaTimesCircle /></div>
			{:else}
				<div class="w-12 h-12 rounded bg-bordeau-500 text-white p-1"><FaWater /></div>
			{/if}

			<p class="text-center text-gray-700 font-bold">Lago di Como</p>
		</button>
	</div>

	{#if dateEscolhido}
		<div
			class="absolute bottom-5 left-0 right-0 flex items-center justify-center p-4"
			in:fly={{ x: 200, duration: 1000 }}
		>
			<h2 class="font-bold text-3xl mt-4">
				Wow! {Math.round(Math.random() * 20 + 80)} % das pessoas concorda que {dateEscolhido} é o melhor
				date! Que ótimo gosto!
			</h2>
		</div>
	{/if}
</Slide>
