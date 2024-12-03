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
	// @ts-ignore
	import MdModeComment from 'svelte-icons/md/MdModeComment.svelte';
	import CarouselCustom from './CarouselCustom.svelte';
	import type { Post } from '$lib/Models/Post';
	import LikeButtom from './LikeButtom.svelte';
	import { convertDateFormat } from '$lib/utils/utils';

	export let post: Post;

	export let onEdit;
	export let onDelete;
	export let isNewDate;
</script>

<TimelineItem>
	{#if $userStore.name != ''}
		<button
			class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
            absolute top-0 left-3 z-10"
			on:click={() => onEdit(post)}
		>
			<MdEdit />
		</button>
		<button
			class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute top-0 right-3 z-10
            "
			on:click={() => onDelete(post._id, post.title, post.content)}
		>
			<MdDelete />
		</button>
	{/if}
	<TimelineSeparator>
		{#if isNewDate}
			<TimelineDot
				style="background-color: #603140; border-radius: 5px; border-color: #603140; width: 15vw;"
			>
				<p class="text-bordeau-300 font-bold text-xl text-center w-full">
					{convertDateFormat(post.date.toString())}
				</p>
			</TimelineDot>
		{/if}

		<TimelineConnector
			style="background-color: #603140; border-radius: 5px; border-color: #603140; "
		></TimelineConnector>
	</TimelineSeparator>

	<TimelineOppositeContent slot="opposite-content" style="align-content:center;  ">
		<div id="post-{post._id}" class="w-full min-h-48 flex flex-col h-5/6">
			<div class="flex flex-col items-center h-full justify-center">
				<h2 class="text-center text-2xl font-bold mb-5">{post.title}</h2>

				<p
					class="text-left break-words px-4
					overflow-y-auto max-h-80
				"
				>
					{post.description}
				</p>
			</div>
			<div class="flex flex-row items-center mt-auto space-x-4 justify-end">
				<div class="flex flex-row justify-between items-end w-full ml-4">
					<div class="flex flex-row items-center mt-5 space-x-4 justify-end">
						<div class="flex flex-row items-center space-x-2 justify-end">
							<LikeButtom
								postId={post._id}
								on:change={(event) => {
									post.likes = event.detail;
								}}
							/><span class="text-xl font-bold">{post.likes}</span>
						</div>
						<div class="flex flex-row items-center space-x-2">
							<div class="w-8 h-8">
								<MdModeComment />
							</div>
							<span class="text-xl font-bold">{post.commentsLength}</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center w-full">
						<button
							class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-6 rounded"
							on:click={() => {
								window.location.href = `/${post._id}`;
							}}
							>Ver mais
						</button>
					</div>
					<div class="flex flex-row items-center space-x-4 w-10/12 justify-end">
						<p class="text-lg font-bold">{post.author}</p>
						<img
							src={post.author == 'Gabi' ? 'gabiii.jpg' : 'miguel_foto.jpeg'}
							alt="author"
							class="w-10 h-10 rounded-full"
						/>
					</div>
				</div>
			</div>
		</div></TimelineOppositeContent
	>

	<TimelineContent style="align-content:center;">
		<div class="flex items-center justify-center w-full lg:max-w-112 md:max-w-96 mx-auto">
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
