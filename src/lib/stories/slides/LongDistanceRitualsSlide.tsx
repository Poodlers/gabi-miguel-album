import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type WatchedSeries = {
	id: string;
	name: string;
	image: string;
};

type LongDistanceRitualsSlideProps = {
	isPaused: boolean;
	songLabel: string;
	watchedSeries: WatchedSeries[];
};

export default function LongDistanceRitualsSlide({
	isPaused,
	songLabel,
	watchedSeries
}: LongDistanceRitualsSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const callRef = useRef<HTMLDivElement | null>(null);
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const seriesTitleRef = useRef<HTMLDivElement | null>(null);
	const seriesGridRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const seriesCards = seriesGridRef.current?.querySelectorAll('[data-series-card]') ?? [];

			gsap.set(
				[
					titleRef.current,
					callRef.current,
					messagesRef.current,
					seriesTitleRef.current,
					seriesGridRef.current
				],
				{ opacity: 0 }
			);

			gsap.set(titleRef.current, { y: 32, scale: 0.96 });
			gsap.set(callRef.current, { x: -40, y: 20, rotate: -4 });
			gsap.set(messagesRef.current, { x: 40, y: 20, rotate: 4 });
			gsap.set(seriesTitleRef.current, { y: 28 });
			gsap.set(seriesGridRef.current, { y: 20 });
			gsap.set(seriesCards, {
				opacity: 0,
				scale: 0.65,
				y: 42,
				rotate: -8
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.to(titleRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.9,
				ease: 'power3.out'
			})

				.to({}, { duration: 1.1 })

				.to(callRef.current, {
					opacity: 1,
					x: 0,
					y: 0,
					rotate: -2,
					duration: 0.9,
					ease: 'back.out(1.7)'
				})

				.to({}, { duration: 1.35 })

				.to(messagesRef.current, {
					opacity: 1,
					x: 0,
					y: 0,
					rotate: 2,
					duration: 0.9,
					ease: 'back.out(1.7)'
				})

				.to({}, { duration: 1.5 })

				.to([callRef.current, messagesRef.current], {
					opacity: 0,
					y: -24,
					scale: 0.96,
					duration: 0.7,
					stagger: 0.12,
					ease: 'power2.in'
				})

				.to(seriesTitleRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.85,
					ease: 'power2.out'
				})

				.to(
					seriesGridRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.45,
						ease: 'power2.out'
					},
					'-=0.2'
				)

				.to(seriesCards, {
					opacity: 1,
					scale: 1,
					y: 0,
					rotate: (index) => [-4, 3, -2, 5, -5, 2, 4, -3][index % 8],
					duration: 0.75,
					stagger: 0.18,
					ease: 'back.out(1.8)'
				})

				.to(seriesCards, {
					y: (index) => (index % 2 === 0 ? -5 : 5),
					duration: 2.2,
					repeat: -1,
					yoyo: true,
					stagger: 0.08,
					ease: 'sine.inOut'
				});
		}, rootRef);

		return () => ctx.revert();
	}, [watchedSeries]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.backgroundGlowOne} />
			<div style={styles.backgroundGlowTwo} />

			<div style={styles.content}>
				<div ref={titleRef} style={styles.title}>
					Como fizemos a distância parecer um bocadinho menor
				</div>

				<div style={styles.ritualsLayer}>
					<div ref={callRef} style={{ ...styles.ritualCard, ...styles.callCard }}>
						<div style={styles.ritualEmoji}>🌙</div>
						<div style={styles.ritualTitle}>Chamadas antes de dormir</div>
						<div style={styles.ritualText}>
							mesmo longe, havia sempre um “boa noite amor” para acabar o dia.
						</div>
					</div>

					<div ref={messagesRef} style={{ ...styles.ritualCard, ...styles.messageCard }}>
						<div style={styles.ritualEmoji}>💌</div>
						<div style={styles.ritualTitle}>Mensagens carinhosas</div>
						<div style={styles.ritualText}>
							pequenas frases, fotos aleatórias, e aquele “chegaste bem?” de sempre.
						</div>
					</div>
				</div>

				<div ref={seriesTitleRef} style={styles.seriesTitle}>
					E claro… as séries que vimos juntos, mesmo à distância
				</div>

				<div ref={seriesGridRef} style={styles.seriesGrid}>
					{watchedSeries.map((series, index) => (
						<div
							key={series.id}
							data-series-card
							style={{
								...styles.seriesCard,
								marginTop: index % 3 === 1 ? 18 : 0,
								transform: `rotate(${[-4, 3, -2, 5, -5, 2][index % 6]}deg)`
							}}
						>
							<img src={series.image} alt={series.name} style={styles.seriesImage} />
							<div style={styles.seriesName}>{series.name}</div>
						</div>
					))}
				</div>
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
		background: '#321f46',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	backgroundGlowOne: {
		position: 'absolute',
		width: 320,
		height: 320,
		left: -90,
		top: '18%',
		borderRadius: '50%',
		background: 'rgba(255, 126, 182, 0.18)',
		filter: 'blur(26px)'
	},

	backgroundGlowTwo: {
		position: 'absolute',
		width: 380,
		height: 380,
		right: -120,
		bottom: '10%',
		borderRadius: '50%',
		background: 'rgba(167, 139, 250, 0.20)',
		filter: 'blur(30px)'
	},

	content: {
		position: 'relative',
		zIndex: 2,
		width: '100%',
		height: '100%',
		padding: '64px 20px 30px',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},

	title: {
		textAlign: 'center',
		fontSize: 'clamp(1.9rem, 6vw, 4.3rem)',
		lineHeight: 1.05,
		fontWeight: 950,
		maxWidth: 900,
		textShadow: '0 18px 44px rgba(0,0,0,0.28)'
	},

	ritualsLayer: {
		position: 'relative',
		width: 'min(92vw, 820px)',
		height: 500,
		marginTop: 38
	},

	ritualCard: {
		position: 'absolute',
		width: 'min(76vw, 360px)',
		padding: 22,
		borderRadius: 28,
		background: 'rgba(255,255,255,0.13)',
		border: '1px solid rgba(255,255,255,0.16)',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 20px 48px rgba(0,0,0,0.22)',
		textAlign: 'left'
	},

	callCard: {
		left: 0,
		top: 0
	},

	messageCard: {
		right: 0,
		top: 200
	},

	ritualEmoji: {
		fontSize: 34,
		marginBottom: 10
	},

	ritualTitle: {
		fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
		fontWeight: 900,
		marginBottom: 8
	},

	ritualText: {
		fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
		lineHeight: 1.45,
		color: 'rgba(255,255,255,0.84)'
	},

	seriesTitle: {
		marginTop: -16,
		marginBottom: 18,
		textAlign: 'center',
		maxWidth: 760,
		fontSize: 'clamp(1.2rem, 3vw, 2rem)',
		lineHeight: 1.15,
		fontWeight: 850,
		color: '#ffe1ef'
	},

	seriesGrid: {
		width: 'min(94vw, 860px)',
		display: 'grid',
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
		gap: 14,
		alignItems: 'start'
	},

	seriesCard: {
		borderRadius: 22,
		overflow: 'hidden',
		background: 'rgba(255,255,255,0.13)',
		border: '1px solid rgba(255,255,255,0.15)',
		boxShadow: '0 18px 38px rgba(0,0,0,0.22)'
	},

	seriesImage: {
		width: '100%',
		aspectRatio: '3 / 4',
		objectFit: 'cover',
		display: 'block'
	},

	seriesName: {
		padding: '10px 8px 12px',
		textAlign: 'center',
		fontSize: 'clamp(0.78rem, 1.8vw, 0.98rem)',
		fontWeight: 850,
		color: '#fff'
	}
};
