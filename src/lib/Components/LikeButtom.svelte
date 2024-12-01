<script lang="ts">
	import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
	import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
	import { userStore } from '$lib/Data/stores';
	import { createEventDispatcher } from 'svelte';

	import { writable } from 'svelte/store';
	let max = 20;
	let min = -20;
	let hearts = writable<{ id: number; y: number }[]>([]);

	function addHeart() {
		hearts.update((current) => [...current, { id: Date.now(), y: 0 }]);
	}

	function removeHeart(id: number) {
		hearts.update((current) => current.filter((heart) => heart.id !== id));
	}

	export let postId;
	let liked = false;
	userStore.subscribe((value) => {
		liked = value.likes.includes(postId);
	});

	const dispatch = createEventDispatcher();

	const toggleLike = () => {
		addHeart();
		fetch('/like?id=' + postId, {
			method: 'GET'
		})
			.then((res) => {
				if (res.status === 200) {
					if (liked) {
						$userStore.likes = $userStore.likes.filter((id) => id !== postId);
					} else {
						$userStore.likes = [...$userStore.likes, postId];
					}
				}
				return res.json();
			})
			.then((data) => {
				dispatch('change', data.likes);
			});
	};
</script>

<button class="w-10 h-10 relative" on:click={toggleLike}>
	{#if liked}
		<FaHeart />
	{:else}
		<FaRegHeart />
	{/if}
	{#each $hearts as heart (heart.id)}
		<div
			class="heart w-10 h-10 absolute top-0 z-10 animate-fade"
			style="left: {Math.random() * (max - min) + min}px"
			on:animationend={() => removeHeart(heart.id)}
		>
			<FaHeart />
		</div>
	{/each}
</button>

<style>
	.heart {
		animation: fly 2s ease-out forwards;
	}

	@keyframes fly {
		0% {
			transform: translateY(0);
			opacity: 1;
		}
		100% {
			transform: translateY(-300px);
			opacity: 0;
		}
	}
</style>
