<!--
@component
	This component consists of the main Timeline component. It displays the timeline
		@param posts - the posts to be displayed in the timeline
-->
<script lang="ts">
	import type { Post } from '$lib/Models/Post';
	import { getContext, onMount } from 'svelte';
	import AddEventModal from './AddEventModal.svelte';
	import { Timeline } from 'svelte-vertical-timeline';
	import ItemDesktop from './ItemDesktop.svelte';
	import ItemMobile from './ItemMobile.svelte';
	import { files } from '$lib/Data/stores';
	import ConfirmDelete from './ConfirmDelete.svelte';

	export let posts: Post[];

	let innerWidth: number = 0;
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

	function delelePost(postId: string, public_image_ids: string[]) {
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

	function onDelete(postId: string, postTitle: string, public_image_ids: string[]) {
		open(
			ConfirmDelete,
			{
				message: 'Confirmar ação',
				hasForm: true,
				onDelete: delelePost,
				public_image_ids,
				postId,
				postTitle,
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

	const { open } = getContext<{ open: (component: any, props: any, options: any) => void }>(
		'simple-modal'
	);

	const onCancel = (_text: any) => {};

	const onOkay = (_text: any) => {};

	let loading = false;
	let reachedEnd = false;

	const loadMore = () => {
		if (loading || reachedEnd) return;
		loading = true;
		fetch(`/load-more`)
			.then((res) => {
				res.json().then((data) => {
					if (data.posts.length === 0) {
						reachedEnd = true;
						loading = false;
						window.removeEventListener('scroll', handleScroll);
						return;
					}
					posts = [...posts, ...data.posts];
					loading = false;
				});
			})
			.catch((err) => console.log(err));
	};

	const handleScroll = () => {
		const threshold = 200;
		const scrollPosition = window.scrollY + window.innerHeight;
		const pageHeight = document.documentElement.scrollHeight;

		if (pageHeight - scrollPosition <= threshold) {
			loadMore();
		}
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		let targetElement = window.location.href.includes('#')
			? document.getElementById(window.location.href.split('#')[1])
			: null;
		const offset = 50; // Adjust this value for scrolling farther down
		if (targetElement) {
			const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
			const scrollPosition = elementPosition + offset;

			window.scrollTo({
				top: scrollPosition,
				behavior: 'smooth' // Smooth scrolling
			});
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
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

	{#if loading}
		<div class="w-full flex flex-col justify-center items-center my-auto">
			<div class="animate-spin rounded-full h-16 w-16 border-b-4 border-bordeau-800"></div>
			<h1 class="text-bordeau-800 font-bold text-md">Carregando...</h1>
		</div>
	{/if}
	{#if reachedEnd}
		<div class="w-full py-4 flex flex-col justify-center items-center my-auto">
			<h1 class="text-border-800 font-bold text-xl">Não há mais posts !</h1>
		</div>
	{/if}
</div>
