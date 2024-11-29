<script lang="ts">
	import {
		TimelineConnector,
		TimelineContent,
		TimelineDot,
		TimelineItem,
		TimelineOppositeContent,
		TimelineSeparator
	} from 'svelte-vertical-timeline';
	import { userStore } from '$lib/Data/stores';
	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	// @ts-ignore
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';
	import CarouselCustom from './CarouselCustom.svelte';
	import type { Post } from '$lib/Models/Post';
	import LikeButtom from './LikeButtom.svelte';

	export let post: Post;

	export let onEdit;
	export let onDelete;
	export let isNewDate;
</script>

<TimelineItem>
	{#if $userStore.name != ''}
		<button
			class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
            absolute bottom-0 left-3 z-10"
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
	{/if}
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
		<div id="post-{post._id}" class="w-full min-h-48 flex flex-col">
			<h2 class="text-center text-2xl font-bold">{post.title}</h2>

			<p
				class="text-left break-words px-4
				overflow-y-auto max-h-80
			"
			>
				{post.description}
			</p>
			<div class="flex flex-row items-center mt-auto space-x-4 justify-end">
				<LikeButtom postId={post._id} /><span>{post.likes}</span>
				<button
					class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-3 rounded"
					on:click={() => {
						window.location.href = `/${post._id}`;
					}}
					>Ver mais
				</button>
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
		<div class="flex items-center justify-center w-screen lg:max-w-xl md:max-w-96 mx-auto">
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
