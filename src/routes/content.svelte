<script lang="ts">
	import AddButton from '$lib/Components/AddButton.svelte';
	import Timeline from '$lib/Components/Timeline.svelte';
	import type { Post } from '$lib/Models/Post';

	export let posts: Post[];
</script>

<AddButton />
<Timeline {posts} />
