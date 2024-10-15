<!--
@component
	This component consists of the Add Button. When clicked it will open the Add Post modal
-->
<script>
	import AddEventModal from './AddEventModal.svelte';
	import { getContext } from 'svelte';
	const { open } = getContext('simple-modal');

	const onCancel = (/** @type {any} */ _text) => {};

	const onOkay = (/** @type {any} */ _text) => {};
	const showDialog = () => {
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

<button class="bg-black mx-auto w-10 h-10" on:click={showDialog}>
	<img class="mx-auto" src="mdi_plus.png" alt="Add Post" />
</button>
