<script>
	import { fade, fly } from 'svelte/transition';
	// @ts-ignore
	import { Confetti } from 'svelte-confetti';
	import Slide from './Slide.svelte';
	let song = 'my_kind_of_woman';
	let slideOrder = 0;
</script>

<Slide {song} {slideOrder}>
	<div
		style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;"
	>
		<Confetti x={[-3, 3]} y={[0, 0.1]} infinite duration="5000" amount="400" fallDistance="100vh" />
	</div>
	<h1 in:fly={{ y: 40, duration: 1000 }} class="title">Um ano juntinhos...</h1>
	<p in:fade={{ delay: 1000, duration: 1000 }} class="subtitle">
		365 dias, imensas memórias... vamos ver como foi...
	</p>
</Slide>
