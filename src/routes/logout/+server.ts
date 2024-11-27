export const GET = async ({ cookies }) => {
	cookies.delete('user', {
		path: '/'
	});
	return new Response('Logged out', {
		status: 200
	});
};
