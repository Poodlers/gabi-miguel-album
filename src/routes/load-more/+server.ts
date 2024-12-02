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
					$skip : pageNumber * pageSize
				},
				{
					$limit: pageSize  // Limit the results
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
			.skip(pageNumber * pageSize)
			.limit(pageSize)
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
