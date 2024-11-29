<script>
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
	export let currentPage = 1;
	export let postId = '';
</script>

<button
	class="w-10 h-10 roundeed"
	on:click={() => {
		window.location.href = `/?page=${currentPage}#post-${postId}`;
	}}
>
	<MdArrowBack />
</button>
