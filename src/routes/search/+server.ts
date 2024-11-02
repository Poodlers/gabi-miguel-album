export const GET = async ({ url, cookies }) => {
	const search = url.searchParams.get('search') || '';

	cookies.set('search', search, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: true
	});

	return new Response(
		JSON.stringify({
			search
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
