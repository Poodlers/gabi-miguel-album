<script>
	import Modal from '$lib/Components/Modal.svelte';
	import {
		beginDateStore,
		endDateStore,
		modal,
		postsOrder,
		postsOrderBy,
		userStore
	} from '$lib/Data/stores';
	import { onMount } from 'svelte';
	import Content from './content.svelte';

	export let data;
	$: ({ posts, order, orderBy, beginDate, endDate, user } = data);

	onMount(() => {
		postsOrder.set(order);
		postsOrderBy.set(orderBy);
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
