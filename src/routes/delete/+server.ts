import { v2 as cloudinary } from 'cloudinary';
import { postsCollection } from '$db/posts';
import { ObjectId } from 'mongodb';
import { config_cloudinary } from '$db/cloudinary';

config_cloudinary();

export const DELETE = async ({ url, request }) => {
	const posts = await postsCollection();
	const id = url.searchParams.get('post');

	const data = await request.json();
	const public_image_ids = data.public_image_ids;
	// Log the data or use it in your application logic
	console.log(data);
	if (!id) {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'You must provide an id to delete'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	posts.deleteOne({ _id: new ObjectId(id) }).then((result: { deletedCount: number }) => {
		console.log(result);
		if (result.deletedCount === 0) {
			return new Response(
				JSON.stringify({
					error: true,
					message: 'Post not found'
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}
	});

	public_image_ids.forEach(async (data: any) => {
		const result = await cloudinary.uploader.destroy(data.public_image_id);
		console.log(result);
		if (result.result === 'not found') {
			return new Response(
				JSON.stringify({
					error: true,
					message: 'Image not found'
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}
	});

	return new Response(
		JSON.stringify({
			error: false,
			message: 'Post deleted'
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
