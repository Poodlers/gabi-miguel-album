<script>
	import Modal from '$lib/Components/Modal.svelte';
	import { modal, postsOrder } from '$lib/Data/stores';
	import { onMount } from 'svelte';
	import Content from './content.svelte';

	export let data;
	$: ({ posts, order } = data);

	onMount(() => {
		postsOrder.set(order);
	});
</script>

<div class="w-full flex flex-col items-center bg-pink min-h-screen">
	<Modal show={$modal}>
		<Content {posts}></Content>
	</Modal>
</div>
