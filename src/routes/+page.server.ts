import type { PageServerLoad } from './$types';
import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';
import type { Like, User } from '$lib/Models/User';

export const load = (async ({
	cookies,
	url
}): Promise<{
	posts: Post[];
	order: string;
	beginDate: string;
	endDate: string;
	user: User | undefined;
}> => {
	const pageSize = 5;
	const currentPage = url.searchParams.get('page') || '1';
	const order = cookies.get('order') || '1';
	const beginDate = cookies.get('beginDate') || '2024-01-01';
	const endDate = cookies.get('endDate') || new Date().toISOString().split('T')[0];
	const searchQuery = cookies.get('search') || '';
	const user = cookies.get('user');

	cookies.set('pageNumber', '1', {
		path: '/',
		httpOnly: true
	});

	cookies.delete('search', {
		path: '/',
		httpOnly: true
	});
	const data = await posts
		.find({})
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
		.limit(pageSize * Number(currentPage))
		.map((doc) => {
			console.log(doc);
			const { _id, date, title, description, content, author, likes } = doc;

			return {
				_id,
				date: date.toISOString().split('T')[0],
				title,
				description,
				content,
				author,
				likes
			};
		})
		.toArray();
	const dataCleaned = JSON.parse(JSON.stringify(data));

	const likedCookies = JSON.parse(cookies.get('liked') || '[]') as string[];
	let likedUser: Like = {};
	for (const like of likedCookies) {
		likedUser[like] = true;
	}
	let finalUser: User = { name: user ? user : '', likes: likedUser };

	return {
		posts: dataCleaned,
		order: order,
		beginDate: beginDate,
		endDate: endDate,
		user: finalUser
	};
}) as PageServerLoad;
