import React, { useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type DistanceSlideProps = {
	isPaused: boolean;
	songLabel: string;
};

const PORTO = {
	name: 'Porto',
	lat: 41.1579,
	lng: -8.6291
};

const STUTTGART = {
	name: 'Stuttgart',
	lat: 48.7758,
	lng: 9.1829
};

const DISTANCE_KM = 1620; // approximate great-circle distance

export default function DistanceSlide({ isPaused, songLabel }: DistanceSlideProps) {
	const globeRef = useRef<any>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const introTextRef = useRef<HTMLDivElement | null>(null);
	const globeWrapRef = useRef<HTMLDivElement | null>(null);
	const distanceRef = useRef<HTMLDivElement | null>(null);
	const finalTextRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	const points = useMemo(
		() => [
			{ ...PORTO, color: '#ff7eb6' },
			{ ...STUTTGART, color: '#ff7eb6' }
		],
		[]
	);

	const arcs = useMemo(
		() => [
			{
				startLat: PORTO.lat,
				startLng: PORTO.lng,
				endLat: STUTTGART.lat,
				endLng: STUTTGART.lng,
				color: ['#ff7eb6', '#ffd1e6']
			}
		],
		[]
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
				lat: 45,
				lng: 2,
				altitude: 1.65
			},
			0
		);
	}, []);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(
				[introTextRef.current, globeWrapRef.current, distanceRef.current, finalTextRef.current],
				{
					opacity: 0
				}
			);

			gsap.set(introTextRef.current, { y: 36, scale: 0.96 });
			gsap.set(globeWrapRef.current, { scale: 0.96 });
			gsap.set(distanceRef.current, { y: 22, scale: 0.92 });
			gsap.set(finalTextRef.current, { y: 32, scale: 0.96 });

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.to(introTextRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power3.out'
			})

				.to({}, { duration: 1.5 })

				.to(introTextRef.current, {
					opacity: 0,
					y: -24,
					duration: 0.65,
					ease: 'power2.in'
				})

				.to(globeWrapRef.current, {
					opacity: 1,
					scale: 1,
					duration: 1.1,
					ease: 'power3.out'
				})

				.call(() => {
					globeRef.current?.pointOfView(
						{
							lat: 45,
							lng: 2,
							altitude: 1.25
						},
						1800
					);
				})

				.to({}, { duration: 1.8 })

				.to(distanceRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.85,
					ease: 'back.out(1.7)'
				})

				.to(distanceRef.current, {
					scale: 1.06,
					duration: 0.65,
					yoyo: true,
					repeat: 1,
					ease: 'sine.inOut'
				})

				.to({}, { duration: 1.6 })

				.to(finalTextRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1,
					ease: 'power3.out'
				})

				.to(finalTextRef.current, {
					scale: 1.025,
					duration: 1.8,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				});
		}, rootRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div ref={globeWrapRef} style={styles.globeWrap}>
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
					pointAltitude={0.045}
					pointRadius={0.28}
					pointResolution={24}
					labelsData={points}
					labelLat="lat"
					labelLng="lng"
					labelText="name"
					labelColor={() => '#ffffff'}
					labelSize={0.95}
					labelDotRadius={0.35}
					labelAltitude={0.055}
					arcsData={arcs}
					arcStartLat="startLat"
					arcStartLng="startLng"
					arcEndLat="endLat"
					arcEndLng="endLng"
					arcColor="color"
					arcAltitude={0.22}
					arcStroke={0.9}
					arcDashLength={0.45}
					arcDashGap={0.08}
					arcDashAnimateTime={2600}
				/>
			</div>

			<div ref={introTextRef} style={styles.introText}>
				Nem sempre estivemos
				<br />
				no mesmo sítio
			</div>

			<div ref={distanceRef} style={styles.distanceBadge}>
				Porto ↔ Stuttgart
				<span style={styles.distanceNumber}>~{DISTANCE_KM.toLocaleString('pt-PT')} km</span>
			</div>

			<div ref={finalTextRef} style={styles.finalText}>
				mas sempre estivemos
				<br />
				do mesmo lado
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

	introText: {
		position: 'absolute',
		inset: 0,
		zIndex: 5,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 28,
		textAlign: 'center',
		fontSize: 'clamp(2.2rem, 8vw, 5.2rem)',
		lineHeight: 1,
		fontWeight: 900,
		textShadow: '0 18px 44px rgba(0,0,0,0.4)'
	},

	distanceBadge: {
		position: 'absolute',
		top: '18%',
		left: '50%',
		zIndex: 6,
		transform: 'translateX(-50%)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: 6,
		padding: '16px 22px',
		borderRadius: 28,
		background: 'rgba(255, 255, 255, 0.14)',
		border: '1px solid rgba(255,255,255,0.18)',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 18px 48px rgba(0,0,0,0.28)',
		fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
		fontWeight: 800,
		whiteSpace: 'nowrap'
	},

	distanceNumber: {
		fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
		color: '#ffd1e6',
		fontWeight: 950,
		lineHeight: 1
	},

	finalText: {
		position: 'absolute',
		left: '50%',
		bottom: '11%',
		zIndex: 7,
		transform: 'translateX(-50%)',
		width: 'min(88vw, 760px)',
		textAlign: 'center',
		fontSize: 'clamp(2rem, 7vw, 4.8rem)',
		lineHeight: 1.02,
		fontWeight: 950,
		color: '#ffe4f0',
		textShadow: '0 18px 44px rgba(0,0,0,0.42)'
	}
};
