<!--
@component
	This component consists of the main Timeline component. It displays the timeline
		@param posts - the posts to be displayed in the timeline
-->
<script lang="ts">
	import type { Post } from '$lib/Models/Post';

	export let posts: Post[];
</script>

<div>
	{#each posts as post}
		<div class="p-4">
			<h2 class="text-xl font-bold">{post.title}</h2>
			<p>{post.description}</p>
			<img src={post.image} alt={post.title} />
			<p>{post.date}</p>
		</div>
	{/each}
</div>
