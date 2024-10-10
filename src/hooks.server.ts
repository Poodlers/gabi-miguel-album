import { start_mongo } from '$db/mongo';

start_mongo()
	.then((): void => {
		console.log('Connected to MongoDB');
	})
	.catch((err): void => {
		console.error('Failed to connect to MongoDB:', err);
	});
