export interface Like {
	[post_id: string]: boolean;
}

export interface User {
	name: string;

	likes: Like;
}
