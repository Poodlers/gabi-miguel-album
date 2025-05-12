<script lang="ts">
	import AddButton from '$lib/Components/AddButton.svelte';
	import FilterMenu from '$lib/Components/FilterMenu.svelte';
	import LoginButton from '$lib/Components/LoginButton.svelte';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import Timeline from '$lib/Components/Timeline.svelte';
	import type { Post } from '$lib/Models/Post';
	import { userStore } from '$lib/Data/stores';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import MessageOfTheDay from '$lib/Components/MessageOfTheDay.svelte';
	export let posts: Post[];

	let angle = tweened(0, { duration: 1000, easing: cubicOut });

	// Toggle the angle back and forth
	let flip = true;
	let innerWidth = 0;

	function animateFlipFlop() {
		angle.set(flip ? 30 : -30); // Adjust angles here
		flip = !flip;
	}

	// Animate the flip-flop every 2 seconds
	onMount(() => {
		const id = setInterval(animateFlipFlop, 1000);

		return () => {
			clearInterval(id);
		};
	});
</script>

<svelte:window bind:innerWidth />

<div class="flex flex-row justify-between items-center w-10/12 mt-5 mx-auto">
	{#if innerWidth > 640}
		<img
			src="gabi_pixel.png"
			alt="Gabi"
			class="w-20 h-20 rounded"
			style="transform: rotate({$angle}deg);"
		/>
	{/if}
	<img
		src="https://img1.picmix.com/output/stamp/normal/4/6/5/4/2444564_f86a6.gif"
		alt="Logo"
		class="w-20 h-20"
	/>
	<h1 class="mt-4 text-3xl font-bold text-center">Timeline do Amor</h1>
	<img
		src="https://img1.picmix.com/output/stamp/normal/4/6/5/4/2444564_f86a6.gif"
		alt="Logo"
		class="w-20 h-20"
	/>
	{#if innerWidth > 640}
		<img
			src="miguel_pixel.png"
			alt="Miguel"
			class="w-20 h-20 rounded"
			style="transform: rotate({$angle}deg);"
		/>
	{/if}
</div>
<MessageOfTheDay />
<a
	href="/wrapped"
	class="bg-bordeau-500 rounded p-3 text-center font-bold text-pink hover:underline mt-2"
>
	Ver o wrappped
</a>
<div
	class=" 
	flex
	flex-row
	justify-between
	items-center
	my-2
	w-11/12

"
>
	<FilterMenu />
	<SearchBar />
	{#if $userStore.name != ''}
		<AddButton />
	{/if}

	<LoginButton />
</div>

<Timeline {posts} />
