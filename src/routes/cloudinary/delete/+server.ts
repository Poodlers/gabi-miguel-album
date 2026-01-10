import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { config_cloudinary } from '$db/cloudinary';

config_cloudinary();

export const POST = async ({ request }) => {
	const { publicIds } = await request.json();

	if (!Array.isArray(publicIds)) {
		return json({ error: true, message: 'Invalid payload' }, { status: 400 });
	}

	const results: { public_id: string; ok: boolean; error?: string }[] = [];

	for (const publicId of publicIds) {
		try {
			// try image + video to be safe
			try {
				await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
			} catch {}
			try {
				await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
			} catch {}
			results.push({ public_id: publicId, ok: true });
		} catch (e: any) {
			results.push({ public_id: publicId, ok: false, error: e?.message ?? 'delete failed' });
		}
	}

	return json({ success: true, results });
};
