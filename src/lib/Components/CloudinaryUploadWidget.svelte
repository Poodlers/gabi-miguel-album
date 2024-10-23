<script lang="ts">
	import { onMount } from 'svelte';
	let widget: any;

	onMount(() => {
		if ('cloudinary' in window) {
			widget = (window as any).cloudinary.createUploadWidget(
				{
					cloudName: 'dx7uvkha3',
					uploadPreset: 'preset-gabi'
				},
				(error: any, result: any) => {
					if (!error && result && result.event === 'success') {
						console.log('Done! Here is the image info: ', result.info);
					}
				}
			);
		}
	});

	function handleClick() {
		if (widget) {
			widget.open();
		}
	}
</script>

<div class="w-full p-5 bg-pink">
	<button
		on:click|preventDefault={handleClick}
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	>
		Upload Image
	</button>
</div>
