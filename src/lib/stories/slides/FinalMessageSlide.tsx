import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type FinalMessageSlideProps = {
	isPaused: boolean;
	songLabel: string;
};

export default function FinalMessageSlide({ isPaused, songLabel }: FinalMessageSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const openerRef = useRef<HTMLDivElement | null>(null);
	const linesRef = useRef<HTMLDivElement | null>(null);
	const personalRef = useRef<HTMLDivElement | null>(null);
	const loveRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const messageLines = linesRef.current?.querySelectorAll('[data-message-line]') ?? [];

			gsap.set([openerRef.current, personalRef.current, loveRef.current], {
				opacity: 0
			});

			gsap.set(messageLines, {
				opacity: 0,
				y: 22
			});

			gsap.set(openerRef.current, {
				y: 18,
				scale: 0.98
			});

			gsap.set(personalRef.current, {
				y: 24,
				scale: 0.96
			});

			gsap.set(loveRef.current, {
				y: 24,
				scale: 0.96
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.to(openerRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power2.out'
			})

				.to({}, { duration: 1.1 })

				.to(openerRef.current, {
					opacity: 0,
					y: -16,
					duration: 0.75,
					ease: 'power2.in'
				})

				.to(messageLines, {
					opacity: 1,
					y: 0,
					duration: 0.95,
					stagger: 1.15,
					ease: 'power2.out'
				})

				.to({}, { duration: 0.8 })

				.to(personalRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1.05,
					ease: 'power3.out'
				})

				.to({}, { duration: 0.9 })

				.to(loveRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1.1,
					ease: 'power3.out'
				})

				.to([personalRef.current, loveRef.current], {
					scale: 1.02,
					duration: 2.2,
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

			<div style={styles.glowOne} />
			<div style={styles.glowTwo} />

			<div style={styles.content}>
				<div ref={openerRef} style={styles.opener}>
					Antes de acabar…
				</div>

				<div ref={linesRef} style={styles.message}>
					<div data-message-line>Obrigado por estes dois anos</div>
					<div data-message-line>Por todas as chamadas antes de dormir</div>
					<div data-message-line>Por todos os reencontros que valeram por mil abraços</div>
					<div data-message-line>E por fazeres com que tudo valha mais a pena</div>
				</div>

				<div ref={personalRef} style={styles.personal}>
					E por seres tu…
					<br />
					Sempre tu 🤍
				</div>

				<div ref={loveRef} style={styles.love}>
					Amo-te muito
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
		background: '#1b1224',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	glowOne: {
		position: 'absolute',
		width: 420,
		height: 420,
		top: -150,
		right: -130,
		borderRadius: '50%',
		background: 'rgba(255, 126, 182, 0.18)',
		filter: 'blur(38px)'
	},

	glowTwo: {
		position: 'absolute',
		width: 460,
		height: 460,
		bottom: -180,
		left: -160,
		borderRadius: '50%',
		background: 'rgba(255, 210, 232, 0.12)',
		filter: 'blur(42px)'
	},

	content: {
		position: 'absolute',
		inset: 0,
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 28,
		textAlign: 'center'
	},

	opener: {
		position: 'absolute',
		fontSize: 'clamp(1.5rem, 4.5vw, 2.7rem)',
		lineHeight: 1.2,
		fontWeight: 800,
		color: 'rgba(255,255,255,0.76)'
	},

	message: {
		width: 'min(90vw, 820px)',
		display: 'flex',
		flexDirection: 'column',
		gap: 16,
		fontSize: 'clamp(1.2rem, 3.6vw, 2.1rem)',
		lineHeight: 1.25,
		fontWeight: 750,
		color: 'rgba(255,255,255,0.88)'
	},

	personal: {
		marginTop: 34,
		fontSize: 'clamp(1.9rem, 6vw, 4rem)',
		lineHeight: 1.08,
		fontWeight: 950,
		color: '#ffd1e6',
		textShadow: '0 18px 46px rgba(0,0,0,0.36)'
	},

	love: {
		marginTop: 24,
		fontSize: 'clamp(1.5rem, 4.8vw, 3rem)',
		lineHeight: 1.1,
		fontWeight: 900,
		color: '#fff',
		textShadow: '0 18px 46px rgba(0,0,0,0.36)'
	}
};
