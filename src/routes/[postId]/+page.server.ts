import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';
import type { Like, User } from '$lib/Models/User';

export const load = (async ({
	cookies,
	params
}): Promise<{ post: Post; user: User; currentPage: number }> => {
	const postId = params.postId;
	const user = cookies.get('user');
	const post = await posts.findOne({
		_id: new ObjectId(postId)
	});
	if (!post) {
		throw new Error('Post not found');
	}
	const currentPage = Number(cookies.get('pageNumber')) || 1;
	const { _id, date, title, description, content, author, comments, likes } = post;
	const likedCookies = JSON.parse(cookies.get('liked') || '[]') as string[];
	let likedUser: Like = {};
	for (const like of likedCookies) {
		likedUser[like] = true;
	}
	let finalUser: User = { name: user ? user : '', likes: likedUser };

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
