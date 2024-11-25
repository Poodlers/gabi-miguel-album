import { writable } from 'svelte/store';

export const modal = writable(null);
export const postsOrder = writable('1');
export const beginDateStore = writable('');
export const endDateStore = writable('');

export const files = writable<
	{
		file: File | null;
		type: string;
		src: string;
		name?: string;
	}[]
>([]);
