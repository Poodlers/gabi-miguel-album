import { v2 as cloudinary } from 'cloudinary';
import { posts } from '$db/posts';
import { ObjectId } from 'mongodb';

export const DELETE = async ({ url }) => {
	const id = url.searchParams.get('post');

	const public_image_id = url.searchParams.get('public_image_id');

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

	posts.deleteOne({ _id: new ObjectId(id) }).then((result) => {
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

	if (public_image_id && public_image_id !== 'undefined') {
		const result = await cloudinary.uploader.destroy(public_image_id);
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
	}

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
