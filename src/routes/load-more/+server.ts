import { posts } from '$db/posts.js';

export const GET = async ({ cookies }) => {
	const order = cookies.get('order') || '1';
	const beginDate = cookies.get('beginDate') || '2024-01-01';
	const endDate = cookies.get('endDate') || new Date().toISOString().split('T')[0];
	const searchQuery = cookies.get('search') || '';
	const orderBy = cookies.get('orderBy') || 'date';

	const pageSize = 5;
	cookies.delete('search', {
		path: '/',
		httpOnly: true
	});
	let pageNumber = cookies.get('pageNumber') as number | undefined;
	console.log(pageNumber);
	if (!pageNumber) {
		pageNumber = 1;
	} else {
		pageNumber++;
	}

	cookies.set('pageNumber', pageNumber.toString(), {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7
	});
	const data = await posts
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
				$sort:
					orderBy == 'comments'
						? { commentsLength: Number(order) }
						: orderBy == 'date'
							? { date: Number(order) }
							: { likes: Number(order) }
			},
			{
				$skip: pageNumber * pageSize
			},
			{
				$limit: pageSize // Limit the results
			}
		])
		.map((doc) => {
			const { _id, date, title, description, content, author, likes, commentsLength } = doc;

			return {
				_id,
				date: date.toISOString().split('T')[0],
				title,
				description,
				content,
				author,
				likes,
				commentsLength
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
