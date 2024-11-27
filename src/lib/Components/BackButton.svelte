<script>
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
</script>

<button
	class="w-10 h-10 roundeed"
	on:click={() => {
		window.location.href = '/';
	}}
>
	<MdArrowBack />
</button>
