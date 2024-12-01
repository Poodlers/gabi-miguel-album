<script>
	import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
	import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
	import { userStore } from '$lib/Data/stores';
	import { createEventDispatcher } from 'svelte';

	export let postId;
	let liked = false;
	userStore.subscribe((value) => {
		liked = value.likes.includes(postId);
	});

	const dispatch = createEventDispatcher();

	const toggleLike = () => {
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

<button class="w-10 h-10" on:click={toggleLike}>
	{#if liked}
		<FaHeart />
	{:else}
		<FaRegHeart />
	{/if}
</button>
