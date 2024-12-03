export interface Comment {
	_id: string;
	author: string;
	content: string;
	date: Date;
	replies: { _id: string; author: string; content: string; date: Date }[];
}
