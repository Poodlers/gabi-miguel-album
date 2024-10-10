<script lang="ts">
	import AddButton from '$lib/Components/AddButton.svelte';
	import Timeline from '$lib/Components/Timeline.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ posts } = data);
</script>

<div class="w-full flex flex-col items-center">
	<AddButton />
	<Timeline {posts} />
</div>
