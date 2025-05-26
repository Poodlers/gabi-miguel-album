<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Slide from './Slide.svelte';
	import { browser } from '$app/environment';
	import LoadedSlide from './LoadedSlide.svelte';

	let song = 'my_kind_of_woman';
	let slideOrder = 4;
	let loaded = false;
	let map: any;
	let mapElement;
	let currentInterval: string | number | NodeJS.Timeout | undefined;
	let L: any;

	// Your relationship journey!
	const locations = [
		{
			name: 'Porto, Portugal',
			coords: [41.1578, -8.6292],
			image: '/images/porto.jpg'
		},
		{
			name: 'Cinque Terre, Italy',
			coords: [44.1345, 9.682],
			image: '/images/italy.jpg'
		},
		{
			name: 'Munich, Germany',
			coords: [48.1351, 11.582],
			image: '/images/germany.jpg'
		},
		{
			name: 'Nature Trail',
			coords: [40.6782, -8.7457], // just an example
			image: '/images/trail.jpg'
		}
	];

	let currentIndex = 0;

	function showNextLocation() {
		if (currentIndex >= locations.length) return;
		const { coords, name, image } = locations[currentIndex];
		map.flyTo(coords, 10, {
			duration: 10
		});

		const popup = L.popup({ closeButton: false })
			.setLatLng(coords)
			.setContent(
				`<div style="text-align:center;">
          <strong>${name}</strong><br />
          <img src="${image}" width="200" style="border-radius: 8px; margin-top: 6px;" />
        </div>
      `
			)
			.openOn(map);

		currentIndex++;
		currentInterval = setTimeout(showNextLocation, 10000); // Wait before next location
	}

	$: if (loaded) {
		currentIndex = 0;
		map = L.map('map').setView([41.1579, -8.6291], 5);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
		// Start showing locations after the map is loaded
		currentInterval = setTimeout(showNextLocation, 1000);
	}

	onMount(async () => {
		L = await import('leaflet');
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<LoadedSlide {song} {slideOrder} bind:loaded>
	<div id="map" class:show-map={loaded} bind:this={mapElement}></div>
</LoadedSlide>

<style>
	#map {
		width: 100%;
		height: 96vh;
		position: absolute;
		bottom: 0;
		border-radius: 1rem;
		overflow: hidden;
	}

	.show-map #map {
		display: block !important;
	}
</style>
