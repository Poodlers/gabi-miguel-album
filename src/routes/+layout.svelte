<script>
	import '../app.css';

	// Import the Analytics package, and the SvelteKit dev variable.
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	// Inject the Analytics functionality
	inject({ mode: dev ? 'development' : 'production' });
</script>

<slot></slot>
