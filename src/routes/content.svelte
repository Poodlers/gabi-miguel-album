<script lang="ts">
	import AddButton from '$lib/Components/AddButton.svelte';
	import FilterMenu from '$lib/Components/FilterMenu.svelte';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import Timeline from '$lib/Components/Timeline.svelte';
	import type { Post } from '$lib/Models/Post';

	export let posts: Post[];
</script>

<div>
	<h1 class="mt-4 text-4xl font-bold text-center">Timeline do Amor</h1>
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
	<AddButton />
</div>

<Timeline {posts} />
