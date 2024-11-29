import { posts } from '$db/posts.js';

export const GET = async ({ cookies }) => {
	const order = cookies.get('order') || '1';
	const beginDate = cookies.get('beginDate') || '2024-01-01';
	const endDate = cookies.get('endDate') || new Date().toISOString().split('T')[0];
	const searchQuery = cookies.get('search') || '';
	const user = cookies.get('user');

	const pageSize = 5;
	cookies.delete('search', {
		path: '/',
		httpOnly: true
	});
	let pageNumber = cookies.get('pageNumber') as number | undefined;
	if (!pageNumber) {
		pageNumber = 1;
	} else {
		pageNumber++;
	}

	cookies.set('pageNumber', pageNumber.toString(), {
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
		.skip((pageNumber - 1) * pageSize)
		.limit(pageSize)
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

	return new Response(
		JSON.stringify({
			posts: dataCleaned
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
