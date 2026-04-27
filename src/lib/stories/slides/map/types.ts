export type MapStoryPlace = {
	id: string;
	name: string;
	country?: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	photos: string[];
	text: string;
};
