import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type GrowingTogetherSlideProps = {
	isPaused: boolean;
	songLabel: string;
};

export default function GrowingTogetherSlide({ isPaused, songLabel }: GrowingTogetherSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const line1Ref = useRef<HTMLDivElement | null>(null);
	const line2Ref = useRef<HTMLDivElement | null>(null);
	const line3Ref = useRef<HTMLDivElement | null>(null);
	const line4Ref = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const heartRef = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current], {
				opacity: 0
			});

			gsap.set(line1Ref.current, { y: 22, scale: 0.98 });
			gsap.set(line2Ref.current, { y: 22, scale: 0.98 });
			gsap.set(line3Ref.current, { y: 18, scale: 0.98 });
			gsap.set(line4Ref.current, { y: 18, scale: 0.98 });
			gsap.set(heartRef.current, {
				scale: 1,
				transformOrigin: 'center center'
			});

			gsap.to(heartRef.current, {
				keyframes: [
					{ scale: 1.35, duration: 0.18 },
					{ scale: 1, duration: 0.18 },
					{ scale: 1.25, duration: 0.14 },
					{ scale: 1, duration: 0.2 }
				],
				repeat: -1,
				repeatDelay: 0.6,
				ease: 'power1.inOut'
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.to(line1Ref.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.9,
				ease: 'power2.out'
			})

				.to(
					line2Ref.current,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.9,
						ease: 'power2.out'
					},
					'+=0.6'
				)

				.to({}, { duration: 1 })

				.to(line3Ref.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1,
					ease: 'power3.out'
				})

				.to(
					line4Ref.current,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 1,
						ease: 'power3.out'
					},
					'-=0.8'
				)

				.to([line3Ref.current, line4Ref.current], {
					scale: 1.02,
					duration: 2,
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

			<div style={styles.bgGlow} />

			<div style={styles.content}>
				<div ref={line1Ref} style={styles.lineSoft}>
					Ao longo destes dois anos…
				</div>

				<div ref={line2Ref} style={styles.lineSoft}>
					Fomos mudando em conjunto
				</div>

				<div ref={line3Ref} style={styles.lineMain}>
					Gosto muito dessa versão de mim
				</div>

				<div ref={line4Ref} style={styles.lineAccent}>
					que existe contigo
					<br />
					<span ref={heartRef} style={styles.heart}>
						❤️
					</span>
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
		background: '#1c1326',
		color: '#fff',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	bgGlow: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		width: '120vw',
		height: '120vh',
		background: 'radial-gradient(circle at center, rgba(255, 126, 182, 0.14), transparent 40%)',
		filter: 'blur(28px)',
		opacity: 0.9
	},

	content: {
		position: 'absolute',
		inset: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		padding: 28
	},

	lineSoft: {
		fontSize: 'clamp(1.4rem, 4.5vw, 2.4rem)',
		lineHeight: 1.2,
		fontWeight: 700,
		color: 'rgba(255,255,255,0.78)',
		marginBottom: 10
	},

	lineMain: {
		marginTop: 18,
		fontSize: 'clamp(1.8rem, 6vw, 3.6rem)',
		lineHeight: 1.1,
		fontWeight: 900,
		color: '#ffe3f0',
		textShadow: '0 16px 40px rgba(0,0,0,0.35)'
	},

	lineAccent: {
		marginTop: 10,
		fontSize: 'clamp(1.8rem, 6.5vw, 3.6rem)',
		lineHeight: 1.1,
		fontWeight: 900,
		color: '#ffd1e6',
		textShadow: '0 16px 40px rgba(0,0,0,0.35)'
	},
	heart: {
		display: 'inline-block',
		marginTop: 6,
		fontSize: 'clamp(2.4rem, 9vw, 5rem)',
		lineHeight: 1
	}
};
