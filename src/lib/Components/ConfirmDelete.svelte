<script lang="ts">
	import { getContext } from 'svelte';
	export let message;
	export let postId;
	export let postTitle;
	export let onDelete;
	const { close } = getContext<{ close: () => void }>('simple-modal');
	export let public_image_ids;
</script>

<div class="w-full p-5 bg-pink flex flex-col items-center justify-center">
	<h1 class="text-center text-bordeau font-extrabold text-3xl w-full mb-6">{message}</h1>
	<p
		class="  
        text-center
        text-bordeau
        font-extrabold
    "
	>
		Tens a certeza que queres apagar o post "{postTitle}" ?
	</p>
	<div class="flex flex-row justify-between w-4/6 mt-6">
		<button
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
        hover:bg-bordeau-500 hover:text-white w-20
        "
			on:click={() => onDelete(postId, public_image_ids)}>Sim</button
		>
		<button
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
        hover:bg-bordeau-500 hover:text-white w-20
        "
			on:click={() => close()}>Não</button
		>
	</div>
</div>
