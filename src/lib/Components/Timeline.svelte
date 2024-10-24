<!--
@component
	This component consists of the main Timeline component. It displays the timeline
		@param posts - the posts to be displayed in the timeline
-->
<script lang="ts">
	import type { Post } from '$lib/Models/Post';
	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	// @ts-ignore
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';

	export let posts: Post[];

	function onEdit() {}

	function onDelete(postId: string, publicImageId: string) {
		console.log(postId, publicImageId);
		fetch(`/delete?post=${postId}&public_image_id=${publicImageId}`, {
			method: 'DELETE'
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (!data.error) {
					window.location.reload();
				}
			})
			.catch((err) => console.log(err));
	}
</script>

<div>
	{#each posts as post}
		<div class="p-4">
			<button
				class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded w-20 h-20"
				on:click={onEdit}
			>
				<MdEdit />
			</button>
			<button
				class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-20 h-20"
				on:click={() => onDelete(post._id, post.public_image_id)}
			>
				<MdDelete />
			</button>
			<h2 class="text-xl font-bold">{post.title}</h2>
			<p>{post.description}</p>
			<img src={post.image} alt={post.title} />
			<p>{post.date}</p>
		</div>
	{/each}
</div>
