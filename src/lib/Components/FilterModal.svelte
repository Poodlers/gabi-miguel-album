<script lang="ts">
	import { getContext } from 'svelte';

	import { postsOrder } from '$lib/Data/stores';

	export let message;

	let order: string = $postsOrder;

	const { close } = getContext<{ close: () => void }>('simple-modal');

	const applyFilters = () => {
		fetch(`/filter?order=${order}`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (!data.error) {
					window.location.reload();
				}
			})
			.catch((err) => console.log(err));
		close();
	};
</script>

<div class="w-full p-5 bg-pink">
	<h1 class="text-center text-bordeau font-extrabold text-3xl">{message}</h1>

	<div>
		<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="password">Ordem: </label>
		<select
			class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
			id="grid-state"
			bind:value={order}
		>
			<option value="1">Mais antigos primeiro</option>
			<option value="-1">Mais recentes primeiro</option>
		</select>
	</div>

	<div class="flex flex-col items-center justify-center">
		<button
			on:click={applyFilters}
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
				hover:bg-bordeau-500 hover:text-white
				"
		>
			Confirm
		</button>
	</div>
</div>
