import { ObjectId } from 'mongodb';
import { posts } from '$db/posts.js';

export const GET = async ({ url, cookies }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'Invalid ID'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
	const post = await posts.findOne({ _id: new ObjectId(id) });
	if (!post) {
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

	// check if the user has already liked the post
	const likedCookies = JSON.parse(cookies.get('liked') || '[]') as string[];
	const liked = likedCookies.includes(id);
	if (liked) {
		await posts.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: -1 } });
	} else {
		await posts.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } });
		likedCookies.push(id);
		cookies.set('liked', JSON.stringify(likedCookies), {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 365
		});
	}
	return new Response(
		JSON.stringify({
			likes: post.likes
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
