<script>
	import Modal from '$lib/Components/Modal.svelte';
	import { modal } from '$lib/Data/stores';
	import Content from './content.svelte';

	export let data;
	$: ({ posts } = data);
</script>

<div class="w-full flex flex-col items-center bg-pink min-h-screen">
	<Modal show={$modal}>
		<Content {posts}></Content>
	</Modal>
</div>
