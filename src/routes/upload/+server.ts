import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { posts } from '$db/posts';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	console.log('formData:', formData);
	const image = formData.get('image');
	const date = formData.get('date');
	const title = formData.get('title');
	const description = formData.get('description');

	//read the request and the form data

	if (image == '') {
		console.log('No file uploaded');
		return new Response(
			JSON.stringify({
				error: true,
				message: 'You must provide a file to upload'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	if (!(image instanceof File)) {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'Invalid file upload'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	const buffer = new Uint8Array(await image.arrayBuffer());

	return await new Promise((resolve, reject) => {
		const cld_upload_stream = cloudinary.uploader.upload_stream(
			{
				folder: 'gabi'
			},
			function (error, result) {
				console.log(error, result);
				if (error) {
					reject(
						new Response(
							JSON.stringify({
								error: true,
								message: 'Upload failed'
							}),
							{
								status: 400,
								headers: {
									'Content-Type': 'application/json'
								}
							}
						)
					);
				} else if (result) {
					posts.insertOne({
						image: result.secure_url,
						date: date,
						title: title,
						description: description
					});

					resolve(
						new Response(
							JSON.stringify({
								success: true,
								message: 'Upload successful'
							}),
							{
								status: 200,
								headers: {
									'Content-Type': 'application/json'
								}
							}
						)
					);
				}
			}
		);

		createReadStream(buffer).pipe(cld_upload_stream);
	});
};
