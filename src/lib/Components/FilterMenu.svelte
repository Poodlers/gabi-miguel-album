<!--
@component
	
-->
<script>
	import { getContext } from 'svelte';
	// @ts-ignore
	import MdFilterList from 'svelte-icons/md/MdFilterList.svelte';
	import FilterModal from './FilterModal.svelte';
	const { open } = getContext('simple-modal');

	const onCancel = (/** @type {any} */ _text) => {};

	const onOkay = (/** @type {any} */ _text) => {};
	const showDialog = () => {
		open(
			FilterModal,
			{
				message: 'Filtrar',
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

<button class="bg-black w-10 h-10 text-white" on:click={showDialog}>
	<MdFilterList />
</button>
