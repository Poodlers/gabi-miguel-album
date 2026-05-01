import React, { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

export type ClosingDistancePerson = {
	name: string;
	image: string;
};

export type ClosingDistanceConfig = {
	from: {
		name: string;
		lat: number;
		lng: number;
	};
	to: {
		name: string;
		lat: number;
		lng: number;
	};
	you: ClosingDistancePerson;
	her: ClosingDistancePerson;
};

type ClosingDistanceSlideProps = {
	isPaused: boolean;
	songLabel: string;
	config: ClosingDistanceConfig;
};

export default function ClosingDistanceSlide({
	isPaused,
	songLabel,
	config
}: ClosingDistanceSlideProps) {
	const globeRef = useRef<any>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const introRef = useRef<HTMLDivElement | null>(null);
	const globeWrapRef = useRef<HTMLDivElement | null>(null);
	const reunionRef = useRef<HTMLDivElement | null>(null);
	const youPortraitRef = useRef<HTMLDivElement | null>(null);
	const herPortraitRef = useRef<HTMLDivElement | null>(null);
	const heartsRef = useRef<HTMLDivElement | null>(null);
	const finalTextRef = useRef<HTMLDivElement | null>(null);

	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const loopTweensRef = useRef<gsap.core.Tween[]>([]);

	const [viewport, setViewport] = useState({ width: 390, height: 844 });
	const [planeProgress, setPlaneProgress] = useState(0);
	const [showPlane, setShowPlane] = useState(false);
	const [showArc, setShowArc] = useState(true);

	useEffect(() => {
		const updateViewport = () => {
			setViewport({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);

		return () => window.removeEventListener('resize', updateViewport);
	}, []);

	const points = useMemo(
		() => [
			{
				id: 'from',
				name: config.from.name,
				lat: config.from.lat,
				lng: config.from.lng,
				color: '#ff9fc8'
			},
			{
				id: 'to',
				name: config.to.name,
				lat: config.to.lat,
				lng: config.to.lng,
				color: '#ffffff'
			}
		],
		[config]
	);

	const arcs = useMemo(
		() => [
			{
				startLat: config.from.lat,
				startLng: config.from.lng,
				endLat: config.to.lat,
				endLng: config.to.lng,
				color: ['#ff7eb6', '#ffe1ef']
			}
		],
		[config]
	);

	const planePosition = useMemo(
		() => getCurvedPosition(config.from, config.to, planeProgress),
		[config, planeProgress]
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
				lat: 28,
				lng: -12,
				altitude: 2.15
			},
			0
		);
	}, []);

	useEffect(() => {
		loopTweensRef.current.forEach((tween) => tween.kill());
		loopTweensRef.current = [];

		const flight = { value: 0 };

		const ctx = gsap.context(() => {
			gsap.set([introRef.current, globeWrapRef.current, reunionRef.current, finalTextRef.current], {
				opacity: 0
			});

			gsap.set(introRef.current, {
				y: 34,
				scale: 0.96
			});

			gsap.set(globeWrapRef.current, {
				scale: 0.95
			});

			gsap.set(reunionRef.current, {
				scale: 0.82,
				y: 28
			});

			gsap.set([youPortraitRef.current, herPortraitRef.current], {
				opacity: 0,
				scale: 0.58,
				y: 20
			});

			gsap.set(finalTextRef.current, {
				y: 62,
				scale: 0.96
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.call(() => {
				setShowArc(true);
				setShowPlane(false);
				setPlaneProgress(0);
			});

			tl.to(introRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power3.out'
			})

				.to({}, { duration: 2 })

				.to(introRef.current, {
					y: -viewport.height * 0.3,
					scale: 0.72,
					duration: 0.95,
					ease: 'power3.inOut'
				})

				.to(
					globeWrapRef.current,
					{
						opacity: 1,
						scale: 1,
						duration: 1.05,
						ease: 'power3.out'
					},
					'-=0.35'
				)

				.call(() => {
					globeRef.current?.pointOfView(
						{
							lat: 42,
							lng: -3,
							altitude: 1.55
						},
						1800
					);
				})

				.to({}, { duration: 1.2 })

				.call(() => {
					setShowPlane(true);
				})

				.to(flight, {
					value: 1,
					duration: 3.25,
					ease: 'power1.inOut',
					onUpdate: () => {
						setPlaneProgress(flight.value);
					}
				})

				.call(() => {
					setShowPlane(false);
					setShowArc(false);

					globeRef.current?.pointOfView(
						{
							lat: config.to.lat,
							lng: config.to.lng,
							altitude: 0.62
						},
						1900
					);
				})
				.to({}, { duration: 1.95 })

				.to(reunionRef.current, {
					opacity: 1,
					scale: 1,
					y: 0,
					duration: 0.9,
					ease: 'back.out(1.65)',
					onStart: () => {
						startHeartLoops();
					}
				})

				.to(
					[youPortraitRef.current, herPortraitRef.current],
					{
						opacity: 1,
						scale: 1,
						y: 0,
						duration: 0.75,
						stagger: 0.14,
						ease: 'back.out(1.8)'
					},
					'-=0.45'
				)

				.to(
					finalTextRef.current,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 1,
						ease: 'power3.out'
					},
					'+=0.25'
				)

				.to(finalTextRef.current, {
					scale: 1.02,
					duration: 2,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				});
		}, rootRef);

		function startHeartLoops() {
			const hearts = heartsRef.current?.querySelectorAll<HTMLElement>('[data-heart]') ?? [];

			hearts.forEach((heart, index) => {
				const side = heart.dataset.side === 'right' ? 1 : -1;
				const drift = side * (10 + (index % 3) * 5);

				gsap.set(heart, {
					opacity: 0,
					y: 0,
					x: 0,
					scale: 0.25,
					rotate: 0
				});

				const tween = gsap.to(heart, {
					keyframes: [
						{
							opacity: 1,
							scale: 0.9,
							y: -8,
							x: side * 4,
							rotate: side * -6,
							duration: 0.18,
							ease: 'power1.out'
						},
						{
							opacity: 1,
							scale: 1.15,
							y: -(viewport.height * 0.55 + (index % 4) * 24),
							x: drift,
							rotate: side * 8,
							duration: 2.2,
							ease: 'sine.out'
						},
						{
							opacity: 0,
							scale: 0.85,
							y: -(viewport.height * 0.72 + (index % 4) * 28),
							x: drift + side * 12,
							rotate: side * 18,
							duration: 0.7,
							ease: 'power1.in'
						}
					],
					repeat: -1,
					delay: index * 0.18,
					repeatDelay: 0.15 + (index % 4) * 0.08
				});
				loopTweensRef.current.push(tween);
			});

			const floatTween = gsap.to([youPortraitRef.current, herPortraitRef.current], {
				y: (index) => (index === 0 ? -5 : 5),
				duration: 1.9,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});

			loopTweensRef.current.push(floatTween);
		}

		return () => {
			timelineRef.current?.kill();
			loopTweensRef.current.forEach((tween) => tween.kill());
			loopTweensRef.current = [];
			ctx.revert();
		};
	}, [config, viewport.height]);

	useEffect(() => {
		const tl = timelineRef.current;

		if (tl) {
			if (isPaused) tl.pause();
			else tl.resume();
		}

		loopTweensRef.current.forEach((tween) => {
			if (isPaused) tween.pause();
			else tween.resume();
		});
	}, [isPaused]);

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.glowOne} />
			<div style={styles.glowTwo} />

			<div ref={globeWrapRef} style={styles.globeWrap}>
				<Globe
					ref={globeRef}
					width={viewport.width}
					height={viewport.height}
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
					labelSize={0.9}
					labelDotRadius={0.35}
					labelAltitude={0.06}
					arcsData={showArc ? arcs : []}
					arcStartLat="startLat"
					arcStartLng="startLng"
					arcEndLat="endLat"
					arcEndLng="endLng"
					arcColor="color"
					arcAltitude={0.22}
					arcStroke={0.85}
					arcDashLength={0.45}
					arcDashGap={0.08}
					arcDashAnimateTime={2600}
					htmlElementsData={
						showPlane
							? [
									{
										id: 'plane',
										lat: planePosition.lat,
										lng: planePosition.lng
									}
								]
							: []
					}
					htmlLat="lat"
					htmlLng="lng"
					htmlElement={() => {
						const el = document.createElement('div');
						el.style.pointerEvents = 'none';

						el.innerHTML = `
              <div style="
                position: relative;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
              ">
                <div style="
                  width: 46px;
                  height: 46px;
                  border-radius: 999px;
                  padding: 3px;
                  background: white;
                  box-shadow: 0 10px 24px rgba(0,0,0,0.28);
                  overflow: hidden;
                ">
                  <img
                    src="${config.you.image}"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 999px;
                      display: block;
                    "
                  />
                </div>

                <div style="
                  font-size: 28px;
                  transform: rotate(18deg);
                  filter: drop-shadow(0 8px 14px rgba(0,0,0,0.35));
                  line-height: 1;
                ">
                  ✈️
                </div>
              </div>
            `;

						return el;
					}}
				/>
			</div>

			<div ref={introRef} style={styles.introText}>
				2 anos depois...
				<br />
				vamos finalmente viver
				<br />
				no mesmo sítio
			</div>

			<div ref={reunionRef} style={styles.reunionLayer}>
				<div style={styles.placeBadge}>📍 {config.to.name}</div>

				<div style={styles.portraitsRow}>
					<div ref={youPortraitRef} style={styles.portrait}>
						<img src={config.you.image} alt={config.you.name} style={styles.portraitImg} />
					</div>

					<div ref={herPortraitRef} style={styles.portrait}>
						<img src={config.her.image} alt={config.her.name} style={styles.portraitImg} />
					</div>
				</div>

				<div ref={heartsRef} style={styles.heartsLayer}>
					{Array.from({ length: 7 }).map((_, index) => (
						<span
							key={`left-heart-${index}`}
							data-heart
							data-side="left"
							style={{
								...styles.heart,
								left: 44 + index * 3
							}}
						>
							❤️
						</span>
					))}

					{Array.from({ length: 7 }).map((_, index) => (
						<span
							key={`right-heart-${index}`}
							data-heart
							data-side="right"
							style={{
								...styles.heart,
								right: 44 + index * 3
							}}
						>
							💖
						</span>
					))}
				</div>
			</div>

			<div ref={finalTextRef} style={styles.finalText}>
				o melhor ainda está para vir
			</div>
		</div>
	);
}

