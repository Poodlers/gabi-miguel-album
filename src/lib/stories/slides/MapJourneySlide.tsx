import React, { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';
import type { MapStoryPlace } from './map/types';

type MapJourneySlideProps = {
	isPaused: boolean;
	songLabel: string;
	places: MapStoryPlace[];
	requestPause?: (paused: boolean) => void;
	onComplete?: () => void;
};

type GlobePoint = {
	id: string;
	name: string;
	lat: number;
	lng: number;
	color: string;
};

export default function MapJourneySlide({
	isPaused,
	songLabel,
	places,
	requestPause,
	onComplete
}: MapJourneySlideProps) {
	const globeRef = useRef<any>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const placeLabelRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const photosRef = useRef<HTMLDivElement | null>(null);
	const textRef = useRef<HTMLDivElement | null>(null);
	const leftCloudRef = useRef<HTMLDivElement | null>(null);
	const rightCloudRef = useRef<HTMLDivElement | null>(null);

	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

	const currentPlace = places[currentPlaceIndex];

	const points: GlobePoint[] = useMemo(
		() =>
			places.map((place) => ({
				id: place.id,
				name: place.name,
				lat: place.coordinates.lat,
				lng: place.coordinates.lng,
				color: '#ff7eb6'
			})),
		[places]
	);

	useEffect(() => {
		requestPause?.(true);

		return () => {
			requestPause?.(false);
			timelineRef.current?.kill();
		};
	}, [requestPause]);

	useEffect(() => {
		if (!globeRef.current) return;

		const controls = globeRef.current.controls?.();
		if (controls) {
			controls.enableZoom = false;
			controls.enablePan = false;
			controls.enableRotate = false;
			controls.autoRotate = false;
		}

		globeRef.current.pointOfView(
			{
				lat: 20,
				lng: -20,
				altitude: 2.8
			},
			0
		);
	}, []);

	useEffect(() => {
		if (!currentPlace || !globeRef.current) return;

		timelineRef.current?.kill();

		const ctx = gsap.context(() => {
			gsap.set([placeLabelRef.current, contentRef.current], {
				opacity: 0
			});

			gsap.set(placeLabelRef.current, {
				y: 24,
				scale: 0.96
			});

			gsap.set(contentRef.current, {
				y: 34,
				scale: 0.98
			});

			gsap.set(leftCloudRef.current, {
				x: '-110%',
				opacity: 0
			});

			gsap.set(rightCloudRef.current, {
				x: '110%',
				opacity: 0
			});

			const tl = gsap.timeline({
				paused: isPaused,
				onComplete: () => {
					const nextIndex = currentPlaceIndex + 1;

					if (nextIndex < places.length) {
						setCurrentPlaceIndex(nextIndex);
					} else {
						requestPause?.(false);
						onComplete?.();
					}
				}
			});

			timelineRef.current = tl;

			tl.call(() => {
				globeRef.current.pointOfView(
					{
						lat: currentPlace.coordinates.lat,
						lng: currentPlace.coordinates.lng,
						altitude: 0.75
					},
					2600
				);
			})

				.to({}, { duration: 2.7 })

				.to(placeLabelRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.9,
					ease: 'back.out(1.7)'
				})

				.to(placeLabelRef.current, {
					scale: 1.04,
					duration: 0.7,
					yoyo: true,
					repeat: 1,
					ease: 'sine.inOut'
				})

				.to(
					contentRef.current,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 1,
						ease: 'power3.out'
					},
					'+=0.3'
				)

				.fromTo(
					photosRef.current?.children ?? [],
					{
						opacity: 0,
						y: 28,
						rotate: -4,
						scale: 0.92
					},
					{
						opacity: 1,
						y: 0,
						rotate: 0,
						scale: 1,
						duration: 0.8,
						stagger: 0.18,
						ease: 'back.out(1.5)'
					},
					'-=0.4'
				)

				.fromTo(
					textRef.current,
					{
						opacity: 0,
						y: 18
					},
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power2.out'
					},
					'-=0.35'
				)

				.to({}, { duration: 3.2 })

				.to([placeLabelRef.current, contentRef.current], {
					opacity: 0,
					y: -18,
					duration: 0.65,
					ease: 'power2.in'
				})

				.to(
					[leftCloudRef.current, rightCloudRef.current],
					{
						x: '0%',
						opacity: 1,
						duration: 1,
						ease: 'power2.inOut'
					},
					'-=0.25'
				)

				.call(() => {
					globeRef.current.pointOfView(
						{
							lat: currentPlace.coordinates.lat,
							lng: currentPlace.coordinates.lng,
							altitude: 2.2
						},
						900
					);
				})

				.to({}, { duration: 0.95 })

				.to(
					[leftCloudRef.current, rightCloudRef.current],
					{
						opacity: 0,
						duration: 0.55,
						ease: 'power2.out'
					},
					'+=0.15'
				);
		}, rootRef);

		return () => ctx.revert();
	}, [currentPlaceIndex, currentPlace, places.length, isPaused, requestPause, onComplete]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	if (!currentPlace) {
		return null;
	}

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.globeWrap}>
				<Globe
					ref={globeRef}
					width={window.innerWidth}
					height={window.innerHeight}
					backgroundColor="rgba(0,0,0,0)"
					globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
					bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
					showAtmosphere
					atmosphereColor="#ffb6d7"
					atmosphereAltitude={0.18}
					pointsData={points}
					pointLat="lat"
					pointLng="lng"
					pointColor="color"
					pointAltitude={0.035}
					pointRadius={0.22}
					pointResolution={24}
					labelsData={[
						{
							lat: currentPlace.coordinates.lat,
							lng: currentPlace.coordinates.lng,
							name: currentPlace.name
						}
					]}
					labelLat="lat"
					labelLng="lng"
					labelText="name"
					labelColor={() => '#ffffff'}
					labelSize={1.2}
					labelDotRadius={0.5}
					labelAltitude={0.04}
				/>
			</div>

			<div ref={placeLabelRef} style={styles.placeLabel}>
				<div style={styles.pin}>📍</div>
				<div>
					<div style={styles.placeName}>{currentPlace.name}</div>
					{currentPlace.country ? (
						<div style={styles.placeCountry}>{currentPlace.country}</div>
					) : null}
				</div>
			</div>

			<div ref={contentRef} style={styles.contentCard}>
				<div ref={photosRef} style={styles.photos}>
					{currentPlace.photos.slice(0, 2).map((photo, index) => (
						<img
							key={`${currentPlace.id}-${photo}`}
							src={photo}
							alt={`${currentPlace.name} ${index + 1}`}
							style={{
								...styles.photo,
								transform: index % 2 === 0 ? 'rotate(-3deg)' : 'rotate(3deg)'
							}}
						/>
					))}
				</div>

				<div ref={textRef} style={styles.placeText}>
					{currentPlace.text}
				</div>
			</div>

			<div ref={leftCloudRef} style={{ ...styles.cloudLayer, ...styles.leftClouds }}>
				☁️ ☁️ ☁️
			</div>

			<div ref={rightCloudRef} style={{ ...styles.cloudLayer, ...styles.rightClouds }}>
				☁️ ☁️ ☁️
			</div>
		</div>
	);
}

