import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { posts } from '$db/posts';
import { ObjectId } from 'mongodb';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const date = formData.get('date');
	const title = formData.get('title');
	const author = formData.get('author');
	const description = formData.get('description');
	const files = formData.getAll('files');
	let fileUploads = [];
	console.log('formData:', formData);
	for (const file of files) {
		const image = file as File;
		console.log(image.name, image.size);

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
		fileUploads.push(
			() =>
				new Promise(
					(
						resolve: (value: any) => void,

						reject
					) => {
						const cld_upload_stream = cloudinary.uploader.upload_stream(
							{
								folder: 'gabi',
								resource_type: 'auto',
								overwrite: true
							},
							function (error, result: any) {
								resolve(result);
							}
						);

						createReadStream(buffer).pipe(cld_upload_stream);
					}
				)
		);
	}
	const promises = fileUploads.map((task) => task()); // Execute all tasks
	const results = await Promise.all(promises); // Wait for all to finish
	let content = [];
	for (const result of results) {
		console.log('result:', result);
		const optimizedURL =
			result.resource_type == 'video'
				? result.secure_url
				: cloudinary.url(result.public_id, {
						quality: 'auto',
						fetch_format: 'auto',
						secure: true
					});
		content.push({
			resource_type: result.resource_type,
			public_image_id: result.public_id,
			image: optimizedURL
		});
	}
	posts.insertOne({
		content: content,
		date: date ? new Date(date.toString()) : new Date(),
		title: title,
		description: description,
		author: author,
		comments: []
	});
	return new Response(
		JSON.stringify({
			success: true,
			message: 'Uploads successful'
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
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
	const files = formData.getAll('files') as File[];
	const filesInfo: {
		file: File | null;
		type: string;
		src: string;
		name: string;
	}[] = JSON.parse(formData.get('newFilesInfo') as string);
	const date = formData.get('date');
	const title = formData.get('title');
	const description = formData.get('description');
	const author = formData.get('author');
	const originalFiles: { public_image_id: string; resource_type: string; image: string }[] =
		JSON.parse(formData.get('originalFiles') as string);

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

	for (const file of originalFiles) {
		//destroy the files from the original that are not in the files array
		if (!filesInfo.find((f) => f.src == file.image)) {
			await cloudinary.uploader.destroy(file.public_image_id);
		}
	}
	let content = [];
	let fileUploads = [];
	for (const file of filesInfo) {
		// upload the files that are not in the originalFiles array

		//find corresponding image
		const correspondingFile = files.find((f: File) => f.name == file.name);

		if (correspondingFile) {
			const buffer = new Uint8Array(await correspondingFile.arrayBuffer());
			fileUploads.push(
				() =>
					new Promise(
						(
							resolve: (value: any) => void,

							reject
						) => {
							const cld_upload_stream = cloudinary.uploader.upload_stream(
								{
									folder: 'gabi',
									resource_type: 'auto',
									overwrite: true
								},
								function (error, result: any) {
									resolve(result);
								}
							);

							createReadStream(buffer).pipe(cld_upload_stream);
						}
					)
			);
		} else {
			const originalImage = originalFiles.find((f) => f.image == file.src);
			content.push(originalImage);
		}
	}

	const promises = fileUploads.map((task) => task()); // Execute all tasks
	const results = await Promise.all(promises); // Wait for all to finish

	for (const result of results) {
		console.log('result:', result);
		const optimizedURL =
			result.resource_type == 'video'
				? result.secure_url
				: cloudinary.url(result.public_id, {
						quality: 'auto',
						fetch_format: 'auto',
						secure: true
					});
		content.push({
			resource_type: result.resource_type,
			public_image_id: result.public_id,
			image: optimizedURL
		});
	}

	posts.updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				date: new Date(date || originalPost.date),
				title: title,
				description: description,
				content: content,
				author: author
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
};
