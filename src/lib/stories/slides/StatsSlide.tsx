import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type RelationshipStat = {
	id: string;
	value: string;
	label: string;
	subtext: string;
	emoji: string;
	color: string;
};

type StatsSlideProps = {
	isPaused: boolean;
	songLabel: string;
	stats?: RelationshipStat[];
};

const DEFAULT_STATS: RelationshipStat[] = [
	{
		id: 'kisses',
		value: '200+',
		label: 'beijos roubados',
		subtext: 'e ainda assim nunca chegam',
		emoji: '💋',
		color: '#ff7aa8'
	},
	{
		id: 'hugs',
		value: '350+',
		label: 'abraços reconfortantes',
		subtext: 'daqueles que arranjam o dia',
		emoji: '🫂',
		color: '#ff9f7a'
	},
	{
		id: 'calls',
		value: '900h',
		label: 'em chamadas',
		subtext: 'a transformar distância em rotina',
		emoji: '🌙',
		color: '#8f8cff'
	},
	{
		id: 'messages',
		value: '∞',
		label: 'mensagens carinhosas',
		subtext: 'incluindo muitos “chegaste bem?”',
		emoji: '💌',
		color: '#f6c85f'
	},
	{
		id: 'flights',
		value: '??',
		label: 'voos só para nos vermos',
		subtext: 'cada um valeu por mil saudades',
		emoji: '✈️',
		color: '#73d2de'
	},
	{
		id: 'goodnights',
		value: '700+',
		label: '“boa noite amor”',
		subtext: 'ditos por ecrã, mas sentidos de perto',
		emoji: '⭐',
		color: '#c084fc'
	}
];

export default function StatsSlide({
	isPaused,
	songLabel,
	stats = DEFAULT_STATS
}: StatsSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const gridRef = useRef<HTMLDivElement | null>(null);
	const footerRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const cards = gridRef.current?.querySelectorAll('[data-stat-card]') ?? [];

			gsap.set([titleRef.current, footerRef.current], {
				opacity: 0
			});

			gsap.set(titleRef.current, {
				y: 30,
				scale: 0.96
			});

			gsap.set(footerRef.current, {
				y: 24
			});

			gsap.set(cards, {
				opacity: 0,
				x: (index) => (index % 2 === 0 ? -90 : 90),
				y: 24,
				rotate: (index) => (index % 2 === 0 ? -5 : 5),
				scale: 0.92
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

				.to({}, { duration: 0.6 })

				.to(cards, {
					opacity: 1,
					x: 0,
					y: 0,
					rotate: 0,
					scale: 1,
					duration: 0.75,
					stagger: 0.22,
					ease: 'back.out(1.6)'
				})

				.to(
					footerRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power2.out'
					},
					'+=0.45'
				)

				.to(cards, {
					y: (index) => (index % 2 === 0 ? -5 : 5),
					rotate: (index) => (index % 2 === 0 ? -1.5 : 1.5),
					duration: 2.2,
					repeat: -1,
					yoyo: true,
					stagger: 0.08,
					ease: 'sine.inOut'
				});
		}, rootRef);

		return () => ctx.revert();
	}, [stats]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.bgBlobOne} />
			<div style={styles.bgBlobTwo} />

			<div style={styles.content}>
				<div ref={titleRef} style={styles.title}>
					O nosso pequeno universo
					<br />
					<span style={styles.titleAccent}>em números</span>
				</div>

				<div ref={gridRef} style={styles.grid}>
					{stats.map((stat) => (
						<div
							key={stat.id}
							data-stat-card
							style={{
								...styles.card,
								background: stat.color
							}}
						>
							<div style={styles.emoji}>{stat.emoji}</div>
							<div style={styles.value}>{stat.value}</div>
							<div style={styles.label}>{stat.label}</div>
							<div style={styles.subtext}>{stat.subtext}</div>
						</div>
					))}
				</div>

				<div ref={footerRef} style={styles.footer}>
					números cientificamente inventados, emocionalmente corretos
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
		background: '#241336',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	bgBlobOne: {
		position: 'absolute',
		width: 360,
		height: 360,
		top: -120,
		left: -120,
		borderRadius: '50%',
		background: 'rgba(255, 122, 168, 0.22)',
		filter: 'blur(28px)'
	},

	bgBlobTwo: {
		position: 'absolute',
		width: 420,
		height: 420,
		right: -160,
		bottom: -160,
		borderRadius: '50%',
		background: 'rgba(115, 210, 222, 0.18)',
		filter: 'blur(30px)'
	},

	content: {
		position: 'relative',
		zIndex: 2,
		height: '100%',
		boxSizing: 'border-box',
		padding: '84px 18px 28px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},

	title: {
		textAlign: 'center',
		fontSize: 'clamp(1.9rem, 6vw, 4.4rem)',
		lineHeight: 1.02,
		fontWeight: 950,
		marginBottom: 28,
		textShadow: '0 18px 44px rgba(0,0,0,0.28)'
	},

	titleAccent: {
		color: '#ffd0e2'
	},

	grid: {
		width: 'min(94vw, 900px)',
		display: 'grid',
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		gap: 14
	},

	card: {
		minHeight: 132,
		borderRadius: 26,
		padding: '16px 14px',
		boxSizing: 'border-box',
		color: '#fff',
		boxShadow: '0 18px 38px rgba(0,0,0,0.22)',
		border: '1px solid rgba(255,255,255,0.18)',
		position: 'relative',
		overflow: 'hidden'
	},

	emoji: {
		position: 'absolute',
		top: 12,
		right: 14,
		fontSize: 28,
		opacity: 0.92
	},

	value: {
		fontSize: 'clamp(2rem, 6vw, 3.7rem)',
		lineHeight: 1,
		fontWeight: 950,
		letterSpacing: '-0.04em',
		textShadow: '0 8px 20px rgba(0,0,0,0.16)'
	},

	label: {
		marginTop: 8,
		fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
		fontWeight: 850,
		lineHeight: 1.1
	},

	subtext: {
		marginTop: 6,
		fontSize: 'clamp(0.78rem, 2vw, 0.95rem)',
		lineHeight: 1.25,
		color: 'rgba(255,255,255,0.82)'
	},

	footer: {
		marginTop: 24,
		textAlign: 'center',
		fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
		color: '#ffe2ef',
		fontWeight: 700
	}
};
