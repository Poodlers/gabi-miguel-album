<script lang="ts">
	import { getContext } from 'svelte';

	import { beginDateStore, endDateStore, postsOrder, postsOrderBy } from '$lib/Data/stores';
	import dayjs from 'dayjs';
	import DatePicker from './DatePicker.svelte';

	export let message;

	let order: string = $postsOrder;
	let orderBy: string = $postsOrderBy;

	let beginDate: string = $beginDateStore;
	let endDate: string = $endDateStore;

	const { close } = getContext<{ close: () => void }>('simple-modal');

	const resetFilters = () => {
		orderBy = 'date';
		order = '1';
		beginDate = '2024-01-01';
		endDate = dayjs().format('YYYY-MM-DD');
		applyFilters();
	};

	const applyFilters = () => {
		fetch(
			`/filter?orderParam=${orderBy}&order=${order}&beginDate=${beginDate}&endDate=${endDate}`,
			{
				method: 'GET'
			}
		)
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
		<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="order">Por: </label>
		<select
			class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
			id="grid-state"
			bind:value={orderBy}
		>
			<option value="date">Data</option>
			<option value="likes">Likes</option>
			<option value="comments">Comentários</option>
		</select>
	</div>
	<div>
		<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="order">Ordem: </label>
		<select
			class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
			id="grid-state"
			bind:value={order}
		>
			<option value="1">Ascendente</option>
			<option value="-1">Descendente</option>
		</select>
	</div>
	<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="date"
		>Mostrar posts entre:
	</label>
	<div class="flex flex-row items-center justify-between">
		<div class="mx-2">
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="date">Início: </label>
			<input type="hidden" id="date" name="date" bind:value={beginDate} />
			<DatePicker
				inputTxt={beginDate}
				on:datepicked={(event) => {
					beginDate = event.detail;
				}}
			/>
		</div>
		<div class="mx-2">
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="date">Fim: </label>
			<input type="hidden" id="date" name="date" bind:value={endDate} />
			<DatePicker
				inputTxt={endDate}
				on:datepicked={(event) => {
					endDate = event.detail;
				}}
			/>
		</div>
	</div>

	<div class="flex flex-row items-center justify-evenly">
		<button
			on:click={resetFilters}
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
				hover:bg-bordeau-500 hover:text-white w-1/3
				"
		>
			Reset
		</button>
		<button
			on:click={applyFilters}
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
				hover:bg-bordeau-500 hover:text-white w-1/3
				"
		>
			Confirm
		</button>
	</div>
</div>
