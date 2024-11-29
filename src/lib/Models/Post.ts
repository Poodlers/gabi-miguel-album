import type { Comment } from './comment';

export interface Post {
	_id: string;
	title: string;
	description: string;
	date: Date;
	content: { public_image_id: string; resource_type: string; image: string }[];
	author?: string;
	comments?: Comment[];
	likes?: number;
}