function getCurvedPosition(
	from: { lat: number; lng: number },
	to: { lat: number; lng: number },
	progress: number
) {
	return {
		lat: from.lat + (to.lat - from.lat) * progress + Math.sin(Math.PI * progress) * 3.2,
		lng: from.lng + (to.lng - from.lng) * progress
	};
}

const styles: Record<string, React.CSSProperties> = {
	slide: {
		position: 'relative',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		color: '#fff',
		background: 'radial-gradient(circle at 50% 45%, #1a315e 0%, #10182e 48%, #050711 100%)',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	glowOne: {
		position: 'absolute',
		width: 360,
		height: 360,
		left: -120,
		top: -120,
		borderRadius: '50%',
		background: 'rgba(255, 126, 182, 0.18)',
		filter: 'blur(34px)'
	},

	glowTwo: {
		position: 'absolute',
		width: 420,
		height: 420,
		right: -150,
		bottom: -160,
		borderRadius: '50%',
		background: 'rgba(255, 210, 232, 0.14)',
		filter: 'blur(36px)'
	},

	globeWrap: {
		position: 'absolute',
		inset: 0,
		zIndex: 1
	},

	introText: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		zIndex: 8,
		transform: 'translate(-50%, -50%)',
		width: 'min(92vw, 880px)',
		padding: '22px 24px',
		borderRadius: 30,
		background: 'rgba(5, 7, 17, 0.56)',
		border: '1px solid rgba(255,255,255,0.16)',
		backdropFilter: 'blur(16px)',
		boxShadow: '0 22px 70px rgba(0,0,0,0.34)',
		textAlign: 'center',
		fontSize: 'clamp(2rem, 7vw, 5rem)',
		lineHeight: 1.02,
		fontWeight: 950,
		color: '#ffe4f1',
		textShadow: '0 20px 48px rgba(0,0,0,0.38)',
		pointerEvents: 'none',
		boxSizing: 'border-box'
	},

	reunionLayer: {
		position: 'absolute',
		left: '50%',
		top: '53%',
		transform: 'translate(-50%, -50%)',
		zIndex: 7,
		width: 'min(88vw, 360px)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		pointerEvents: 'none'
	},

	placeBadge: {
		marginBottom: 16,
		padding: '10px 16px',
		borderRadius: 999,
		background: 'rgba(255,255,255,0.14)',
		border: '1px solid rgba(255,255,255,0.18)',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 16px 40px rgba(0,0,0,0.24)',
		fontSize: 14,
		fontWeight: 900,
		letterSpacing: '0.04em'
	},

	portraitsRow: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 22
	},

	portrait: {
		width: 96,
		height: 96,
		borderRadius: 999,
		padding: 5,
		background: '#fff',
		boxShadow: '0 18px 42px rgba(0,0,0,0.34)',
		overflow: 'hidden'
	},

	portraitImg: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		borderRadius: 999,
		display: 'block'
	},

	heartsLayer: {
		position: 'absolute',
		left: 0,
		top: '-65vh',
		width: '100%',
		height: '80vh',
		pointerEvents: 'none',
		overflow: 'visible'
	},

	heart: {
		position: 'absolute',
		bottom: 20,
		fontSize: 22,
		opacity: 0,
		lineHeight: 1
	},

	finalText: {
		position: 'absolute',
		left: '50%',
		bottom: 42,
		transform: 'translateX(-50%)',
		zIndex: 9,
		width: 'min(90vw, 840px)',
		padding: '18px 22px',
		borderRadius: 28,
		background: 'rgba(5, 7, 17, 0.58)',
		border: '1px solid rgba(255,255,255,0.16)',
		backdropFilter: 'blur(16px)',
		boxShadow: '0 22px 70px rgba(0,0,0,0.34)',
		textAlign: 'center',
		fontSize: 'clamp(1.9rem, 6.5vw, 4.5rem)',
		lineHeight: 1.04,
		fontWeight: 950,
		color: '#ffd1e6',
		textShadow: '0 20px 48px rgba(0,0,0,0.42)',
		boxSizing: 'border-box'
	}
};
