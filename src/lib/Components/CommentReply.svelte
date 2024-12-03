<script lang="ts">
	import type { Comment } from '$lib/Models/comment';
	import { userStore } from '$lib/Data/stores';

	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import { getRelativeTime } from '$lib/utils/utils';

	export let comment: { _id: string; author: string; date: Date; content: string };
	export let parentCommentId: string;
	const userToPicture: { [key: string]: string } = {
		Gabi: 'gabiii.jpg',
		Miguel: 'miguel_foto.jpeg'
	};

	export let postId: string;
	const onDelete = (postId: string, commentId: string, parentCommentId: string) => {
		fetch(`/comment`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ postId, commentId, parentCommentId })
		}).then(() => {
			window.location.reload();
		});
	};
</script>

<div class="flex flex-row items-center space-x-4 w-full mb-5">
	<img
		src={userToPicture[comment.author] ? userToPicture[comment.author] : 'default_user.jpg'}
		alt="author"
		class="w-10 h-10 rounded-full shrink-0"
	/>
	<div class="flex-1">
		<div class="flex flex-row items-center space-x-2">
			<p class="text-md font-bold">{comment.author}</p>
			<p class="text-sm text-gray-500">{getRelativeTime(comment.date)}</p>
		</div>

		<p class="text-wrap whitespace-pre-wrap break-words break-all flex-grow">
			{comment.content}
		</p>
	</div>

	<div class="flex flex-row space-x-2 items-start shrink-0">
		{#if $userStore.name != ''}
			<button
				class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-1 rounded w-6 h-6 shrink-0"
				on:click={() => onDelete(postId, comment._id, parentCommentId)}
			>
				<MdDelete />
			</button>
		{/if}
	</div>
</div>
