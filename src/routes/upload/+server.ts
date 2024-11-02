import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { posts } from '$db/posts';
import { ObjectId } from 'mongodb';

export const POST = async ({ request }) => {
	const formData = await request.formData();

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
				folder: 'gabi',
				resource_type: 'auto',
				overwrite: true
			},
			function (error, result) {
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
					const optimizedURL =
						result.resource_type == 'video'
							? result.secure_url
							: cloudinary.url(result.public_id, {
									quality: 'auto',
									fetch_format: 'auto',
									secure: true
								});
					posts.insertOne({
						image: optimizedURL,
						resource_type: result.resource_type,
						public_image_id: result.public_id,
						date: date ? new Date(date.toString()) : new Date(),
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

export const PUT = async ({ request }) => {
	const formData = await request.formData();
	console.log('formData:', formData);
	const id = formData.get('id') as string | null;
	if (!id) {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'Invalid ID'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
	const image = formData.get('image');
	const date = formData.get('date');
	const title = formData.get('title');
	const description = formData.get('description');
	const imageAltered = formData.get('imageAltered');

	const originalPost = await posts.findOne({
		_id: new ObjectId(id)
	});
	if (!originalPost) {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'Post not found'
			}),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	if (imageAltered === 'true') {
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
		//delete the original image
		const result = await cloudinary.uploader.destroy(originalPost.public_image_id);
		return await new Promise((resolve, reject) => {
			const cld_upload_stream = cloudinary.uploader.upload_stream(
				{
					folder: 'gabi',
					resource_type: 'auto',
					overwrite: true
				},

				function (error, result) {
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
						const optimizedURL =
							result.resource_type == 'video'
								? result.secure_url
								: cloudinary.url(result.public_id, {
										quality: 'auto',
										fetch_format: 'auto',
										secure: true
									});
						posts.updateOne(
							{ _id: new ObjectId(id) },
							{
								$set: {
									image: optimizedURL,
									resource_type: result.resource_type,
									public_image_id: result.public_id,
									date: new Date(date || originalPost.date),
									title: title,
									description: description
								}
							}
						);

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
	} else {
		posts.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					date: new Date(date || originalPost.date),
					title: title,
					description: description
				}
			}
		);
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Post updated'
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
