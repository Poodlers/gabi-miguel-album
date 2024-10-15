import type { PageServerLoad } from './$types';
import { posts } from '$db/posts';
import type { Post } from '$lib/Models/Post';
import { fail } from '@sveltejs/kit';
import { writeFileSync } from 'fs';

export const load = (async (): Promise<{ posts: Post[] }> => {
	const data = await posts.find({}, { limit: 50 }).toArray();
	console.log('data:', data);
	return {
		posts: JSON.parse(JSON.stringify(data))
	};
}) as PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		//read the request and the form data

		console.log('request:', request);
		console.log('formData:', formData);
		if (
			!(formData.fileToUpload as File).name ||
			(formData.fileToUpload as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { fileToUpload } = formData as { fileToUpload: File };

		// Write the file to the static folder
		//writeFileSync(`static/${fileToUpload.name}`, Buffer.from(await fileToUpload.arrayBuffer()));

		return {
			success: true
		};
	}
};
