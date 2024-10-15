<script>
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	export let message;

	export let onCancel = () => {};
	export let onOkay = () => {};

	const { close } = getContext('simple-modal');

	let password = '';
	let title = '';
	let description = '';
	let image = '';
	let onChange = () => {};

	function _onCancel() {
		onCancel();
		close();
	}

	function _onOkay() {
		onOkay();
		close();
	}

	$: onChange();

	const authorizedFileExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
</script>

<div class="w-full p-5 bg-pink">
	<h1 class="text-center text-bordeau font-extrabold text-3xl">{message}</h1>
	<form method="post" use:enhance enctype="multipart/form-data">
		<div>
			<label class="block text-gray-700 text-md font-bold mb-2" for="password">Password: </label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="text"
				id="password"
				name="password"
				bind:value={password}
				required
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title: </label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="text"
				id="title"
				name="title"
				bind:value={title}
				required
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-sm font-bold mb-2" for="description"
				>Description:
			</label>
			<textarea
				class="text-left shadow appearance-none border rounded h-20 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="description"
				name="description"
				bind:value={description}
			/>
		</div>

		<div>
			<label class="block text-gray-700 text-sm font-bold mb-2" for="image">Image: </label>
			<input
				type="file"
				id="file"
				name="fileToUpload"
				accept={authorizedFileExtensions.join(',')}
				required
			/>
		</div>
		<div class="flex flex-col items-center justify-center">
			<button
				class="mt-4 bg-bordeau text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				type="submit"
			>
				Confirm
			</button>
		</div>
	</form>
</div>
