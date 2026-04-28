import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

export type CoreMemory = {
	id: string;
	title: string;
	image: string;
	text?: string;
};

type CoreMemoriesSlideProps = {
	isPaused: boolean;
	songLabel: string;
	memories: CoreMemory[];
};

const INTRO_DURATION = 3;
const MEMORY_HOLD_DURATION = 3.2;

export default function CoreMemoriesSlide({
	isPaused,
	songLabel,
	memories
}: CoreMemoriesSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const introRef = useRef<HTMLDivElement | null>(null);
	const chapterRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const textRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	const [currentIndex, setCurrentIndex] = useState(0);
	const currentMemory = memories[currentIndex];

	useEffect(() => {
		if (!currentMemory) return;

		const ctx = gsap.context(() => {
			gsap.set(introRef.current, {
				opacity: 0,
				scale: 0.88,
				y: 28
			});

			gsap.set(chapterRef.current, {
				opacity: 0,
				xPercent: 120,
				yPercent: 0
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl.to(introRef.current, {
				opacity: 1,
				scale: 1,
				y: 0,
				duration: 0.9,
				ease: 'back.out(1.7)'
			})

				.to({}, { duration: INTRO_DURATION })

				.to(introRef.current, {
					opacity: 0,
					scale: 0.96,
					y: -24,
					duration: 0.65,
					ease: 'power2.in'
				});

			memories.forEach((memory, index) => {
				tl.call(() => {
					setCurrentIndex(index);
				});

				tl.set(chapterRef.current, {
					opacity: 1,
					xPercent: 120,
					yPercent: 0,
					scale: 0.96
				});

				tl.set([titleRef.current, imageRef.current, textRef.current], {
					opacity: 0
				});

				tl.to(chapterRef.current, {
					xPercent: 0,
					scale: 1,
					duration: 0.9,
					ease: 'power3.out'
				});

				tl.fromTo(
					titleRef.current,
					{
						opacity: 0,
						y: 24
					},
					{
						opacity: 1,
						y: 0,
						duration: 0.7,
						ease: 'power2.out'
					},
					'-=0.35'
				);

				tl.fromTo(
					imageRef.current,
					{
						opacity: 0,
						scale: 0.88,
						rotate: -3
					},
					{
						opacity: 1,
						scale: 1,
						rotate: 0,
						duration: 0.9,
						ease: 'back.out(1.5)'
					},
					'-=0.25'
				);

				if (memory.text?.trim()) {
					tl.fromTo(
						textRef.current,
						{
							opacity: 0,
							y: 18
						},
						{
							opacity: 1,
							y: 0,
							duration: 0.65,
							ease: 'power2.out'
						},
						'-=0.25'
					);
				}

				tl.to({}, { duration: MEMORY_HOLD_DURATION });

				tl.to(chapterRef.current, {
					yPercent: 120,
					opacity: 0,
					duration: 0.8,
					ease: 'power3.in'
				});
			});
		}, rootRef);

		return () => ctx.revert();
	}, [memories]);

	useEffect(() => {
		const tl = timelineRef.current;
		if (!tl) return;

		if (isPaused) tl.pause();
		else tl.resume();
	}, [isPaused]);

	if (!currentMemory) return null;

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.bgGlowOne} />
			<div style={styles.bgGlowTwo} />

			<div ref={introRef} style={styles.intro}>
				Vamos explorar algumas
				<br />
				<span style={styles.introAccent}>core memories?</span>
			</div>

			<div ref={chapterRef} style={styles.chapter}>
				<div ref={titleRef} style={styles.chapterTitle}>
					{currentMemory.title}
				</div>

				<div style={styles.photoFrame}>
					<img
						ref={imageRef}
						key={currentMemory.id}
						src={currentMemory.image}
						alt={currentMemory.title}
						style={styles.photo}
					/>
				</div>

				{currentMemory.text?.trim() ? (
					<div ref={textRef} style={styles.memoryText}>
						{currentMemory.text}
					</div>
				) : null}
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
		background: '#2a1638',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	bgGlowOne: {
		position: 'absolute',
		width: 380,
		height: 380,
		top: -140,
		right: -120,
		borderRadius: '50%',
		background: 'rgba(255, 126, 182, 0.22)',
		filter: 'blur(34px)'
	},

	bgGlowTwo: {
		position: 'absolute',
		width: 420,
		height: 420,
		left: -160,
		bottom: -160,
		borderRadius: '50%',
		background: 'rgba(255, 190, 120, 0.16)',
		filter: 'blur(34px)'
	},

	intro: {
		position: 'absolute',
		inset: 0,
		zIndex: 5,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 26,
		textAlign: 'center',
		fontSize: 'clamp(2rem, 7vw, 5rem)',
		lineHeight: 1.02,
		fontWeight: 950,
		textShadow: '0 20px 46px rgba(0,0,0,0.36)'
	},

	introAccent: {
		color: '#ffd0e3'
	},

	chapter: {
		position: 'absolute',
		inset: 0,
		zIndex: 4,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '86px 22px 34px',
		boxSizing: 'border-box'
	},

	chapterTitle: {
		textAlign: 'center',
		marginBottom: 22,
		fontSize: 'clamp(1.8rem, 5.7vw, 4rem)',
		lineHeight: 1.04,
		fontWeight: 950,
		color: '#ffe4ef',
		textShadow: '0 16px 38px rgba(0,0,0,0.28)'
	},

	photoFrame: {
		width: 'min(86vw, 520px)',
		height: 'min(54vh, 620px)',
		borderRadius: 34,
		padding: 8,
		background: 'rgba(255,255,255,0.88)',
		boxShadow: '0 28px 74px rgba(0,0,0,0.34)',
		boxSizing: 'border-box'
	},

	photo: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		display: 'block',
		borderRadius: 26
	},

	memoryText: {
		marginTop: 22,
		width: 'min(88vw, 660px)',
		textAlign: 'center',
		fontSize: 'clamp(1rem, 2.6vw, 1.35rem)',
		lineHeight: 1.35,
		fontWeight: 700,
		color: '#ffeaf4'
	}
};
