import type { PageServerLoad } from './$types';
import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';

export const load = (async ({
	cookies
}): Promise<{ posts: Post[]; order: string; beginDate: string; endDate: string }> => {
	const order = cookies.get('order') || '1';
	const beginDate = cookies.get('beginDate') || '2024-01-01';
	const endDate = cookies.get('endDate') || new Date().toISOString().split('T')[0];
	const searchQuery = cookies.get('search') || '';
	cookies.delete('search', {
		path: '/',
		httpOnly: true
	});
	const data = await posts
		.find({}, { limit: 50 })
		.sort({ date: Number(order) as 1 | -1 })
		.filter({
			date: {
				$gte: new Date(beginDate),
				$lte: new Date(endDate)
			},
			$or: [
				{ title: { $regex: searchQuery, $options: 'i' } },
				{ description: { $regex: searchQuery, $options: 'i' } }
			]
		})
		.map((doc) => {
			const { _id, date, title, description, content, author } = doc;

			return {
				_id,
				date: date.toISOString().split('T')[0],
				title,
				description,
				content,
				author
			};
		})
		.toArray();
	const dataCleaned = JSON.parse(JSON.stringify(data));

	return { posts: dataCleaned, order: order, beginDate: beginDate, endDate: endDate };
}) as PageServerLoad;
