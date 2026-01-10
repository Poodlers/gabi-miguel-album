import { db } from '$db/mongo';

export async function usersCollection() {
	const database = await db();
	return database.collection('users');
}
