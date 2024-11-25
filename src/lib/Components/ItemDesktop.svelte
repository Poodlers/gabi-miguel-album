<script lang="ts">
	import {
		TimelineConnector,
		TimelineContent,
		TimelineDot,
		TimelineItem,
		TimelineOppositeContent,
		TimelineSeparator
	} from 'svelte-vertical-timeline';
	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	// @ts-ignore
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';
	import CarouselCustom from './CarouselCustom.svelte';
	import type { Post } from '$lib/Models/Post';

	export let post: Post;

	export let onEdit;
	export let onDelete;
	export let isNewDate;
</script>

<TimelineItem>
	<button
		class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
            absolute bottom-0 left-3"
		on:click={() => onEdit(post)}
	>
		<MdEdit />
	</button>
	<button
		class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute bottom-0 right-3 z-10
            "
		on:click={() => onDelete(post._id, post.content)}
	>
		<MdDelete />
	</button>
	<TimelineSeparator>
		{#if isNewDate}
			<TimelineDot
				style="background-color: #A6E1FA; border-radius: 5px; border-color: #603140; width: 15vw;"
			>
				<p class="text-indigo-700 font-bold text-xl text-center w-full">{post.date}</p>
			</TimelineDot>
		{/if}

		<TimelineConnector></TimelineConnector>
	</TimelineSeparator>

	<TimelineOppositeContent slot="opposite-content" style="align-content:center;  ">
		<div class="w-screen lg:max-w-md md:max-w-72 min-h-48 flex flex-col">
			<h2 class="text-center text-2xl font-bold">{post.title}</h2>

			<p class="text-left break-words px-4">{post.description}</p>
			<div class="flex flex-row items-center mt-auto space-x-4">
				<p class="text-xl font-bold">Postado por {post.author}</p>
				<img
					src={post.author == 'Gabi' ? 'gabiii.jpg' : 'miguel_foto.jpeg'}
					alt="author"
					class="w-10 h-10 rounded-full"
				/>
			</div>
		</div></TimelineOppositeContent
	>

	<TimelineContent style="align-content:center;">
		<div class="flex items-center justify-center w-screen lg:max-w-2xl md:max-w-96">
			<CarouselCustom
				files={post.content.map((f) => ({
					src: f.image,
					type: f.resource_type,
					name: f.public_image_id
				}))}
			/>
		</div>
	</TimelineContent>
</TimelineItem>
