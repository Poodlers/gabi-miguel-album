<script lang="ts">
	import icons from '../Data/icons.js';
	//look at all these beautiful options
	// Buttons text, set any to "" to remove that button
	let buttonText = 'Upload';
	let doneButtonText = 'Done';
	let doneText = 'Successfully uploaded';
	let descriptionText = 'Drag or click to upload';
	export let acceptedFileTypes = 'image/*';

	// The file upload input element
	let input: HTMLInputElement;
	//Fixed uploader position?
	let fixed = false;
	//Files from the file input and the drag zone
	let inputFiles: any[] = [];
	let dragZoneFiles: any[] = [];
	//Trigger file upload
	let trigger = () => input.click();
	//External method to get the current files at any time
	export const getFiles = () => files;
	// Called when maxuploads is reached or the done button is clicked
	export let callback = (files?: any[]) => {};
	// Tiny slider

	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
	import MdArrowForward from 'svelte-icons/md/MdArrowForward.svelte';

	import Carousel from 'svelte-carousel';

	let carousel: any; // for calling methods of the carousel instance

	// Drag zone element
	let dragZone: HTMLDivElement;
	//Maximum files that can be uploaded
	export let maxFiles = 3;
	// When the maximum files are uploaded
	let maxFilesCallback = (files: any, maxFiles: number) => {};
	//Show a list of files + icons?
	export let listFiles = true;

	export let contentFromCloudinary: { public_image_id: string; resource_type: string }[];

	$: files = [...inputFiles, ...dragZoneFiles];
	$: {
		if (files.length >= maxFiles) {
			maxFilesCallback(files, maxFiles);
			dispatch('change', files);
			callback(files);
		}
		if (files.length > 0) {
			const buttons = document.querySelectorAll('.fileUploader button');
			console.log(buttons);
			buttons.forEach((button) => {
				button.setAttribute('type', 'button');
			});
		}
	}

	import { createEventDispatcher } from 'svelte';
	import CustomCarouselArrow from './CustomCarouselArrow.svelte';

	const dispatch = createEventDispatcher();

	function dragover(e: DragEvent) {
		e.preventDefault();
		dispatch('dragover', e);
	}
	function dragenter(e: DragEvent) {
		e.preventDefault();
		dragZone.classList.add('dragging');
		dispatch('dragenter', e);
	}
	function dragleave(e: DragEvent) {
		e.preventDefault();
		dragZone.classList.remove('dragging');
		dispatch('dragleave', e);
	}
	function drop(e: DragEvent) {
		e.preventDefault();
		dragZone.classList.remove('dragging');
		dragZoneFiles.push(
			...[...e.dataTransfer!.items]
				.filter((i) => i.kind === 'file')
				.map((i) => i.getAsFile())
				.filter((f) => f && f.type && f.type.match(acceptedFileTypes))
				.map((f) => ({ file: f, type: f!.type, src: URL.createObjectURL(f!) }))
		);
		dragZoneFiles = [...dragZoneFiles];
		dispatch('drop', e);
		dispatch('change', files);
	}
	function formatBytes(a: number, b = 2, k = 1024) {
		let d = Math.floor(Math.log(a) / Math.log(k));
		return 0 == a
			? '0 Bytes'
			: parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
					' ' +
					['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
	}
	function getIcon(filename: string) {
		if (!filename) {
			return icons.default;
		}
		return (
			Object.entries(icons).find((i) =>
				i[0].split(',').includes(filename.split('.').slice(-1)[0])
			)?.[1] || icons.default
		);
	}
	function inputChanged() {
		const filesFromInput = [...input.files!];

		let customFiles = [];
		for (const file of filesFromInput) {
			customFiles.push({ file, type: file.type, src: URL.createObjectURL(file) });
		}
		inputFiles = [...inputFiles, ...customFiles];
	}
	function del(file: any) {
		const idxInputFiles = idx(file, inputFiles);
		const idxDragZoneFiles = idx(file, dragZoneFiles);
		if (idxInputFiles !== null) {
			inputFiles.splice(idxInputFiles, 1);
			inputFiles = [...inputFiles];
			return;
		}
		if (idxDragZoneFiles !== null) {
			dragZoneFiles.splice(idxDragZoneFiles, 1);
			dragZoneFiles = [...dragZoneFiles];
			return;
		}
		return console.log(idx(file, inputFiles), idx(file, dragZoneFiles));
		function idx(item: any, arr: any[]) {
			let i = arr.findIndex((i) => i === item);
			if (i < 0) {
				return null;
			} else {
				return i;
			}
		}
	}
	function openFile(file: File) {
		window.open(URL.createObjectURL(file), 'filewin');
	}
</script>

<div
	bind:this={dragZone}
	on:dragover={dragover}
	on:drop={drop}
	on:dragenter={dragenter}
	on:dragleave={dragleave}
	role="region"
	class={`${fixed ? 'fixed' : ''} fileUploader dragzone`}
>
	{#if files.length !== maxFiles}
		{#if listFiles && files.length > 0}
			{#key files}
				<Carousel bind:this={carousel}>
					{#each files.slice(0, maxFiles) as file}
						{#if file.type.match('image')}
							<img
								src={file.src}
								alt={file.file.name}
								style="width: 100%; height: auto; border-radius: 6px;"
							/>
						{:else if file.type.match('video')}
							<video src={file.src} controls style="width: 100%; height: auto; border-radius: 6px;">
								<track kind="captions" src="captions.vtt" srclang="en" label="English" />
							</video>
						{:else}
							<div style="display: flex; align-items: center;">
								<div class="icon">
									<img
										src={getIcon(file.file.name)}
										alt={file.file.name}
										style="width: 20px; height: 20px;"
									/>
								</div>
								<span>{file.file.name}</span>
							</div>
						{/if}
					{/each}
					<div slot="prev" let:showPrevPage style="display:flex;">
						<div class="sc-carousel__arrow-container">
							<CustomCarouselArrow direction="PREV" on:click={showPrevPage} />
						</div>
					</div>
					<div slot="next" let:showNextPage style="display:flex;">
						<div class="sc-carousel__arrow-container">
							<CustomCarouselArrow direction="NEXT" on:click={showNextPage} />
						</div>
					</div>
				</Carousel>
			{/key}
		{/if}
		<div class="buttons">
			<button type="button" on:click={trigger} class="upload">
				{buttonText}
			</button>
		</div>
		{#if descriptionText}<span class="text">{descriptionText}</span>{/if}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
	{:else if maxFiles > 1}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			class="iconify iconify--ph"
			width="32"
			height="32"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 256 256"
			><path
				fill="currentColor"
				d="m150.8 86.8l-88 88a3.9 3.9 0 0 1-5.6 0l-44-44a4 4 0 1 1 5.6-5.6L60 166.3l85.2-85.1a4 4 0 1 1 5.6 5.6Zm92-5.6a3.9 3.9 0 0 0-5.6 0L152 166.3l-20.5-20.5a4 4 0 0 0-5.7 5.7l23.4 23.3a3.9 3.9 0 0 0 5.6 0l88-88a3.9 3.9 0 0 0 0-5.6Z"
			></path></svg
		>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if doneText}<span class="doneText" on:click={() => callback(files)}>{doneText}</span>{/if}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			class="iconify iconify--ph"
			width="10"
			height="10"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 256 256"
			><path
				fill="currentColor"
				d="M174.9 101.2a4.1 4.1 0 0 1-.1 5.7l-58.7 56a4.3 4.3 0 0 1-2.8 1.1a3.9 3.9 0 0 1-2.7-1.1l-29.4-28a4 4 0 1 1 5.6-5.8l26.5 25.4l55.9-53.4a4.1 4.1 0 0 1 5.7.1ZM228 128A100 100 0 1 1 128 28a100.2 100.2 0 0 1 100 100Zm-8 0a92 92 0 1 0-92 92a92.1 92.1 0 0 0 92-92Z"
			></path></svg
		>
		{#if doneText}<span class="doneText">{doneText}</span>{/if}
		<div class="buttons">
			<button type="button" on:click={() => del(files[0])} class="upload"> Delete </button>
		</div>
	{/if}
</div>
<input
	type="file"
	accept={acceptedFileTypes}
	hidden
	bind:this={input}
	on:change={inputChanged}
	multiple={maxFiles > 1}
/>

<style>
	.dragzone {
		padding: 20px;
		border-radius: 6px;
		border: 2px dashed #0001;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: background-color 0.3s ease;
	}

	.dragzone.dragging {
		background: #0662;
	}
	.dragzone.fixed {
		position: fixed;
		height: 80vh;
		width: 80vw;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.dragzone .text {
		font-style: italic;
		color: #333;
		opacity: 0.5;
		font-weight: 200;
	}
	.buttons {
		width: 40%;
		display: flex;
	}
	.sc-carousel__arrow-container {
		padding: 5px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.buttons button {
		margin: 0 5px;
		transition: background-color 0.2s ease;
		padding: 0.5rem 1rem;
		margin-bottom: 1rem;
		flex: 1;
		border: 1px solid #0001;
		background: transparent;
		cursor: pointer;
	}
	.buttons button:hover {
		background: #0001;
	}
</style>
