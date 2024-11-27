<script>
	import Modal from '$lib/Components/Modal.svelte';
	import { beginDateStore, endDateStore, modal, postsOrder, userStore } from '$lib/Data/stores';
	import { onMount } from 'svelte';
	import Content from './content.svelte';

	export let data;
	$: ({ posts, order, beginDate, endDate, user } = data);

	onMount(() => {
		postsOrder.set(order);
		beginDateStore.set(beginDate);
		endDateStore.set(endDate);
		userStore.set(user);
	});
</script>

<div class="w-full flex flex-col items-center bg-pink min-h-screen">
	<Modal show={$modal}>
		<Content {posts}></Content>
	</Modal>
</div>
