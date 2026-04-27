import React, { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';
import type { MapStoryPlace } from './map/types';

type MapJourneySlideProps = {
	isPaused: boolean;
	songLabel: string;
	places: MapStoryPlace[];
	onComplete?: () => void;
};

type Phase = 'title' | 'journey';

type GlobePoint = {
	id: string;
	name: string;
	lat: number;
	lng: number;
	color: string;
};

const TITLE_DURATION = 4;
const PHOTO_DURATION = 2.5;

export default function MapJourneySlide({
	isPaused,
	songLabel,
	places,
	onComplete
}: MapJourneySlideProps) {
	const globeRef = useRef<any>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleCardRef = useRef<HTMLDivElement | null>(null);
	const placeLabelRef = useRef<HTMLDivElement | null>(null);
	const photoStageRef = useRef<HTMLDivElement | null>(null);
	const photoRef = useRef<HTMLImageElement | null>(null);
	const textCardRef = useRef<HTMLDivElement | null>(null);

	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	const [phase, setPhase] = useState<Phase>('title');
	const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

	const currentPlace = places[currentPlaceIndex];
	const currentPhoto = currentPlace?.photos[currentPhotoIndex];

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
		const ctx = gsap.context(() => {
			gsap.set(titleCardRef.current, {
				opacity: 0,
				y: 32,
				scale: 0.96
			});

			gsap.to(titleCardRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power3.out'
			});

			gsap.to(titleCardRef.current, {
				opacity: 0,
				y: -24,
				scale: 0.98,
				duration: 0.7,
				delay: TITLE_DURATION - 0.7,
				ease: 'power2.in',
				onComplete: () => setPhase('journey')
			});
		}, rootRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		if (phase !== 'journey') return;
		if (!currentPlace || !globeRef.current) return;

		timelineRef.current?.kill();
		setCurrentPhotoIndex(0);

		const photoCount = Math.max(currentPlace.photos.length, 1);

		const ctx = gsap.context(() => {
			gsap.set([placeLabelRef.current, photoStageRef.current, textCardRef.current], {
				opacity: 0
			});

			gsap.set(placeLabelRef.current, {
				y: 24,
				scale: 0.96
			});

			gsap.set(photoStageRef.current, {
				scale: 0,
				opacity: 0,
				transformOrigin: 'center center'
			});

			gsap.set(textCardRef.current, {
				y: 24
			});

			const tl = gsap.timeline({
				paused: isPaused,
				onComplete: () => {
					const nextIndex = currentPlaceIndex + 1;

					if (nextIndex < places.length) {
						setCurrentPlaceIndex(nextIndex);
					} else {
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
					duration: 0.85,
					ease: 'back.out(1.7)'
				});

			if (currentPlace.text.trim()) {
				tl.to(
					textCardRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.75,
						ease: 'power2.out'
					},
					'-=0.35'
				);
			}

			for (let i = 0; i < photoCount; i += 1) {
				tl.call(() => {
					setCurrentPhotoIndex(i);
				});

				if (i === 0) {
					tl.fromTo(
						photoStageRef.current,
						{
							opacity: 0,
							scale: 0.72,
							xPercent: 0
						},
						{
							opacity: 1,
							scale: 1,
							xPercent: 0,
							duration: 0.8,
							ease: 'back.out(1.5)'
						}
					);
				} else {
					tl.fromTo(
						photoStageRef.current,
						{
							xPercent: 130,
							opacity: 1,
							scale: 0.96
						},
						{
							xPercent: 0,
							opacity: 1,
							scale: 1,
							duration: 0.75,
							ease: 'power3.out'
						}
					);
				}

				tl.to({}, { duration: PHOTO_DURATION });

				if (i < photoCount - 1) {
					tl.to(photoStageRef.current, {
						xPercent: -130,
						opacity: 1,
						scale: 0.96,
						duration: 0.65,
						ease: 'power3.in'
					});
				}
			}

			tl.to([placeLabelRef.current, photoStageRef.current, textCardRef.current], {
				opacity: 0,
				y: -18,
				duration: 0.65,
				ease: 'power2.in'
			})

				.call(() => {
					globeRef.current.pointOfView(
						{
							lat: currentPlace.coordinates.lat,
							lng: currentPlace.coordinates.lng,
							altitude: 2.1
						},
						900
					);
				})

				.to({}, { duration: 1 });
		}, rootRef);

		return () => ctx.revert();
	}, [phase, currentPlaceIndex, currentPlace, places.length, isPaused, onComplete]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	if (!currentPlace) return null;

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

			{phase === 'title' && (
				<div ref={titleCardRef} style={styles.titleCard}>
					<div style={styles.title}>A nossa relação à volta do mundo</div>
					<div style={styles.subtitle}>vamos ver onde estivemos?</div>
				</div>
			)}

			{phase === 'journey' && (
				<>
					<div ref={placeLabelRef} style={styles.placeLabel}>
						<div style={styles.pin}>📍</div>
						<div>
							<div style={styles.placeName}>{currentPlace.name}</div>
							{currentPlace.country ? (
								<div style={styles.placeCountry}>{currentPlace.country}</div>
							) : null}
						</div>
					</div>

					{currentPhoto ? (
						<div style={styles.photoStageWrapper}>
							<div ref={photoStageRef} style={styles.photoStage}>
								<img
									ref={photoRef}
									key={`${currentPlace.id}-${currentPhotoIndex}`}
									src={currentPhoto}
									alt={`${currentPlace.name} ${currentPhotoIndex + 1}`}
									style={styles.photo}
								/>
							</div>
						</div>
					) : null}

					{currentPlace.text.trim() ? (
						<div ref={textCardRef} style={styles.textCard}>
							{currentPlace.text}
						</div>
					) : null}
				</>
			)}
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

	titleCard: {
		position: 'absolute',
		inset: 0,
		zIndex: 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 28,
		textAlign: 'center',
		background:
			'radial-gradient(circle at center, rgba(255, 126, 182, 0.18), rgba(5, 7, 17, 0.68) 58%, rgba(5, 7, 17, 0.92) 100%)'
	},

	title: {
		maxWidth: 820,
		fontSize: 'clamp(2.2rem, 7vw, 5rem)',
		lineHeight: 1,
		fontWeight: 900,
		textShadow: '0 18px 42px rgba(0,0,0,0.32)'
	},

	subtitle: {
		marginTop: 18,
		fontSize: 'clamp(1.15rem, 3vw, 2rem)',
		color: '#ffd8e9',
		fontWeight: 700
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
	photoStageWrapper: {
		position: 'absolute',
		left: '50%',
		top: '51%',
		transform: 'translate(-50%, -50%)',
		zIndex: 6,
		width: 'min(86vw, 520px)',
		height: 'min(58vh, 620px)'
	},

	photoStage: {
		width: '100%',
		height: '100%',
		borderRadius: 34,
		overflow: 'hidden',
		background: 'rgba(255,255,255,0.08)',
		border: '1px solid rgba(255,255,255,0.16)',
		boxShadow: '0 28px 80px rgba(0,0,0,0.42)'
	},

	photo: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		display: 'block'
	},

	textCard: {
		position: 'absolute',
		left: '50%',
		bottom: 36,
		zIndex: 7,
		transform: 'translateX(-50%)',
		width: 'min(88vw, 660px)',
		padding: '16px 18px',
		borderRadius: 24,
		background: 'rgba(13, 17, 31, 0.72)',
		border: '1px solid rgba(255,255,255,0.14)',
		backdropFilter: 'blur(16px)',
		boxShadow: '0 18px 50px rgba(0,0,0,0.28)',
		fontSize: 'clamp(0.98rem, 2vw, 1.18rem)',
		lineHeight: 1.45,
		fontWeight: 650,
		textAlign: 'center',
		color: '#ffe7f1'
	}
};
