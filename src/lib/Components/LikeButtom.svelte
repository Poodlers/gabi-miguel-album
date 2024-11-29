<script>
	import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
	import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
	import { userStore } from '$lib/Data/stores';
	let likes = 0;
	export let postId;
	let liked = postId in $userStore.likes;

	const toggleLike = () => {
		fetch('/like?id=' + postId, {
			method: 'GET'
		}).then((res) => {
			if (res.status === 200) {
				liked = !liked;
				$userStore.likes[postId] = liked;
			}
		});
	};
</script>

<button class="w-12 h-12" on:click={toggleLike}>
	{#if liked}
		<FaHeart />
	{:else}
		<FaRegHeart />
	{/if}
</button>
