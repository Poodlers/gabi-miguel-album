import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

if (!MONGO_URL) throw new Error('Missing MONGO_URL');

const globalForMongo = globalThis as unknown as {
	_mongoClientPromise?: Promise<MongoClient>;
};

function createClient() {
	return new MongoClient(MONGO_URL, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true
		}
	});
}

export const clientPromise: Promise<MongoClient> =
	globalForMongo._mongoClientPromise ??
	(globalForMongo._mongoClientPromise = createClient().connect());

export async function db() {
	const client = await clientPromise;
	return client.db('gabi');
}
