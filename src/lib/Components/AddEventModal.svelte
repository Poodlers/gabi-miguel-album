<script lang="ts">
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import FileUploader from './FileUploader.svelte';
	import DatePicker from './DatePicker.svelte';
	export let message;

	const { close } = getContext<{ close: () => void }>('simple-modal');

	let password: string = '';
	let title: string = '';
	let description: string = '';
	let date: string = '';
	let image: File;

	let onChange = () => {};

	$: onChange();
</script>

<div class="w-full p-5 bg-pink">
	<h1 class="text-center text-bordeau font-extrabold text-3xl">{message}</h1>
	<form method="post" use:enhance enctype="multipart/form-data">
		<div>
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="password"
				>Password:
			</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="password"
				id="password"
				name="password"
				bind:value={password}
				required
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="date">Date: </label>
			<input type="hidden" id="date" name="date" bind:value={date} />
			<DatePicker
				on:datepicked={(event) => {
					date = event.detail;
				}}
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="title">Title: </label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="text"
				id="title"
				name="title"
				bind:value={title}
				required
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="description"
				>Description:
			</label>
			<textarea
				class="text-left shadow appearance-none border rounded h-20 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="description"
				name="description"
				bind:value={description}
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="image">Image: </label>
			<input type="hidden" id="image" name="image" bind:value={image} />
			<FileUploader
				on:change={(event) => {
					image = event.detail[0];
				}}
				callback={() => {}}
				listFiles={false}
				maxFiles={1}
				acceptedFileTypes="image/*"
			/>
		</div>
		<div class="flex flex-col items-center justify-center">
			<button
				class="mt-4 bg-bordeau text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				type="submit"
			>
				Confirm
			</button>
		</div>
	</form>
</div>
