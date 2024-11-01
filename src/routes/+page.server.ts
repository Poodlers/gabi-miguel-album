import type { PageServerLoad } from './$types';
import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';

export const load = (async ({ cookies }): Promise<{ posts: Post[]; order: string }> => {
	const order = cookies.get('order') || '1';

	const data = await posts
		.find({}, { limit: 50 })
		.sort({ date: Number(order) as 1 | -1 })
		.toArray();
	const dataCleaned = JSON.parse(JSON.stringify(data));

	return { posts: dataCleaned, order: order };
}) as PageServerLoad;
