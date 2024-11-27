<script lang="ts">
	import AddButton from '$lib/Components/AddButton.svelte';
	import FilterMenu from '$lib/Components/FilterMenu.svelte';
	import LoginButton from '$lib/Components/LoginButton.svelte';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import Timeline from '$lib/Components/Timeline.svelte';
	import type { Post } from '$lib/Models/Post';
	import { userStore } from '$lib/Data/stores';
	export let posts: Post[];
</script>

<div class="flex flex-row justify-between items-center">
	<img
		src="https://img1.picmix.com/output/stamp/normal/4/6/5/4/2444564_f86a6.gif"
		alt="Logo"
		class="w-20 h-20"
	/>
	<h1 class="mt-4 text-4xl font-bold text-center">Timeline do Amor</h1>
	<img
		src="https://img1.picmix.com/output/stamp/normal/4/6/5/4/2444564_f86a6.gif"
		alt="Logo"
		class="w-20 h-20"
	/>
</div>
<div
	class=" 
	flex
	flex-row
	justify-between
	items-center
	mt-4
	mb-4
	w-11/12

"
>
	<FilterMenu />
	<SearchBar />
	{#if $userStore}
		<AddButton />
	{/if}

	<LoginButton />
</div>

<Timeline {posts} />
