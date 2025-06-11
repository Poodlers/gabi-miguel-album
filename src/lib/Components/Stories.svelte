<script>
	// @ts-nocheck

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import FaVolumeMute from 'svelte-icons/fa/FaVolumeMute.svelte';
	import FaVolumeUp from 'svelte-icons/fa/FaVolumeUp.svelte';
	export let count = 0; // Number of stories
	export let duration = 6000; // Duration for each story in milliseconds
	let progress = Array(count).fill(0);
	let pausedAt = 0;
	let paused = true;
	let muted = false;

	/**
	 * @type {HTMLAudioElement}
	 */
	let audio;

	/**
	 * @type {number}
	 */
	let interval;

	let currentIndex = 5;

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
	// Helper function to wait for canplaythrough
	/**
	 * @param {HTMLAudioElement} el
	 */
	function waitForCanPlayThrough(el) {
		return /** @type {Promise<void>} */ (
			/** @type {Promise<void>} */ (
				new Promise((resolve, reject) => {
					// If already ready, resolve immediately
					if (el.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
						return resolve();
					}
					// Wait for readiness
					const onReady = () => {
						cleanup();
						resolve();
					};

					const onError = (/** @type {any} */ e) => {
						cleanup();
						reject(e);
					};

					const cleanup = () => {
						el.removeEventListener('canplaythrough', onReady);
						el.removeEventListener('error', onError);
					};

					el.addEventListener('canplaythrough', onReady, { once: true });
					el.addEventListener('error', onError, { once: true });
				})
			)
		);
	}

	function pauseAudio() {
		if (audio) {
			audio.pause();
			audio.src = '';
			audio.load();
		}
	}

	/**
	 * @param {string} src
	 */
	async function switchAudio(src) {
		try {
			// Pause current audio if it's playing
			if (audio) {
				audio.pause();
			}

			// Reset audio element and set new source
			audio.src = '/songs/' + src + '.mp3';
			audio.load(); // Ensures the new source begins loading

			// Wait until the audio is ready to play through
			await waitForCanPlayThrough(audio);

			// Play the new audio
			await audio.play();
		} catch (err) {
			console.error(`Failed to play ${src}:`, err);
		}
	}
	function handlePointerDown() {
		audio.pause();
		paused = true;
		pausedAt = progress[currentIndex];
		cancelAnimationFrame(interval);
	}

	function handlePointerUp() {
		if (paused) {
			paused = true; // MUDAR
			audio.play().catch((e) => console.warn('Autoplay failed:', e));
			animateCurrent(performance.now(), (pausedAt / 100) * duration);
		}
	}

	function updateProgress() {
		progress = progress.map((_, i) => (i < currentIndex ? 100 : i === currentIndex ? 0 : 0));
		if (!paused) animateCurrent(performance.now());
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
		const firstSong = document
			.querySelector('[data-story="' + currentIndex + '"]')
			?.getAttribute('data-song');
		if (firstSong) {
			switchAudio(firstSong).catch((e) => console.warn('Failed to switch audio:', e));
		}
	});

	function handleAudioLoad() {
		const firstSong = document
			.querySelector('[data-story="' + currentIndex + '"]')
			?.getAttribute('data-song');
		if (firstSong) {
			switchAudio(firstSong).catch((e) => console.warn('Failed to switch audio:', e));
		}
	}

	$: if (currentIndex !== undefined) {
		if (browser) {
			const stories = document.querySelectorAll('[data-story]');
			stories.forEach((el, i) => {
				if (i === currentIndex) {
					el.classList.add('active');
					const song = el.getAttribute('data-song');
					if (song) {
						console.log('Switching to song:', song);
						switchAudio(song).catch((e) => console.warn('Failed to switch audio:', e));
					} else {
						pauseAudio();
					}
				} else {
					el.classList.remove('active');
				}
			});
		}
	}
</script>

<audio on:load={handleAudioLoad} bind:this={audio}></audio>
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
	<div class="absolute top-5 right-0 flex items-center justify-between p-4 mute-buttons">
		<div class="w-6 h-6">
			{#if muted}
				<button
					on:click={() => {
						muted = false;
						audio.muted = false;
					}}
				>
					<FaVolumeMute />
				</button>
			{:else}
				<button
					on:click={() => {
						muted = true;
						audio.muted = true;
					}}
				>
					<FaVolumeUp />
				</button>
			{/if}
		</div>
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
	.mute-buttons {
		z-index: 100;
	}
	.story.active {
		display: block;
	}
	.story-wrapper {
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
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
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
