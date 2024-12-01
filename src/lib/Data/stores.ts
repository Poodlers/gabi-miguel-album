import type { User } from '$lib/Models/User';
import { writable } from 'svelte/store';

export const modal = writable(null);
export const postsOrder = writable('1');
export const postsOrderBy = writable('date');
export const beginDateStore = writable('');
export const endDateStore = writable('');

export const userStore = writable<User>({
	name: '',
	likes: []
});

export const files = writable<
	{
		file: File | null;
		type: string;
		src: string;
		name?: string;
	}[]
>([]);
