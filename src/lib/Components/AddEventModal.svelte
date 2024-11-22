<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import FileUploader from './FileUploader.svelte';
	import DatePicker from './DatePicker.svelte';
	import dayjs from 'dayjs';
	import { Steps } from 'svelte-steps';
	import MdArrowForward from 'svelte-icons/md/MdArrowForward.svelte';
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
	import MdDone from 'svelte-icons/md/MdDone.svelte';
	let steps = [
		{ text: 'Passo 1: Insere a password' },
		{ text: 'Passo 2: Insere o autor' },
		{ text: 'Passo 3: Insere a data' },
		{ text: 'Passo 4: Insere o título e descrição' },
		{ text: 'Passo 5: Insere imagens/vídeos' }
	];

	export let message;

	const { close } = getContext<{ close: () => void }>('simple-modal');

	let password: string = '';
	export let id: string = '';
	export let author: string = 'Gabi';

	let clientWidth: number = 0;

	export let title: string = '';
	export let description: string = '';
	export let date: string = '';
	let image: File;
	export let imageFromCloudinary: string;
	export let fileTypeFromCloudinary: string;
	let imageAltered: boolean = false;

	let error: string = '';
	let step = 1;

	// Progress to the next step
	const nextStep = () => {
		if (step == 0 && password != '1234') {
			error = 'Password inválida';
			return;
		}
		if (step < 5) {
			error = '';
			step++;
		}
	};

	// Update the width reactively
	const updateClientWidth = () => {
		clientWidth = window.innerWidth;
	};

	// Go back to the previous step
	const previousStep = () => {
		if (step > 0) step--;
	};

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'ArrowRight' || event.key === 'Enter') nextStep();
		if (event.key === 'ArrowLeft') previousStep();
	}

	onMount(() => {
		dayjs.locale('pt');
		date = date == '' ? dayjs().format('YYYY-MM-DD') : date;
		window.addEventListener('keydown', handleKeyPress);
		updateClientWidth();
		return () => {
			// Cleanup: Remove the event listener when the component is destroyed
			window.removeEventListener('keydown', handleKeyPress);
		};
	});

	const submitForm = async (event: any) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('id', id);
		formData.append('password', password);
		formData.append('title', title);
		formData.append('author', author);
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

<svelte:window on:resize={updateClientWidth} />

<div class="w-full p-5 bg-pink flex flex-col" style="min-height:90vh">
	<h1 class="text-center text-bordeau font-extrabold text-3xl w-full">{message}</h1>
	<Steps
		{steps}
		secondary="#E07F77"
		primary="#603140"
		fontFamily="ui-sans-serif, system-ui, sans-serif"
		clickable={false}
		current={step}
		size={clientWidth < 768 ? '2rem' : '3rem'}
	/>
	{#key step}
		<div class="my-auto w-full" in:slide={{ axis: 'x' }}>
			{#if step === 0}
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
			{/if}
			{#if step === 1}
				<div>
					<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="author"
						>Autor:
					</label>
					<div class="flex flex-row space-x-6 items-center justify-center">
						<button
							class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
			hover:bg-gray-300 hover:text-black w-44 {author == 'Gabi' ? 'bg-bordeau-800' : 'bg-pink'}
			"
							on:click={() => (author = 'Gabi')}
						>
							<img class="rounded-full" src="gabiii.jpg" alt="Gabi" />

							Gabi
						</button>
						<button
							class=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
			hover:bg-gray-300 hover:text-black w-44 {author == 'Miguel' ? 'bg-bordeau-800' : 'bg-pink'}
			"
							on:click={() => (author = 'Miguel')}
						>
							<img class="rounded-full" src="miguel_foto.jpeg" alt="Miguel" />
							Miguel
						</button>
					</div>
				</div>
			{/if}
			{#if step === 2}
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
			{/if}
			{#if step === 3}
				<div>
					<div>
						<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="title"
							>Title:
						</label>
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
				</div>
			{/if}
			{#if step === 4}
				<div>
					<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="image"
						>Image/Video:
					</label>
					<input hidden type="file" id="image" name="image" bind:value={image} />
					<FileUploader
						contentFromCloudinary={[]}
						on:change={(event) => {
							image = event.detail[0];
							imageAltered = true;
						}}
						callback={() => {}}
						listFiles={true}
						maxFiles={3}
						acceptedFileTypes="image/*, video/*"
					/>
				</div>
			{/if}
			{#if error}
				<p class="text-red-500 text-s italic font-bold">{error}</p>
			{/if}

			<div class="flex flex-row justify-between">
				{#if step > 0}
					<div class="flex flex-col items-center justify-center">
						<button
							class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
			hover:bg-bordeau-500 hover:text-white w-20
			"
							type="submit"
							on:click={previousStep}
						>
							<MdArrowBack />
						</button>
					</div>
				{/if}
				<div class="flex flex-col items-center justify-end">
					<button
						class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
			hover:bg-bordeau-500 hover:text-white w-20
			"
						type="submit"
						on:click={step === 4 ? submitForm : nextStep}
					>
						{#if step === 4}
							<MdDone></MdDone>
						{:else}
							<MdArrowForward />
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/key}
</div>
