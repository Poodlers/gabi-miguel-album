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
	import { files } from '$lib/Data/stores';

	export let posts: Post[];

	let innerWidth: number = 1000;
	let isNewDate: boolean = false;

	function onEdit(post: Post) {
		$files = post.content.map((content) => ({
			file: null,
			src: content.image,
			type: content.resource_type
		}));
		open(
			AddEventModal,
			{
				message: 'EDITAR POST',
				hasForm: true,
				originalPostContent: post.content,
				id: post._id,
				title: post.title,
				description: post.description,
				date: post.date,
				author: post.author,
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

	function onDelete(postId: string, public_image_ids: string[]) {
		console.log(postId, public_image_ids);
		fetch(`/delete?post=${postId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ public_image_ids })
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
		{#each posts as post, index}
			{#if innerWidth > 640}
				<ItemDesktop
					{post}
					{onEdit}
					{onDelete}
					isNewDate={index > 0 ? post.date != posts[index - 1].date : true}
				/>
			{:else}
				<ItemMobile
					{post}
					{onEdit}
					{onDelete}
					isNewDate={index > 0 ? post.date != posts[index - 1].date : true}
				/>
			{/if}
		{/each}
	</Timeline>
</div>
