<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let container: HTMLDivElement;
	let cleanup: (() => void) | undefined;

	onMount(async () => {
		if (!browser) return;

		const { mountStoriesApp } = await import('./mountStoriesApp');
		cleanup = mountStoriesApp(container);

		return () => {
			cleanup?.();
		};
	});
</script>

<div bind:this={container} class="stories-host"></div>

<style>
	.stories-host {
		width: 100%;
		height: 100%;
	}
</style>
