<script lang="ts">
	import AddComment from '$lib/Components/AddComment.svelte';
	import BackButton from '$lib/Components/BackButton.svelte';
	import CarouselCustom from '$lib/Components/CarouselCustom.svelte';
	import LoginButton from '$lib/Components/LoginButton.svelte';
	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import Modal from '$lib/Components/Modal.svelte';
	import { modal, userStore } from '$lib/Data/stores';
	import { onMount } from 'svelte';
	export let data;
	$: ({ post, user, currentPage } = data);
	onMount(() => {
		userStore.set(user);
	});

	const userToPicture = {
		Gabi: 'gabiii.jpg',
		Miguel: 'miguel_foto.jpeg'
	};

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
</script>

<Modal show={$modal}>
	<div class="w-full flex flex-col items-center bg-pink min-h-screen py-4">
		<div class="flex flex-row mt-3 justify-between w-10/12">
			<BackButton {currentPage} postId={post._id} />
			<LoginButton />
		</div>

		<div class="flex items-center justify-center w-screen">
			<CarouselCustom
				files={post.content.map((f) => ({
					src: f.image,
					type: f.resource_type,
					name: f.public_image_id
				}))}
			/>
		</div>

		<h2 class="text-center text-2xl font-bold">{post.title}</h2>

		<p class="text-left break-words px-4">{post.description}</p>
		<div class="flex flex-row items-center space-x-4 w-10/12 justify-end">
			<p class="text-xl font-bold">Postado por {post.author}</p>
			<img
				src={post.author == 'Gabi' ? 'gabiii.jpg' : 'miguel_foto.jpeg'}
				alt="author"
				class="w-10 h-10 rounded-full"
			/>
		</div>

		<div class="w-11/12">
			<div class="flex flex-row items-end mb-5 space-x-6">
				<h2 class="text-left text-3xl font-bold">Comentários</h2>
				<p class="text-left text-xl font-bold">{post.comments.length}</p>
			</div>
			{#if !post.comments}
				<p class="text-center">Nenhum comentário ainda</p>
			{:else}
				<div class="flex flex-col items-center">
					{#each post.comments as comment}
						<div class="flex flex-row items-center space-x-4 w-full mb-5">
							<img
								src={userToPicture[comment.author]
									? userToPicture[comment.author]
									: 'default_user.jpg'}
								alt="author"
								class="w-10 h-10 rounded-full"
							/>
							<p class="text-xl font-bold">{comment.author}</p>
							<p>{comment.content}</p>
							{#if $userStore.name != ''}
								<button
									class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
								 
							"
									on:click={() => onDelete(post._id, comment._id)}
								>
									<MdDelete />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
			<AddComment postId={post._id} />
		</div>
	</div>
</Modal>
