import { posts } from '$db/posts';
import { randomUUID } from 'crypto';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, cookies }) => {
	const { content, postId, parentId } = await request.json();
	const user = cookies.get('user');
	if (!parentId) {
		posts.updateOne(
			{ _id: new ObjectId(postId) },
			{
				$push: {
					comments: {
						$each: [
							{
								_id: randomUUID(),
								content: content,
								author: user ? user : 'Anónimo',
								date: new Date(),
								replies: []
							}
						]
					}
				}
			}
		);
	} else {
		posts.updateOne(
			{ _id: new ObjectId(postId), 'comments._id': parentId },
			{
				$push: {
					'comments.$.replies': {
						_id: randomUUID(),
						content: content,
						author: user ? user : 'Anónimo',
						date: new Date()
					}
				}
			}
		);
	}

	return new Response('Comment added', { status: 200 });
};

export const DELETE = async ({ request, cookies }) => {
	const { commentId, postId } = await request.json();
	const user = cookies.get('user');
	const post = await posts.findOne({ _id: new ObjectId(postId) });
	if (!post) {
		return new Response('Post not found', { status: 404 });
	}
	const comment = post.comments.find((comment: any) => comment._id.toString() === commentId);

	posts.updateOne(
		{ _id: new ObjectId(postId) },
		{
			$pull: {
				comments: {
					_id: commentId
				}
			}
		}
	);
	return new Response('Comment deleted', { status: 200 });
};
