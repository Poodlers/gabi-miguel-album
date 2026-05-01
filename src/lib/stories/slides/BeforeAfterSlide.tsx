import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

export type BeforeAfterItem = {
	id: string;
	before: string;
	after: string;
	beforeEmoji?: string;
	afterEmoji?: string;
};

type BeforeAfterSlideProps = {
	isPaused: boolean;
	songLabel: string;
	items: BeforeAfterItem[];
};

const ITEM_HOLD_DURATION = 1;

export default function BeforeAfterSlide({ isPaused, songLabel, items }: BeforeAfterSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const splitRef = useRef<HTMLDivElement | null>(null);
	const dividerRef = useRef<HTMLDivElement | null>(null);
	const beforePanelRef = useRef<HTMLDivElement | null>(null);
	const afterPanelRef = useRef<HTMLDivElement | null>(null);
	const finalRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	const [currentIndex, setCurrentIndex] = useState(0);
	const currentItem = items[currentIndex];

	useEffect(() => {
		if (!items.length) return;

		const ctx = gsap.context(() => {
			gsap.set(beforePanelRef.current, {
				opacity: 0,
				xPercent: -145,
				y: 20,
				rotate: -9,
				scale: 0.9
			});

			gsap.set(afterPanelRef.current, {
				opacity: 0,
				xPercent: 145,
				y: 20,
				rotate: 9,
				scale: 0.9
			});

			gsap.set([titleRef.current, splitRef.current, finalRef.current], {
				opacity: 0
			});

			gsap.set(titleRef.current, {
				y: 26,
				scale: 0.96
			});

			gsap.set(splitRef.current, {
				y: 30,
				scale: 0.98
			});

			gsap.set(dividerRef.current, {
				scaleY: 0
			});

			gsap.set(finalRef.current, {
				y: 24,
				scale: 0.98
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

				.to({}, { duration: 0.75 })
				.to(splitRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.4,
					ease: 'power2.out'
				})

				.to(
					dividerRef.current,
					{
						scaleY: 1,
						duration: 0.7,
						ease: 'power2.out'
					},
					'-=0.25'
				);

			items.forEach((item, index) => {
				tl.call(() => {
					setCurrentIndex(index);
				});

				tl.set(beforePanelRef.current, {
					opacity: 0,
					xPercent: -145,
					y: 20,
					rotate: -9,
					scale: 0.9
				});

				tl.set(afterPanelRef.current, {
					opacity: 0,
					xPercent: 145,
					y: 20,
					rotate: 9,
					scale: 0.9
				});

				tl.to(beforePanelRef.current, {
					opacity: 1,
					xPercent: 0,
					y: 0,
					rotate: -2,
					scale: 1,
					duration: 0.85,
					ease: 'back.out(1.6)'
				});

				tl.to(
					afterPanelRef.current,
					{
						opacity: 1,
						xPercent: 0,
						y: 0,
						rotate: 2,
						scale: 1,
						duration: 0.85,
						ease: 'back.out(1.6)'
					},
					'-=0.45'
				);

				tl.to(
					[beforePanelRef.current, afterPanelRef.current],
					{
						y: (i) => (i === 0 ? -5 : 5),
						duration: 1.4,
						yoyo: true,
						repeat: 1,
						ease: 'sine.inOut'
					},
					'+=0.2'
				);

				tl.to({}, { duration: ITEM_HOLD_DURATION });

				tl.to(beforePanelRef.current, {
					opacity: 0,
					xPercent: -145,
					y: 34,
					rotate: -10,
					scale: 0.9,
					duration: 0.65,
					ease: 'power3.in'
				});

				tl.to(
					afterPanelRef.current,
					{
						opacity: 0,
						xPercent: 145,
						y: 34,
						rotate: 10,
						scale: 0.9,
						duration: 0.65,
						ease: 'power3.in'
					},
					'-=0.5'
				);
			});

			tl.to(splitRef.current, {
				opacity: 0,
				y: -24,
				scale: 0.98,
				duration: 0.65,
				ease: 'power2.in'
			})

				.to(finalRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.95,
					ease: 'power3.out'
				})

				.to(finalRef.current, {
					scale: 1.025,
					duration: 2,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				});
		}, rootRef);

		return () => ctx.revert();
	}, [items]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	if (!currentItem) return null;

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.glowOne} />
			<div style={styles.glowTwo} />

			<div ref={titleRef} style={styles.title}>
				Antes de ti
				<br />
				<span style={styles.titleAccent}>e depois de ti</span>
			</div>

			<div ref={splitRef} style={styles.split}>
				<div ref={beforePanelRef} style={{ ...styles.panel, ...styles.beforePanel }}>
					{currentItem.beforeEmoji ? (
						<div style={styles.panelEmoji}>{currentItem.beforeEmoji}</div>
					) : null}

					<div style={styles.panelLabel}>antes</div>

					<div style={styles.panelText}>{currentItem.before}</div>
				</div>

				<div ref={dividerRef} style={styles.divider} />

				<div ref={afterPanelRef} style={{ ...styles.panel, ...styles.afterPanel }}>
					{currentItem.afterEmoji ? (
						<div style={styles.panelEmoji}>{currentItem.afterEmoji}</div>
					) : null}

					<div style={styles.panelLabel}>depois</div>

					<div style={styles.panelText}>{currentItem.after}</div>
				</div>
			</div>

			<div ref={finalRef} style={styles.finalText}>
				não mudou tudo…
				<br />
				mas mudou o suficiente para já não querer voltar atrás
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
		background: '#2c1d3d',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	glowOne: {
		position: 'absolute',
		width: 360,
		height: 360,
		top: -130,
		left: -120,
		borderRadius: '50%',
		background: 'rgba(255, 126, 182, 0.20)',
		filter: 'blur(34px)'
	},

	glowTwo: {
		position: 'absolute',
		width: 420,
		height: 420,
		right: -170,
		bottom: -170,
		borderRadius: '50%',
		background: 'rgba(154, 230, 255, 0.13)',
		filter: 'blur(36px)'
	},

	title: {
		position: 'absolute',
		top: 82,
		left: '50%',
		transform: 'translateX(-50%)',
		zIndex: 5,
		width: 'min(92vw, 800px)',
		textAlign: 'center',
		fontSize: 'clamp(2rem, 6.5vw, 4.6rem)',
		lineHeight: 1.02,
		fontWeight: 950,
		textShadow: '0 18px 44px rgba(0,0,0,0.32)'
	},

	titleAccent: {
		color: '#ffd3e7'
	},

	split: {
		position: 'absolute',
		left: '50%',
		top: '54%',
		transform: 'translate(-50%, -50%)',
		zIndex: 4,
		width: 'min(92vw, 860px)',
		minHeight: 300,
		display: 'grid',
		gridTemplateColumns: '1fr 2px 1fr',
		gap: 18,
		alignItems: 'stretch'
	},

	panel: {
		borderRadius: 30,
		padding: '24px 20px',
		boxSizing: 'border-box',
		minHeight: 250,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		border: '1px solid rgba(255,255,255,0.14)',
		boxShadow: '0 24px 60px rgba(0,0,0,0.26)',
		backdropFilter: 'blur(14px)',
		willChange: 'transform, opacity'
	},

	beforePanel: {
		background: 'rgba(255,255,255,0.09)'
	},

	afterPanel: {
		background: 'rgba(255, 126, 182, 0.18)'
	},

	divider: {
		width: 2,
		borderRadius: 999,
		background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.65), transparent)',
		transformOrigin: 'center center'
	},

	panelEmoji: {
		fontSize: 'clamp(2rem, 6vw, 3.5rem)',
		marginBottom: 12,
		filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.18))'
	},

	panelLabel: {
		marginBottom: 14,
		fontSize: 12,
		fontWeight: 900,
		letterSpacing: '0.16em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.68)'
	},

	panelText: {
		fontSize: 'clamp(1.05rem, 3.3vw, 2.05rem)',
		lineHeight: 1.12,
		fontWeight: 900,
		color: '#fff'
	},

	finalText: {
		position: 'absolute',
		inset: 0,
		zIndex: 8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 28,
		textAlign: 'center',
		fontSize: 'clamp(1.9rem, 6vw, 4.3rem)',
		lineHeight: 1.05,
		fontWeight: 950,
		color: '#ffe4f1',
		textShadow: '0 20px 48px rgba(0,0,0,0.36)'
	}
};
