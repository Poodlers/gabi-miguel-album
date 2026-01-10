import { db } from '$db/mongo';

export async function postsCollection() {
	const database = await db();
	return database.collection('posts');
}
