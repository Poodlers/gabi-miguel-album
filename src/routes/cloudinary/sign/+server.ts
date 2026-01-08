import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_CLOUD_NAME
} from '$env/static/private';

export const POST = async ({ request }) => {
	const { folder } = await request.json().catch(() => ({ folder: 'gabi' }));
	const timestamp = Math.floor(Date.now() / 1000);

	const paramsToSign: Record<string, string | number> = {
		timestamp,
		folder: folder || 'gabi'
	};

	const signature = cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY_API_SECRET);

	return json({
		cloudName: CLOUDINARY_CLOUD_NAME,
		apiKey: CLOUDINARY_API_KEY,
		timestamp,
		folder: paramsToSign.folder,
		signature
	});
};
