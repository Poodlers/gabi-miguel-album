<!--
@component
	This component consists of the Login Button. 
-->
<script>
	// @ts-nocheck

	import { getContext } from 'svelte';
	import { userStore } from '$lib/Data/stores';
	// @ts-ignore
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import FaUserCircle from 'svelte-icons/fa/FaUserCircle.svelte';
	import FaAngleDown from 'svelte-icons/fa/FaAngleDown.svelte';
	import LoginForm from './LoginForm.svelte';
	const { open } = getContext('simple-modal');

	const userToPicture = {
		Gabi: 'gabiii.jpg',
		Miguel: 'miguel_foto.jpeg'
	};

	const onLogout = () => {
		fetch('/logout').then(() => {
			window.location.reload();
		});
	};
	let show = false;
	const toggleDropdown = () => {
		show = !show;
	};
	console.log($userStore);
	const onCancel = (/** @type {any} */ _text) => {};

	const onOkay = (/** @type {any} */ _text) => {};
	const showDialog = () => {
		open(
			LoginForm,
			{
				message: 'Login',
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

<div class="ml-4 px-2 relative">
	{#if $userStore.name == ''}
		<button class="w-10 h-10 rounded" on:click={showDialog}><FaUserCircle /> </button>
	{:else}
		<button on:click={toggleDropdown}>
			<div class="flex flex-row items-center">
				<img src={userToPicture[$userStore.name]} alt="author" class="w-10 h-10 rounded-full" />
				<div class="w-5 h-5"><FaAngleDown /></div>
			</div>
		</button>
		<div
			id="dropdown"
			class="font-bold transition-all duration-500 ease-in-out transform opacity-0 scale-90 hidden absolute bg-white w-100 z-10"
			class:opacity-100={show}
			class:scale-100={show}
			class:block={show}
			class:hidden={!show}
		>
			<ul>
				<li><button on:click={onLogout}>Logout</button></li>
			</ul>
		</div>
	{/if}
</div>
