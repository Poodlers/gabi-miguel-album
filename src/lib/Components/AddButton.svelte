<!--
@component
	This component consists of the Add Button. When clicked it will open the Add Post modal
-->
<script>
	import { files } from '$lib/Data/stores';
	import AddEventModal from './AddEventModal.svelte';
	import { getContext } from 'svelte';
	// @ts-ignore
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	const { open } = getContext('simple-modal');

	const onCancel = (/** @type {any} */ _text) => {};

	const onOkay = (/** @type {any} */ _text) => {};
	const showDialog = () => {
		files.set([]);
		open(
			AddEventModal,
			{
				message: 'NOVO POST',
				hasForm: true,
				onCancel,
				onOkay
			},
			{
				closeButton: true,
				closeOnEsc: false,
				closeOnOuterClick: true,
				background: 'rgba(0, 0, 0, .5)'
			}
		);
	};
</script>

<button class="bg-black w-12 text-white rounded" on:click={showDialog}>
	<MdAdd />
</button>
