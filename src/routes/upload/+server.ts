import { json } from '@sveltejs/kit';
import { postsCollection } from '$db/posts';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import { config_cloudinary } from '$db/cloudinary';

config_cloudinary();

type UploadedMedia = {
	resource_type: 'image' | 'video' | 'raw';
	public_id: string;
	secure_url: string;
};

type ContentItem = {
	resource_type: string;
	public_image_id: string;
	image: string;
};

function toOptimizedContentItem(m: UploadedMedia): ContentItem {
	const optimizedURL =
		m.resource_type === 'video'
			? m.secure_url
			: cloudinary.url(m.public_id, {
					quality: 'auto',
					fetch_format: 'auto',
					secure: true
				});

	return {
		resource_type: m.resource_type,
		public_image_id: m.public_id,
		image: optimizedURL
	};
}

export const POST = async ({ request }) => {
	let body: any;
	try {
		body = await request.json();
	} catch (e: any) {
		return json({ error: true, message: 'Invalid JSON body' }, { status: 400 });
	}

	try {
		const { date, title, author, description, uploaded } = body as {
			date?: string;
			title?: string;
			author?: string;
			description?: string;
			uploaded?: UploadedMedia[];
		};

		if (!author || !Array.isArray(uploaded)) {
			return json({ error: true, message: 'Invalid payload' }, { status: 400 });
		}

		const content = uploaded.map((m) => {
			if (!m?.public_id || !m?.secure_url || !m?.resource_type) {
				throw new Error(`Bad uploaded item: ${JSON.stringify(m)}`);
			}
			return toOptimizedContentItem(m);
		});
		const posts = await postsCollection();
		await posts.insertOne({
			content,
			date: date ? new Date(date) : new Date(),
			title: title ?? '',
			description: description ?? '',
			author,
			comments: [],
			likes: 0
		});

		return json({ success: true, message: 'Post created' });
	} catch (e: any) {
		console.error('POST /upload failed:', e?.stack || e);
		return json({ error: true, message: e?.message ?? 'Internal server error' }, { status: 500 });
	}
};

export const PUT = async ({ request }) => {
	const body = await request.json();

	const { id, date, title, author, description, uploaded, keptPublicIds } = body as {
		id: string;
		date?: string;
		title: string;
		author: string;
		description?: string;
		uploaded: UploadedMedia[];
		keptPublicIds: string[];
	};

	if (!id || !author || !Array.isArray(uploaded) || !Array.isArray(keptPublicIds)) {
		return json({ error: true, message: 'Invalid payload' }, { status: 400 });
	}
	const posts = await postsCollection();
	const originalPost = await posts.findOne({ _id: new ObjectId(id) });
	if (!originalPost) return json({ error: true, message: 'Post not found' }, { status: 404 });

	const originalContent: any[] = originalPost.content ?? [];
	const originalPublicIds: string[] = originalContent.map((c) => c.public_image_id);

	// delete anything removed
	const toDelete = originalPublicIds.filter((pid) => !keptPublicIds.includes(pid));

	// safest approach: try both image/video
	for (const publicId of toDelete) {
		try {
			await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
		} catch {}
		try {
			await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
		} catch {}
	}

	// keep in the order provided by the client
	const originalById = new Map(originalContent.map((c) => [c.public_image_id, c]));
	const keptContent = keptPublicIds.map((pid) => originalById.get(pid)).filter(Boolean);

	const newContent = uploaded.map(toOptimizedContentItem);
	const content = [...keptContent, ...newContent];

	await posts.updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				date: date ? new Date(date) : originalPost.date,
				title,
				description: description ?? '',
				content,
				author
			}
		}
	);

	return json({ success: true, message: 'Post updated' });
};
