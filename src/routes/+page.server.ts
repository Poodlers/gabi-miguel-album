import type { PageServerLoad } from './$types';
import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';
import type { User } from '$lib/Models/User';

export const load = (async ({
	cookies,
	url
}): Promise<{
	posts: Post[];
	order: string;
	orderBy: string;
	beginDate: string;
	endDate: string;
	user: User | undefined;
}> => {
	const pageSize = 5;
	const currentPage = url.searchParams.get('page') || '1';
	const order = cookies.get('order') || '1';
	const orderBy = cookies.get('orderBy') || 'date';
	const beginDate = cookies.get('beginDate') || '2024-01-01';
	const endDate = cookies.get('endDate') || new Date().toISOString().split('T')[0];
	const searchQuery = cookies.get('search') || '';
	const user = cookies.get('user');

	cookies.set('pageNumber', '1', {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7
	});

	cookies.delete('search', {
		path: '/',
		httpOnly: true
	});
	let data;
	if (orderBy == 'comments') {
		data = await posts
			.aggregate([
				{
					$match: {
						date: {
							$gte: new Date(beginDate),
							$lte: new Date(endDate)
						},
						$or: [
							{ title: { $regex: searchQuery, $options: 'i' } },
							{ description: { $regex: searchQuery, $options: 'i' } }
						]
					}
				},
				{
					$addFields: {
						commentsLength: { $size: '$comments' } // Add a field with the array length
					}
				},
				{
					$sort: { commentsLength: Number(order) } // Sort by the array length (descending)
				},
				{
					$limit: pageSize * Number(currentPage) // Limit the results
				},
				{
					$project: { commentsLength: 0 } // Optionally remove the temporary field
				}
			])
			.map((doc) => {
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
	} else {
		data = await posts
			.find({})
			.sort(
				orderBy == 'date' ? { date: Number(order) as 1 | -1 } : { likes: Number(order) as 1 | -1 }
			)
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
	}
	const dataCleaned = JSON.parse(JSON.stringify(data));

	const likedCookies = JSON.parse(cookies.get('liked') || '[]') as string[];
	console.log(likedCookies);
	let finalUser: User = { name: user ? user : '', likes: likedCookies };

	return {
		posts: dataCleaned,
		order: order,
		orderBy: orderBy,
		beginDate: beginDate,
		endDate: endDate,
		user: finalUser
	};
}) as PageServerLoad;
