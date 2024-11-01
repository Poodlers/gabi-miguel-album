export const GET = async ({ url, cookies }) => {
	const order = url.searchParams.get('order') || '1';

	cookies.set('order', order, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: false
	});

	return new Response(
		JSON.stringify({
			order
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
