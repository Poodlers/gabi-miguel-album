<script lang="ts">
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
	import MdArrowForward from 'svelte-icons/md/MdArrowForward.svelte';
	import Carousel from 'svelte-carousel';

	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import CustomCarouselArrow from './CustomCarouselArrow.svelte';
	import { createEventDispatcher } from 'svelte';
	export let edit: boolean = false;
	let carousel: any; // for calling methods of the carousel instance
	export let files: { src: string; type: string; name: string }[] = [];
	const dispatch = createEventDispatcher();
	function onDelete(imgSrc: string) {
		dispatch('delete', imgSrc);
	}
</script>

{#key files}
	<Carousel bind:this={carousel} >
		{#each files as file}
			{#if file.type.match('image')}
				<div class="img-container flex items-center max-h-128 overflow-x-hidden">
					{#if edit}
						<button
							class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute top-2 z-10
            "
							on:click={() => onDelete(file.src)}
						>
							<MdDelete />
						</button>
					{/if}
					<img src={file.src} alt={file.name} loading="lazy" />
				</div>
			{:else if file.type.match('video')}
				<div class="video-container overflow-x-hidden">
					{#if edit}
						<button
							class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute top-2 z-10
            "
							on:click={() => onDelete(file.src)}
						>
							<MdDelete />
						</button>
					{/if}
					<video src={file.src} controls style="width: auto; height: auto; border-radius: 6px;">
						<track kind="captions" src="captions.vtt" srclang="en" label="English" />
					</video>
				</div>
			{/if}
		{/each}

		<div slot="prev" let:showPrevPage style="position:absolute; top:50%; z-index: 2;">
			<div class="sc-carousel__arrow-container">
				<CustomCarouselArrow direction="PREV" on:click={showPrevPage} />
			</div>
		</div>
		<div slot="next" let:showNextPage style="position:absolute; top:50%; right:0; z-index: 2;">
			<div class="sc-carousel__arrow-container">
				<CustomCarouselArrow direction="NEXT" on:click={showNextPage} />
			</div>
		</div>
	</Carousel>
{/key}

<style>
	img {
		width: auto; /* Retain the natural width */
		height: auto; /* Retain the natural height */
		max-width: 100%; /* Prevent parent container constraints */
		max-height: 100%; /* Prevent parent container constraints */
		display: block; /* Avoid inline element side effects */
		margin: 0 auto;
	}

	.sc-carousel__arrow-container {
		padding: 5px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
