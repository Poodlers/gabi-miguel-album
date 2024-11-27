<script lang="ts">
	import { getContext, onMount } from 'svelte';
	export let message;
	let username = '';
	let password = '';
	let errorMessage = '';

	function handleLogin(event: Event) {
		event.preventDefault();

		// Simple validation
		if (!username || !password) {
			errorMessage = 'Please fill in all fields.';
			return;
		}

		// Perform login logic here
		console.log('Logging in:', { username, password });
		fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: username, password })
		})
			.then((response) => {
				console.log('Login response:', response);
				if (response.status !== 200) {
					throw new Error('Invalid login');
				}
				return response.text();
			})
			.then((data) => {
				console.log('Login successful:', data);
				window.location.reload();
			})
			.catch((error) => {
				console.error('Login failed:', error);
				errorMessage = 'Invalid login';
			});
		errorMessage = ''; // Clear any previous error
	}
</script>

<div class="w-full p-5 bg-pink flex flex-col" style="min-height:90vh">
	<h1 class="text-center text-bordeau font-extrabold text-3xl w-full">{message}</h1>
	<form on:submit={handleLogin} class="flex flex-col justify-center items-center m-auto w-full">
		{#if errorMessage}
			<p class="text-red-500 text-s italic font-bold">{errorMessage}</p>
		{/if}

		<div class="form-group">
			<label for="username" class="block text-gray-700 text-md font-bold mb-2 mt-2">Username</label>
			<input
				type="text"
				id="username"
				bind:value={username}
				placeholder="Enter your username"
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</div>

		<div class="form-group">
			<label for="password" class="block text-gray-700 text-md font-bold mb-2 mt-2">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				placeholder="Enter your password"
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</div>

		<button
			type="submit"
			class="mt-4 bg-bordeau-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
		hover:bg-bordeau-500 hover:text-white w-20 m-auto">Login</button
		>
	</form>
</div>
