<script lang="ts">
	import type { Comment } from '$lib/Models/comment';
	import { userStore } from '$lib/Data/stores';
	import type { Post } from '$lib/Models/Post';
	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	// @ts-ignore
	import MdReply from 'svelte-icons/md/MdReply.svelte';
	import FaAngleDown from 'svelte-icons/fa/FaAngleDown.svelte';
	import FaAngleUp from 'svelte-icons/fa/FaAngleUp.svelte';
	import AddComment from './AddComment.svelte';
	import CommentReply from './CommentReply.svelte';
	import { getRelativeTime } from '$lib/utils/utils';
	export let comment: Comment;
	const userToPicture: { [key: string]: string } = {
		Gabi: 'gabiii.jpg',
		Miguel: 'miguel_foto.jpeg'
	};
	let replyArea: HTMLDivElement;

	let showingReplies = false;
	export let post: Post;
	const onDelete = (postId: string, commentId: string) => {
		fetch(`/comment`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ postId, commentId })
		}).then(() => {
			window.location.reload();
		});
	};

	const onReply = () => {
		replyArea.classList.toggle('hidden');
		showingReplies = !replyArea.classList.contains('hidden');
	};
</script>

<div class="flex flex-col w-full mb-5">
	<div class="flex flex-row items-center space-x-4 w-full">
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
					on:click={() => onDelete(post._id, comment._id)}
				>
					<MdDelete />
				</button>
			{/if}
			<button
				class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-1 rounded w-6 h-6 shrink-0"
				on:click={() => {
					onReply();
				}}
			>
				<MdReply />
			</button>
		</div>
	</div>
	{#if comment.replies && comment.replies.length > 0}
		<div class="w-full">
			<button
				class="bg-transparent text-black py-1 px-1 font-bold rounded shrink-0 flex flex-row items-center space-x-2 w-full"
				on:click={() => {
					showingReplies = !showingReplies;
				}}
			>
				<p>{showingReplies ? 'Esconder' : 'Mostrar'} respostas ({comment.replies.length})</p>
				<div class="h-6">
					{#if showingReplies}
						<FaAngleUp />
					{:else}
						<FaAngleDown />
					{/if}
				</div>
			</button>
		</div>
	{/if}
	<div class="hidden w-full pl-16 my-5" bind:this={replyArea}>
		<AddComment postId={post._id} parentId={comment._id} />
	</div>
	{#if comment.replies && comment.replies.length > 0}
		<div class:hidden={!showingReplies} class="flex flex-col items-center w-full pl-16">
			{#each comment.replies as reply}
				<CommentReply comment={reply} postId={post._id} parentCommentId={comment._id} />
			{/each}
		</div>
	{/if}
</div>
