import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, params }): Promise<{ post: Post; user?: string }> => {
	const postId = params.postId;
	const post = await posts.findOne({
		_id: new ObjectId(postId)
	});
	if (!post) {
		throw new Error('Post not found');
	}

	const { _id, date, title, description, content, author, comments } = post;

	return {
		post: {
			_id: _id.toString(),
			date: date.toISOString().split('T')[0],
			title,
			description,
			content,
			author,
			comments
		},

		user: cookies.get('user')
	};
}) as PageServerLoad;
