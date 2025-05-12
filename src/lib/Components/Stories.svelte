<script>
	import { onMount, afterUpdate } from 'svelte';
	export let count = 0; // Number of stories
	export let duration = 3000; // Duration for each story in milliseconds
	let timers = [];
	let progress = Array(count).fill(0);
	let pausedAt = 0;
	let paused = false;

	/**
	 * @type {number}
	 */
	let interval;

	let currentIndex = 0;

	/**
	 * @param {number} index
	 */
	function goTo(index) {
		cancelAnimationFrame(interval);
		if (index >= count) return;
		if (index < 0) index = 0;
		currentIndex = index;
		updateProgress();
	}

	function handlePointerDown() {
		paused = true;
		pausedAt = progress[currentIndex];
		cancelAnimationFrame(interval);
	}

	function handlePointerUp() {
		if (paused) {
			paused = false;
			animateCurrent(performance.now(), (pausedAt / 100) * duration);
		}
	}

	function updateProgress() {
		progress = progress.map((_, i) => (i < currentIndex ? 100 : i === currentIndex ? 0 : 0));
		animateCurrent(performance.now());
	}

	/**
	 * @param {number} startTime
	 */
	function animateCurrent(startTime, elapsedSoFar = 0) {
		const totalDuration = duration;
		const initialElapsed = elapsedSoFar;

		/**
		 * @param {number} now
		 */
		function frame(now) {
			const elapsed = now - startTime + initialElapsed;
			progress[currentIndex] = Math.min(100, (elapsed / totalDuration) * 100);

			if (progress[currentIndex] < 100 && !paused) {
				interval = requestAnimationFrame(frame);
			} else if (progress[currentIndex] >= 100) {
				goTo(currentIndex + 1);
			}
		}

		interval = requestAnimationFrame(frame);
	}

	onMount(() => {
		updateProgress();
	});

	afterUpdate(() => {
		const stories = document.querySelectorAll('[data-story]');
		stories.forEach((el, i) => {
			el.classList.toggle('active', i === currentIndex);
		});
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="story-container"
	on:pointerdown={handlePointerDown}
	on:pointerup={handlePointerUp}
	on:pointercancel={handlePointerUp}
	on:contextmenu|preventDefault
>
	<!-- Progress Bars -->
	<div class="progress-container">
		{#each progress as p}
			<div class="bar"><div class="fill" style="width: {p}%"></div></div>
		{/each}
	</div>
	<div class="story-wrapper">
		<slot />
	</div>

	<div class="overlay">
		<div class="left" on:click={() => goTo(currentIndex - 1)}></div>
		<div class="right" on:click={() => goTo(currentIndex + 1)}></div>
	</div>
</div>

<style>
	.story-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;

		display: flex;
		align-items: center;
		justify-content: center;
		touch-action: manipulation;
	}

	.overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 10;
		display: flex;
		justify-content: space-between;
	}

	.left,
	.right {
		width: 20%;
		height: 100%;
	}

	.left {
		cursor: w-resize;
	}

	.right {
		cursor: e-resize;
	}
	.progress-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		display: flex;
		gap: 4px;
		padding: 8px;
		z-index: 20;
	}

	.bar {
		flex: 1;
		height: 20px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		overflow: hidden;
	}

	.fill {
		height: 100%;
		background: white;
		width: 0%;
		transition: width 0.1s linear;
	}
</style>
