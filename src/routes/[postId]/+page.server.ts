import type { Post } from '$lib/Models/Post';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';
import type { User } from '$lib/Models/User';
import { postsCollection } from '$db/posts';

export const load = (async ({
	cookies,
	params
}): Promise<{ post: Post; user: User; currentPage: number }> => {
	const postId = params.postId;
	const user = cookies.get('user');
	const posts = await postsCollection();
	const post = await posts.findOne({
		_id: new ObjectId(postId)
	});
	if (!post) {
		throw new Error('Post not found');
	}
	const currentPage = Number(cookies.get('pageNumber')) || 1;
	const { _id, date, title, description, content, author, comments, likes } = post;
	const likedCookies = JSON.parse(cookies.get('liked') || '[]') as string[];

	let finalUser: User = { name: user ? user : '', likes: likedCookies };

	return {
		post: {
			_id: _id.toString(),
			date: date.toISOString().split('T')[0],
			title,
			description,
			content,
			author,
			comments,
			likes
		},
		currentPage,
		user: finalUser
	};
}) as PageServerLoad;
