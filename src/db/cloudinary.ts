import { v2 as cloudinary, type ConfigOptions } from 'cloudinary';
import { CLOUDINARY_API_KEY } from '$env/static/private';
import { CLOUDINARY_API_SECRET } from '$env/static/private';

export function config_cloudinary(): ConfigOptions {
	return cloudinary.config({
		cloud_name: 'dx7uvkha3',
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_API_SECRET
	});
}
