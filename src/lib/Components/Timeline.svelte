<!--
@component
	This component consists of the main Timeline component. It displays the timeline
		@param posts - the posts to be displayed in the timeline
-->
<script lang="ts">
	import type { Post } from '$lib/Models/Post';
	import { getContext } from 'svelte';
	import AddEventModal from './AddEventModal.svelte';
	import { Timeline } from 'svelte-vertical-timeline';
	import ItemDesktop from './ItemDesktop.svelte';
	import ItemMobile from './ItemMobile.svelte';

	export let posts: Post[];

	let innerWidth: number;

	function onEdit(post: Post) {
		open(
			AddEventModal,
			{
				message: 'EDITAR POST',
				hasForm: true,
				id: post._id,
				title: post.title,
				description: post.description,
				date: post.date,
				imageFromCloudinary: post.image,
				onCancel,
				onOkay
			},
			{
				closeButton: true,
				closeOnEsc: false,
				closeOnOuterClick: true,
				background: 'rgba(0, 0, 0, .5)'
			}
		);
	}

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

	const { open } = getContext<{ open: (component: any, props: any, options: any) => void }>(
		'simple-modal'
	);

	const onCancel = (_text: any) => {};

	const onOkay = (_text: any) => {};
</script>

<svelte:window bind:innerWidth />

<div class="w-full">
	<Timeline position={'alternate'} style={' padding: 50px 0; border-radius: 2%;'}>
		{#each posts as post}
			{#if innerWidth > 640}
				<ItemDesktop {post} {onEdit} {onDelete} />
			{:else}
				<ItemMobile {post} {onEdit} {onDelete} />
			{/if}
		{/each}
	</Timeline>
</div>