const styles: Record<string, React.CSSProperties> = {
	slide: {
		position: 'relative',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		color: '#fff',
		background: 'radial-gradient(circle at 50% 45%, #1a315e 0%, #10182e 46%, #050711 100%)',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	globeWrap: {
		position: 'absolute',
		inset: 0,
		zIndex: 1
	},

	placeLabel: {
		position: 'absolute',
		top: 92,
		left: '50%',
		zIndex: 5,
		transform: 'translateX(-50%)',
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		padding: '14px 18px',
		borderRadius: 999,
		background: 'rgba(255, 255, 255, 0.13)',
		border: '1px solid rgba(255, 255, 255, 0.18)',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 18px 40px rgba(0,0,0,0.22)'
	},

	pin: {
		width: 34,
		height: 34,
		borderRadius: 999,
		background: 'rgba(255, 126, 182, 0.25)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},

	placeName: {
		fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
		fontWeight: 900,
		lineHeight: 1
	},

	placeCountry: {
		marginTop: 4,
		fontSize: 13,
		color: 'rgba(255,255,255,0.72)'
	},

	contentCard: {
		position: 'absolute',
		left: '50%',
		bottom: 56,
		zIndex: 6,
		transform: 'translateX(-50%)',
		width: 'min(92vw, 760px)',
		padding: 18,
		borderRadius: 30,
		background: 'rgba(13, 17, 31, 0.68)',
		border: '1px solid rgba(255,255,255,0.14)',
		backdropFilter: 'blur(18px)',
		boxShadow: '0 24px 70px rgba(0,0,0,0.34)'
	},

	photos: {
		display: 'flex',
		justifyContent: 'center',
		gap: 16,
		marginBottom: 16
	},

	photo: {
		width: 'min(38vw, 230px)',
		aspectRatio: '4 / 5',
		objectFit: 'cover',
		borderRadius: 24,
		border: '5px solid rgba(255,255,255,0.92)',
		boxShadow: '0 14px 34px rgba(0,0,0,0.28)'
	},

	placeText: {
		fontSize: 'clamp(1rem, 2vw, 1.25rem)',
		lineHeight: 1.45,
		fontWeight: 650,
		textAlign: 'center',
		color: '#ffe7f1'
	},

	cloudLayer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		zIndex: 20,
		width: '60%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 'clamp(5rem, 18vw, 13rem)',
		filter: 'blur(1px)',
		textShadow: '0 20px 40px rgba(255,255,255,0.18)',
		pointerEvents: 'none'
	},

	leftClouds: {
		left: 0,
		background:
			'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 52%, rgba(255,255,255,0) 100%)'
	},

	rightClouds: {
		right: 0,
		background:
			'linear-gradient(270deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 52%, rgba(255,255,255,0) 100%)'
	}
};
