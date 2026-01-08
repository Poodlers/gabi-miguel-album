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
	import CarouselCustom from './CarouselCustom.svelte';
	let steps = [
		{ text: 'Passo 1: Insere a data' },
		{ text: 'Passo 2: Insere o título e descrição' },
		{ text: 'Passo 3: Insere imagens/vídeos' }
	];

	export let message;
	import { files, userStore } from '$lib/Data/stores';

	const { close } = getContext<{ close: () => void }>('simple-modal');

	export let id: string = '';

	export let originalPostContent: {
		public_image_id: string;
		resource_type: string;
		image: string;
	}[];
	let clientWidth: number = 0;

	export let title: string = '';
	export let description: string = '';
	export let date: string = '';

	let error: string = '';
	let step = 0;
	let loading = false;

	// Progress to the next step
	const nextStep = () => {
		if (step < steps.length) {
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

	async function uploadToCloudinary(file: File, folder = 'gabi') {
		const sigRes = await fetch('/cloudinary/sign', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ folder })
		});
		if (!sigRes.ok) throw new Error('Failed to get Cloudinary signature');
		const sig = await sigRes.json();

		const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;

		const fd = new FormData();
		fd.append('file', file);
		fd.append('api_key', sig.apiKey);
		fd.append('timestamp', String(sig.timestamp));
		fd.append('signature', sig.signature);
		fd.append('folder', sig.folder);

		const upRes = await fetch(endpoint, { method: 'POST', body: fd });
		if (!upRes.ok) throw new Error(await upRes.text());

		const r = await upRes.json();
		return {
			public_id: r.public_id,
			secure_url: r.secure_url,
			resource_type: r.resource_type as 'image' | 'video' | 'raw'
		};
	}
	const submitForm = async (event: any) => {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			// Map original image URL -> public_id (for edit mode)
			const originalByUrl = new Map<string, string>(
				(originalPostContent ?? []).map((c) => [c.image, c.public_image_id])
			);

			const keptPublicIds: string[] = [];
			const uploaded: {
				public_id: string;
				secure_url: string;
				resource_type: 'image' | 'video' | 'raw';
			}[] = [];

			// Iterate in the order shown in the UI
			for (let i = 0; i < $files.length; i++) {
				const f = $files[i];

				if (f.file) {
					// NEW file: upload directly
					const renamed = new File([f.file], `${i}_${f.file.name}`, { type: f.file.type });
					const r = await uploadToCloudinary(renamed, 'gabi');
					uploaded.push(r);
				} else {
					// EXISTING file: keep it (we need its public_id)
					const pid = originalByUrl.get(f.src);
					if (pid) keptPublicIds.push(pid);
				}
			}

			const payload: any = {
				author: $userStore.name,
				title,
				description,
				date,
				uploaded
			};

			// Edit mode extras
			if (id !== '') {
				payload.id = id;
				payload.keptPublicIds = keptPublicIds;
			}

			const response = await fetch('/upload', {
				method: id === '' ? 'POST' : 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await response.json();
			error = result.message;

			if (result.success) {
				loading = false;
				close();
				window.location.reload();
				return;
			}

			loading = false;
		} catch (e: any) {
			console.error(e);
			error = e?.message ?? 'Erro ao fazer upload.';
			loading = false;
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
	{#if loading}
		<div class="w-full flex flex-col justify-center items-center my-auto">
			<div class="animate-spin rounded-full h-32 w-32 border-b-4 border-bordeau-800"></div>
			<h1 class="text-bordeau-800 font-bold text-2xl">Carregando...</h1>
		</div>
	{:else if error}
		<div class="w-full flex flex-row justify-center items-center my-auto">
			<svg
				class="shrink-0 inline w-4 h-4 me-3"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="red"
				viewBox="0 0 20 20"
			>
				<path
					d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
				/>
			</svg>
			<p class="text-red-500 text-lg italic font-bold">{error}</p>
		</div>
	{:else}
		{#key step}
			<div class="my-auto w-full" in:slide={{ axis: 'x' }}>
				{#if step === 0}
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
				{#if step === 1}
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
								class="text-left shadow appearance-none border rounded h-56 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="description"
								name="description"
								bind:value={description}
							/>
						</div>
					</div>
				{/if}
				{#if step === 2}
					<div>
						<label class="block text-gray-700 text-md font-bold mb-2 mt-2" for="image"
							>Image/Video:
						</label>

						{#if $files.length > 0}
							<CarouselCustom
								edit={true}
								on:delete={(event) => {
									console.log(event.detail);
									$files = $files.filter((f) => f.src !== event.detail);
									console.log($files);
								}}
								files={$files.map((f) => ({ src: f.src, type: f.type, name: f.src }))}
							/>
						{/if}

						<FileUploader callback={() => {}} acceptedFileTypes="image/*, video/*" />
					</div>
				{/if}

				<div class="flex flex-row justify-between my-5">
					{#if step > 0}
						<div class="flex flex-col items-center justify-center">
							<button
								class="bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
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
							class="bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
			hover:bg-bordeau-500 hover:text-white w-20
			"
							type="submit"
							on:click={step === steps.length - 1 ? submitForm : nextStep}
						>
							{#if step === steps.length - 1}
								<MdDone></MdDone>
							{:else}
								<MdArrowForward />
							{/if}
						</button>
					</div>
				</div>
			</div>
		{/key}
	{/if}
</div>
