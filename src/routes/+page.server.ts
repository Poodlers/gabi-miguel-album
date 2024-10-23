import type { PageServerLoad } from './$types';
import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';

export const load = (async (): Promise<{ posts: Post[] }> => {
	const data = await posts.find({}, { limit: 50 }).toArray();
	const dataCleaned = JSON.parse(JSON.stringify(data));

	return { posts: dataCleaned };
}) as PageServerLoad;
