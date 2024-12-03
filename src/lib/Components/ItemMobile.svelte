<script lang="ts">
	import {
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
	import type { Post } from '$lib/Models/Post';
	import CarouselCustom from './CarouselCustom.svelte';
	import LikeButtom from './LikeButtom.svelte';
	import { convertDateFormat } from '$lib/utils/utils';
	export let post: Post;
	export let onEdit;
	export let onDelete;
	export let isNewDate;
</script>

<TimelineItem style="flex-direction: column; align-items:center; overflow-x:hidden;">
	{#if $userStore.name != ''}
		<button
			class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
            
            absolute top-5 left-5 z-10"
			on:click={() => onEdit(post)}
		>
			<MdEdit />
		</button>
		<button
			class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute top-5 right-5 z-10
            "
			on:click={() => onDelete(post._id, post.title, post.content)}
		>
			<MdDelete />
		</button>
	{/if}
	{#if isNewDate}
		<TimelineSeparator>
			<TimelineDot
				style="background-color: #603140; border-radius: 5px; border-color: #603140;  width: 40vw"
			>
				<p class="text-bordeau-300 font-bold text-xl text-center w-full">
					{convertDateFormat(post.date.toString())}
				</p>
			</TimelineDot>
		</TimelineSeparator>
	{/if}

	<div>
		<TimelineOppositeContent slot="opposite-content" style="align-content:center; ">
			<div id="post-{post._id}" class="flex items-center justify-center w-screen my-auto">
				<CarouselCustom
					files={post.content.map((f) => ({
						src: f.image,
						type: f.resource_type,
						name: f.public_image_id
					}))}
				/>
			</div>
		</TimelineOppositeContent>

		<TimelineContent style="align-content:center;">
			<div class="w-full lg:max-w-md md:max-w-72 flex flex-col my-5">
				<div class="w-11/12 mx-auto">
					<h2 class="text-center text-2xl font-bold">{post.title}</h2>
					<p
						class="text-left break-words px-4 my-5 max-h-24 overflow-hidden
					text-elipsis overflow-ellipsis line-clamp-4
				"
					>
						{post.description}
					</p>
				</div>

				<div class="flex flex-row justify-between items-center mt-auto w-10/12 mx-auto">
					<div class="flex flex-row items-center space-x-3">
						<div class="flex flex-row items-center space-x-2">
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
					<div class="flex flex-row items-center space-x-3">
						<p class="text-lg font-bold">{post.author}</p>
						<img
							src={post.author == 'Gabi' ? 'gabiii.jpg' : 'miguel_foto.jpeg'}
							alt="author"
							class="w-10 h-10 rounded-full"
						/>
					</div>
					<button
						class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-3 rounded"
						on:click={() => {
							window.location.href = `/${post._id}`;
						}}
						>Ver mais
					</button>
				</div>
			</div>
		</TimelineContent>
	</div>
</TimelineItem>
