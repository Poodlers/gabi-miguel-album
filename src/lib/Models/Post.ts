export interface Post {
	_id: string;
	title: string;
	image: string;
	description: string;
	date: Date;
	content: { public_image_id: string; resource_type: string }[];
	author: string;
}
