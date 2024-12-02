import { config_cloudinary } from '$db/cloudinary';
import { start_mongo } from '$db/mongo';

start_mongo()
	.then((client): void => {
		console.log('Connected to MongoDB');
		client.db('admin').command({ ping: 1 });
	})
	.catch((err): void => {
		console.error('Failed to connect to MongoDB:', err);
	});

console.log(config_cloudinary());
