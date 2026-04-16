import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type IntroSlideProps = {
	isPaused: boolean;
	songLabel?: string;
};

export default function IntroSlide({ isPaused, songLabel }: IntroSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLHeadingElement | null>(null);
	const subtitleRef = useRef<HTMLParagraphElement | null>(null);
	const footerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([titleRef.current, subtitleRef.current, footerRef.current], {
				opacity: 0
			});

			gsap.set(titleRef.current, { y: 80, scale: 0.96 });
			gsap.set(subtitleRef.current, { y: 40 });
			gsap.set(footerRef.current, { y: 20 });

			const tl = gsap.timeline();

			tl.to(titleRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power3.out'
			})
				.to(
					subtitleRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power2.out'
					},
					'-=0.45'
				)
				.to(
					footerRef.current,
					{
						opacity: 0.85,
						y: 0,
						duration: 0.8,
						ease: 'power2.out'
					},
					'-=0.35'
				)
				.to(titleRef.current, {
					scale: 1.03,
					duration: 1.8,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});

			if (isPaused) tl.pause();
		}, rootRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		const tweens = gsap.globalTimeline.getChildren(false, true, false);
		tweens.forEach((tween) => {
			if (isPaused) tween.pause();
			else tween.resume();
		});
	}, [isPaused]);

	return (
		<div ref={rootRef} style={styles.slide}>
			<div style={styles.overlay} />
			<SongBadge label={songLabel} />

			<div style={styles.centerWrap}>
				<h1 ref={titleRef} style={styles.title}>
					2 anos de nós
				</h1>
				<p ref={subtitleRef} style={styles.subtitle}>
					parece que foi ontem, mas já vivemos um mundo inteiro
				</p>
			</div>

			<div ref={footerRef} style={styles.footer}>
				03.05.2024 → 03.05.2026
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
		background:
			'radial-gradient(circle at top, rgba(255,182,193,0.18), transparent 35%), linear-gradient(180deg, #120b14 0%, #050507 100%)',
		color: '#fff',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},
	overlay: {
		position: 'absolute',
		inset: 0,
		background: 'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.35) 100%)',
		pointerEvents: 'none'
	},
	centerWrap: {
		position: 'absolute',
		inset: 0,
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		padding: '0 24px'
	},
	title: {
		margin: 0,
		fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
		lineHeight: 1,
		fontWeight: 700
	},
	subtitle: {
		marginTop: 18,
		marginBottom: 0,
		maxWidth: 700,
		fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
		lineHeight: 1.4,
		color: 'rgba(255,255,255,0.82)'
	},
	footer: {
		position: 'absolute',
		bottom: 28,
		left: 0,
		right: 0,
		zIndex: 2,
		textAlign: 'center',
		fontSize: 14,
		letterSpacing: '0.14em',
		opacity: 0.8
	}
};
