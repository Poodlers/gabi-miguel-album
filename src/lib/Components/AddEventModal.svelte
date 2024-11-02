<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import FileUploader from './FileUploader.svelte';
	import DatePicker from './DatePicker.svelte';
	import dayjs from 'dayjs';

	export let message;

	const { close } = getContext<{ close: () => void }>('simple-modal');

	let password: string = '';
	export let id: string = '';
	export let title: string = '';
	export let description: string = '';
	export let date: string = '';
	let image: File;
	export let imageFromCloudinary: string;
	export let fileTypeFromCloudinary: string;
	let imageAltered: boolean = false;

	console.log('id', id);

	let error;

	onMount(() => {
		dayjs.locale('pt');
		date = date == '' ? dayjs().format('YYYY-MM-DD') : date;
	});

	const submitForm = async (event: any) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('id', id);
		formData.append('password', password);
		formData.append('title', title);
		formData.append('description', description);
		formData.append('date', date);
		formData.append('image', image ? image : '');
		formData.append('imageAltered', imageAltered ? 'true' : 'false');

		// Make the POST request
		const response = await fetch('/upload', {
			method: id === '' ? 'POST' : 'PUT',
			body: formData
		});

		const result = await response.json();
		console.log(result);
		error = result.message;
		if (result.success) {
			close();
			window.location.reload();
		}
	};
</script>

<div class="w-full p-5 bg-pink">
	<h1 class="text-center text-bordeau font-extrabold text-3xl">{message}</h1>
	<form method="post" on:submit={submitForm} enctype="multipart/form-data">
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
				inputTxt={date}
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
			<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="image"
				>Image/Video:
			</label>
			<input hidden type="file" id="image" name="image" bind:value={image} />
			<FileUploader
				fileType={fileTypeFromCloudinary}
				imgSrc={imageFromCloudinary}
				on:change={(event) => {
					image = event.detail[0];
					imageAltered = true;
				}}
				callback={() => {}}
				listFiles={false}
				maxFiles={1}
				acceptedFileTypes="image/*, video/*"
			/>
		</div>
		<div class="flex flex-col items-center justify-center">
			<button
				class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
				hover:bg-bordeau-500 hover:text-white
				"
				type="submit"
			>
				Confirm
			</button>
		</div>
	</form>
</div>
