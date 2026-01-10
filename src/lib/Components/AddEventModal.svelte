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

	import { files, userStore } from '$lib/Data/stores';

	let steps = [
		{ text: 'Passo 1: Insere a data' },
		{ text: 'Passo 2: Insere o título e descrição' },
		{ text: 'Passo 3: Insere imagens/vídeos' }
	];

	export let message;
	const { close } = getContext<{ close: () => void }>('simple-modal');

	export let id: string = '';
	export let originalPostContent: {
		public_image_id: string;
		resource_type: string;
		image: string;
	}[];

	let clientWidth = 0;

	export let title = '';
	export let description = '';
	export let date = '';

	let error = '';
	let step = 0;
	let loading = false;

	// --- Upload UX state ---
	const MAX_IMAGE_MB = 10;
	const MAX_VIDEO_MB = 100;

	const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
	const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;

	function isVideo(file: File) {
		return file.type.startsWith('video/');
	}

	function overLimit(file: File) {
		return isVideo(file) ? file.size > MAX_VIDEO_BYTES : file.size > MAX_IMAGE_BYTES;
	}

	let skippedFilesMessage = '';

	const CONCURRENCY = 3;

	let totalToUpload = 0;
	let uploadedCount = 0;
	let uploadingNames: string[] = [];

	let progressByIndex: number[] = []; // 0..100 for each new upload
	let isCancelling = false;

	// Track active XHRs so we can abort
	const activeXhrs = new Set<XMLHttpRequest>();

	// Track what got uploaded in this session so we can cleanup on cancel/failure
	let sessionUploadedPublicIds: string[] = [];

	const nextStep = () => {
		if (step < steps.length) step++;
	};
	const updateClientWidth = () => {
		clientWidth = window.innerWidth;
	};
	const previousStep = () => {
		if (step > 0) step--;
	};

	function handleKeyPress(event: KeyboardEvent) {
		if (loading) return; // avoid step switching while uploading
		if (event.key === 'ArrowRight' || event.key === 'Enter') nextStep();
		if (event.key === 'ArrowLeft') previousStep();
	}

	onMount(() => {
		dayjs.locale('pt');
		date = date === '' ? dayjs().format('YYYY-MM-DD') : date;
		window.addEventListener('keydown', handleKeyPress);
		updateClientWidth();
		return () => window.removeEventListener('keydown', handleKeyPress);
	});

	function formatMB(bytes: number) {
		return (bytes / (1024 * 1024)).toFixed(2);
	}

	async function cleanupSessionUploads() {
		if (sessionUploadedPublicIds.length === 0) return;
		try {
			await fetch('/cloudinary/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ publicIds: sessionUploadedPublicIds })
			});
		} catch {
			// swallow cleanup errors (best effort)
		} finally {
			sessionUploadedPublicIds = [];
		}
	}

	async function cancelUploads() {
		if (!loading) return;
		isCancelling = true;

		// abort all active uploads
		for (const xhr of activeXhrs) {
			try {
				xhr.abort();
			} catch {}
		}
		activeXhrs.clear();

		// delete anything already uploaded in this session
		await cleanupSessionUploads();

		error = 'Upload cancelado. Os ficheiros enviados nesta sessão foram removidos.';
		loading = false;
		isCancelling = false;
	}

	async function getSignature(folder = 'gabi') {
		const sigRes = await fetch('/cloudinary/sign', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ folder })
		});
		if (!sigRes.ok) throw new Error('Failed to get Cloudinary signature');
		return sigRes.json();
	}

	function uploadToCloudinaryWithProgress(
		file: File,
		sig: any,
		onProgress?: (pct: number) => void
	): Promise<{ public_id: string; secure_url: string; resource_type: 'image' | 'video' | 'raw' }> {
		const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;

		const fd = new FormData();
		fd.append('file', file);
		fd.append('api_key', sig.apiKey);
		fd.append('timestamp', String(sig.timestamp));
		fd.append('signature', sig.signature);
		fd.append('folder', sig.folder);

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			activeXhrs.add(xhr);

			xhr.open('POST', endpoint);

			xhr.upload.onprogress = (evt) => {
				if (!evt.lengthComputable) return;
				const pct = Math.round((evt.loaded / evt.total) * 100);
				onProgress?.(pct);
			};

			xhr.onload = () => {
				activeXhrs.delete(xhr);
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const r = JSON.parse(xhr.responseText);
						resolve({
							public_id: r.public_id,
							secure_url: r.secure_url,
							resource_type: r.resource_type as 'image' | 'video' | 'raw'
						});
					} catch {
						reject(new Error('Invalid Cloudinary response'));
					}
				} else {
					reject(new Error(xhr.responseText || `Cloudinary upload failed (${xhr.status})`));
				}
			};

			xhr.onerror = () => {
				activeXhrs.delete(xhr);
				reject(new Error('Network error uploading to Cloudinary'));
			};

			xhr.onabort = () => {
				activeXhrs.delete(xhr);
				reject(new Error('Upload aborted'));
			};

			xhr.send(fd);
		});
	}

	// simple concurrency runner (keeps progress index stable)
	async function runWithConcurrency<T>(
		tasks: Array<() => Promise<T>>,
		concurrency: number
	): Promise<T[]> {
		const results: T[] = new Array(tasks.length);
		let nextIndex = 0;

		const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
			while (true) {
				if (isCancelling) return;
				const i = nextIndex++;
				if (i >= tasks.length) return;
				results[i] = await tasks[i]();
			}
		});

		await Promise.all(workers);
		return results;
	}

	const submitForm = async (event: any) => {
		event.preventDefault();
		error = '';
		loading = true;
		isCancelling = false;

		uploadedCount = 0;

		progressByIndex = [];
		sessionUploadedPublicIds = [];

		try {
			// Build map for edit mode: existing displayed URL -> public_id
			const originalByUrl = new Map<string, string>(
				(originalPostContent ?? []).map((c) => [c.image, c.public_image_id])
			);

			const keptPublicIds: string[] = [];

			// Keep existing files (edit mode)
			for (const f of $files) {
				if (!f.file) {
					const pid = originalByUrl.get(f.src);
					if (pid) keptPublicIds.push(pid);
				}
			}
			skippedFilesMessage = '';

			// separar os novos (com file) em válidos vs inválidos
			const invalid = $files.filter((f) => f.file && overLimit(f.file));
			const validNewFileEntries = $files.filter((f) => f.file && !overLimit(f.file));

			// remove inválidos do store e continua
			if (invalid.length > 0) {
				const removedNames = invalid.map((f) => f.file!.name);

				$files = $files.filter((f) => !(f.file && overLimit(f.file)));

				skippedFilesMessage =
					`Foram ignorados ${invalid.length} ficheiro(s) por exceder limites ` +
					`(10MB imagens / 100MB vídeos): ${removedNames.slice(0, 3).join(', ')}${removedNames.length > 3 ? '…' : ''}`;
			}

			// agora sim: newFiles válidos
			const newFiles = validNewFileEntries.map((f) => f.file!);

			totalToUpload = newFiles.length;
			progressByIndex = Array(totalToUpload).fill(0);

			// If nothing new, skip Cloudinary stage
			let uploaded: {
				public_id: string;
				secure_url: string;
				resource_type: 'image' | 'video' | 'raw';
			}[] = [];

			if (totalToUpload > 0) {
				// One signature can be reused if folder/timestamp are same-ish, but simplest: get once and reuse.
				const sig = await getSignature('gabi');

				// Build tasks, keep stable index for progress
				const tasks = newFiles.map((file, idx) => async () => {
					if (isCancelling) throw new Error('Cancelled');

					uploadingNames = [...uploadingNames, file.name];

					// rename like you used to
					const renamed = new File([file], `${idx}_${file.name}`, { type: file.type });

					const r = await uploadToCloudinaryWithProgress(renamed, sig, (pct) => {
						progressByIndex[idx] = pct;
						progressByIndex = [...progressByIndex];
					});

					// record for cleanup
					sessionUploadedPublicIds.push(r.public_id);

					uploadingNames = uploadingNames.filter((n) => n !== file.name);
					// when complete, bump counter
					uploadedCount++;
					return r;
				});

				uploaded = await runWithConcurrency(tasks, CONCURRENCY);
			}

			if (isCancelling) {
				// user cancelled mid-flight
				await cleanupSessionUploads();
				loading = false;
				isCancelling = false;
				return;
			}

			// Send metadata only to your API
			const payload: any = {
				author: $userStore.name,
				title,
				description,
				date,
				uploaded
			};

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

			if (!result.success) {
				// DB write failed -> cleanup the uploads from this session
				await cleanupSessionUploads();
				throw new Error(result.message || 'Falha ao guardar no servidor');
			}

			// success: DO NOT cleanup; they are now referenced by DB
			loading = false;
			close();
			window.location.reload();
		} catch (e: any) {
			console.error(e);

			// best-effort cleanup on any failure (unless already saved)
			await cleanupSessionUploads();

			error = e?.message ?? 'Erro ao fazer upload.';
			loading = false;
			isCancelling = false;
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
		<div class="w-full flex flex-col justify-center items-center my-auto gap-4">
			<div class="animate-spin rounded-full h-20 w-20 border-b-4 border-bordeau-800"></div>

			<h1 class="text-bordeau-800 font-bold text-2xl">A enviar para a Cloudinary…</h1>
			{#if skippedFilesMessage}
				<p class="text-orange-600 text-sm font-semibold mb-2">{skippedFilesMessage}</p>
			{/if}
			{#if totalToUpload > 0}
				<p class="text-bordeau-800 font-semibold">
					{uploadedCount} / {totalToUpload} ficheiros enviados
				</p>

				<div class="w-full max-w-xl space-y-2">
					{#each progressByIndex as pct, i}
						<div class="w-full">
							<div class="flex justify-between text-sm text-gray-700">
								<span>Ficheiro {i + 1}</span>
								<span>{pct}%</span>
							</div>
							<div class="w-full h-2 bg-gray-200 rounded">
								<div class="h-2 bg-bordeau-800 rounded" style={`width:${pct}%`}></div>
							</div>
						</div>
					{/each}
				</div>

				<button
					class="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500 disabled:opacity-60"
					type="button"
					on:click={cancelUploads}
					disabled={isCancelling}
				>
					{isCancelling ? 'A cancelar…' : 'Cancelar e apagar uploads'}
				</button>
			{:else}
				<p class="text-gray-700 italic">Sem ficheiros novos para enviar…</p>

				<button
					class="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500 disabled:opacity-60"
					type="button"
					on:click={cancelUploads}
					disabled={isCancelling}
				>
					{isCancelling ? 'A cancelar…' : 'Cancelar'}
				</button>
			{/if}
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
						<p class="text-gray-700 text-sm italic mb-2 text-center">
							Tamanho máximo: <b>10 MB</b> (imagens) / <b>100 MB</b> (vídeos)
						</p>
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
