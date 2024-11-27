<script lang="ts">
	export let postId;
	let content = '';
	let errorMessage = '';
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
			body: JSON.stringify({ content, postId })
		});

		if (response.status === 200) {
			window.location.reload();
		} else {
			alert('Erro ao enviar comentário');
		}
	};
</script>

<div>
	<form on:submit={onSubmit}>
		<textarea
			name="content"
			bind:value={content}
			placeholder="Escreva o seu comentário aqui"
			class="w-full h-24 border-2 border-gray-300 p-2"
		></textarea>
		<p class="text-red-500 text-s italic font-bold">{errorMessage}</p>
		<button
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
		hover:bg-bordeau-500 hover:text-white w-20 m-auto">Enviar</button
		>
	</form>
</div>
