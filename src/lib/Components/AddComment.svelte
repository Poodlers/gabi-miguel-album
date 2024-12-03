<script lang="ts">
	export let postId;
	export let parentId;
	// @ts-ignore
	import MdSend from 'svelte-icons/md/MdSend.svelte';
	let content = '';
	let errorMessage = '';
	let textarea: HTMLTextAreaElement;
	const onSubmit = async (e: Event) => {
		e.preventDefault();
		errorMessage = '';
		if (!content) {
			errorMessage = 'Por favor, preencha o campo de comentário.';
			return;
		}
		console.log({ content, postId });
		const response = await fetch(`/comment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content, postId, parentId })
		});

		if (response.status === 200) {
			window.location.reload();
		} else {
			alert('Erro ao enviar comentário');
		}
	};
</script>

<div>
	<form class="flex flex-row" on:submit={onSubmit}>
		<textarea
			name="content"
			bind:this={textarea}
			bind:value={content}
			on:input={(event) => {
				textarea.style.height = '';
				textarea.style.height = textarea.scrollHeight + 'px';
			}}
			placeholder="Escreva o seu comentário aqui"
			class="flex-grow bg-pink resize-none overflow-y-visible border-b-2 border-bordeau-500 focus:ring-0 focus:outline-none text-sm text-gray-700
			placeholder-gray-400 leading-4 h-8 no-scrollbar"
		></textarea>

		<button
			class=" bg-bordeau-800 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline
		hover:bg-bordeau-500 hover:text-white h-8 mx-2"
		>
			<MdSend />
		</button>
	</form>
	<p class="text-red-500 text-s italic font-bold">{errorMessage}</p>
</div>
