import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

export type SmallThing = {
	id: string;
	text: string;
	emoji: string;
};

type SmallThingsSlideProps = {
	isPaused: boolean;
	songLabel: string;
	things: SmallThing[];
};

export default function SmallThingsSlide({ isPaused, songLabel, things }: SmallThingsSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const centerRef = useRef<HTMLDivElement | null>(null);
	const bubblesRef = useRef<HTMLDivElement | null>(null);
	const finalRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const bubbles = bubblesRef.current?.querySelectorAll('[data-small-thing]') ?? [];

			gsap.set([titleRef.current, centerRef.current, finalRef.current], {
				opacity: 0
			});

			gsap.set(titleRef.current, { y: 30, scale: 0.96 });
			gsap.set(centerRef.current, { scale: 0.82, y: 20 });
			gsap.set(finalRef.current, { y: 24 });

			gsap.set(bubbles, {
				opacity: 0,
				scale: 0,
				x: 0,
				y: 0,
				rotate: -8
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.to(titleRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.95,
				ease: 'power3.out'
			})

				.to({}, { duration: 1.1 })

				.to(centerRef.current, {
					opacity: 1,
					scale: 1,
					y: 0,
					duration: 0.85,
					ease: 'back.out(1.7)'
				})

				.to(
					bubbles,
					{
						opacity: 1,
						scale: 1,
						rotate: (index) => [-5, 4, -3, 5, -4, 3, -2, 4, -5, 2, -3][index % 11],
						duration: 0.7,
						stagger: 0.35,
						ease: 'back.out(1.8)'
					},
					'+=0.25'
				)

				.to(
					finalRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.85,
						ease: 'power2.out'
					},
					'+=0.65'
				)

				.to(bubbles, {
					y: (index) => (index % 2 === 0 ? -7 : 7),
					x: (index) => (index % 3 === 0 ? 5 : -5),
					duration: 2.4,
					repeat: -1,
					yoyo: true,
					stagger: 0.08,
					ease: 'sine.inOut'
				});

			gsap.to(centerRef.current, {
				scale: 1.025,
				duration: 2.2,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});
		}, rootRef);

		return () => ctx.revert();
	}, [things]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.glowOne} />
			<div style={styles.glowTwo} />

			<div ref={titleRef} style={styles.title}>
				As pequenas coisas
				<br />
				que fazem de ti tu
			</div>

			<div ref={centerRef} style={styles.centerHeart}>
				<div style={styles.centerEmoji}>💗</div>
				<div style={styles.centerText}>Gabi-core</div>
			</div>

			<div ref={bubblesRef} style={styles.bubbles}>
				{things.map((thing, index) => (
					<div
						key={thing.id}
						data-small-thing
						style={{
							...styles.bubble,
							...bubblePositions[index % bubblePositions.length]
						}}
					>
						<span style={styles.bubbleEmoji}>{thing.emoji}</span>
						<span>{thing.text}</span>
					</div>
				))}
			</div>

			<div ref={finalRef} style={styles.finalText}>
				são estas coisinhas que eu guardo sem precisares de saber
			</div>
		</div>
	);
}

const bubblePositions: React.CSSProperties[] = [
	{ top: '25%', left: '7%' },
	{ top: '20%', right: '8%' },
	{ top: '38%', left: '4%' },
	{ top: '39%', right: '5%' },
	{ top: '56%', left: '7%' },
	{ top: '57%', right: '7%' },
	{ top: '71%', left: '15%' },
	{ top: '72%', right: '14%' },
	{ top: '16%', left: '35%' },
	{ top: '78%', left: '39%' },
	{ top: '48%', left: '50%', transform: 'translateX(-50%)' }
];

const styles: Record<string, React.CSSProperties> = {
	slide: {
		position: 'relative',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		color: '#fff',
		background: '#42213f',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	glowOne: {
		position: 'absolute',
		width: 360,
		height: 360,
		top: -130,
		right: -120,
		borderRadius: '50%',
		background: 'rgba(255, 170, 210, 0.24)',
		filter: 'blur(34px)'
	},

	glowTwo: {
		position: 'absolute',
		width: 420,
		height: 420,
		left: -160,
		bottom: -160,
		borderRadius: '50%',
		background: 'rgba(255, 214, 145, 0.14)',
		filter: 'blur(34px)'
	},

	title: {
		position: 'absolute',
		top: 86,
		left: '50%',
		transform: 'translateX(-50%)',
		zIndex: 5,
		width: 'min(90vw, 820px)',
		textAlign: 'center',
		fontSize: 'clamp(1.9rem, 6vw, 4.2rem)',
		lineHeight: 1.04,
		fontWeight: 950,
		color: '#ffe4f1',
		textShadow: '0 18px 44px rgba(0,0,0,0.30)'
	},

	centerHeart: {
		position: 'absolute',
		left: '50%',
		top: '48%',
		transform: 'translate(-50%, -50%)',
		zIndex: 4,
		width: 170,
		height: 170,
		borderRadius: '50%',
		background: 'rgba(255,255,255,0.14)',
		border: '1px solid rgba(255,255,255,0.18)',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 24px 64px rgba(0,0,0,0.26)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},

	centerEmoji: {
		fontSize: 42,
		marginBottom: 8
	},

	centerText: {
		fontSize: 20,
		fontWeight: 950,
		color: '#fff'
	},

	bubbles: {
		position: 'absolute',
		inset: 0,
		zIndex: 6,
		pointerEvents: 'none'
	},

	bubble: {
		position: 'absolute',
		maxWidth: 'min(42vw, 250px)',
		padding: '12px 14px',
		borderRadius: 22,
		background: 'rgba(255, 230, 242, 0.94)',
		color: '#6f234b',
		boxShadow: '0 16px 36px rgba(0,0,0,0.20)',
		fontSize: 'clamp(0.78rem, 2vw, 0.98rem)',
		lineHeight: 1.22,
		fontWeight: 800,
		display: 'flex',
		gap: 8,
		alignItems: 'center'
	},

	bubbleEmoji: {
		fontSize: 18,
		flexShrink: 0
	},

	finalText: {
		position: 'absolute',
		left: '50%',
		bottom: 34,
		transform: 'translateX(-50%)',
		zIndex: 7,
		width: 'min(88vw, 720px)',
		textAlign: 'center',
		fontSize: 'clamp(1rem, 2.6vw, 1.35rem)',
		lineHeight: 1.35,
		fontWeight: 750,
		color: '#ffeaf5'
	}
};
