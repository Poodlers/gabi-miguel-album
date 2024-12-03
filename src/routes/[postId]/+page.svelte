<script lang="ts">
	import AddComment from '$lib/Components/AddComment.svelte';
	import BackButton from '$lib/Components/BackButton.svelte';
	import CarouselCustom from '$lib/Components/CarouselCustom.svelte';
	import LoginButton from '$lib/Components/LoginButton.svelte';

	import Modal from '$lib/Components/Modal.svelte';
	import { modal, userStore } from '$lib/Data/stores';
	import { onMount } from 'svelte';
	import LikeButtom from '$lib/Components/LikeButtom.svelte';
	import Comment from '$lib/Components/Comment.svelte';
	export let data;
	$: ({ post, user, currentPage } = data);
	onMount(() => {
		userStore.set(user);
	});
</script>

<Modal show={$modal}>
	<div class="w-full flex flex-col items-center bg-pink min-h-screen py-4">
		<div
			class=" 
				flex
				flex-row
				justify-between
				items-center
				mt-2
				mb-4
				w-11/12
				mx-auto

			"
		>
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
		<div class="flex flex-row justify-between items-end w-10/12">
			<div class="flex flex-row items-center mt-5 space-x-4 justify-end">
				<LikeButtom
					postId={post._id}
					on:change={(event) => {
						post.likes = event.detail;
					}}
				/><span class="text-xl font-bold">{post.likes}</span>
			</div>
			<div class="flex flex-row items-center space-x-4 w-10/12 justify-end">
				<p class="text-xl font-bold">Postado por {post.author}</p>
				<img
					src={post.author == 'Gabi' ? 'gabiii.jpg' : 'miguel_foto.jpeg'}
					alt="author"
					class="w-10 h-10 rounded-full"
				/>
			</div>
		</div>

		<div class="w-11/12 my-5">
			<div class="flex flex-row items-end mb-5 space-x-6">
				<h2 class="text-left text-2xl font-bold">Comentários</h2>
				<p class="text-left text-xl font-bold">{post.comments.length}</p>
			</div>
			{#if !post.comments}
				<p class="text-center">Nenhum comentário ainda</p>
			{:else}
				<div class="flex flex-col items-center">
					{#each post.comments as comment}
						<Comment {comment} {post} />
					{/each}
				</div>
			{/if}
			<AddComment postId={post._id} parentId={undefined} />
		</div>
	</div>
</Modal>
