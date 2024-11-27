import { users } from '$db/users.js';
import { createHash } from 'crypto';

export const POST = async ({ request, cookies }) => {
	const { name, password } = await request.json();
	console.log(name, password);
	console.log(
		'hash ',
		createHash('sha256')
			.update(password as string)
			.digest('hex')
	);
	const user = await users.findOne({
		name,
		password: createHash('sha256')
			.update(password as string)
			.digest('hex')
	});

	if (user) {
		cookies.set('user', name as string, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			httpOnly: true
		});
		return new Response('Logged in', {
			status: 200
		});
	} else {
		return new Response('User not found', { status: 404 });
	}
};
