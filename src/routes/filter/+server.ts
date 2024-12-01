import dayjs from 'dayjs';

export const GET = async ({ url, cookies }) => {
	const orderBy = url.searchParams.get('orderParam') || 'date';
	const order = url.searchParams.get('order') || '1';
	const beginDate = url.searchParams.get('beginDate') || '2000-01-01';
	const endDate = url.searchParams.get('endDate') || dayjs().format('YYYY-MM-DD');

	cookies.set('order', order, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: true
	});

	cookies.set('orderBy', orderBy, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: true
	});

	cookies.set('beginDate', beginDate, {
		path: '/',
		maxAge: 60 * 60 * 24,
		httpOnly: true
	});

	cookies.set('endDate', endDate, {
		path: '/',
		maxAge: 60 * 60 * 24,
		httpOnly: true
	});

	return new Response(
		JSON.stringify({
			order,
			beginDate,
			endDate,
			orderBy
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
