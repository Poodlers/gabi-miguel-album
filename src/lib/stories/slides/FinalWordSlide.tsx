import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type FinalWordSlideProps = {
	isPaused: boolean;
	songLabel: string;
	word?: string;
	whisper?: string;
};

export default function FinalWordSlide({
	isPaused,
	songLabel,
	word = 'Inseparáveis',
	whisper = 'para sempre.'
}: FinalWordSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const setupRef = useRef<HTMLDivElement | null>(null);
	const wordRef = useRef<HTMLDivElement | null>(null);
	const whisperRef = useRef<HTMLDivElement | null>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const outroRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(
				[
					setupRef.current,
					wordRef.current,
					whisperRef.current,
					outroRef.current,
					buttonRef.current
				],
				{
					opacity: 0
				}
			);

			gsap.set(buttonRef.current, {
				y: 40,
				scale: 0.94
			});

			gsap.set(setupRef.current, {
				y: 18
			});

			gsap.set(wordRef.current, {
				y: 28,
				scale: 0.88
			});

			gsap.set(whisperRef.current, {
				y: 14
			});

			gsap.set(outroRef.current, {
				y: 40,
				scale: 0.96
			});

			const tl = gsap.timeline({ paused: isPaused });
			timelineRef.current = tl;

			tl
				// setup line
				.to(setupRef.current, {
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power2.out'
				})

				.to({}, { duration: 1.2 })

				// main word
				.to(wordRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1.2,
					ease: 'power3.out'
				})

				.to(
					wordRef.current,
					{
						textShadow: '0 0 38px rgba(255, 210, 232, 0.5), 0 22px 54px rgba(0,0,0,0.42)',
						duration: 1.2,
						ease: 'sine.inOut'
					},
					'-=0.3'
				)

				.to({}, { duration: 1.5 })

				// whisper
				.to(whisperRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.9,
					ease: 'power2.out'
				})

				.to({}, { duration: 1.2 })

				// outro (new part)
				.to(outroRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1,
					ease: 'power3.out'
				})
				.to({}, { duration: 0.9 })

				.to(buttonRef.current, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.9,
					ease: 'power3.out'
				})

				// subtle breathing loop on main word
				.to(wordRef.current, {
					scale: 1.035,
					duration: 2.4,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				});
		}, rootRef);

		const root = rootRef.current;
		if (!root) return;

		const storyContainer = root.closest('.stories-host > div > div') ?? document.body;

		const candidates = Array.from(storyContainer.querySelectorAll<HTMLElement>('div'));

		// Heuristic: full-height overlay panels used by react-insta-stories
		const navPanels = candidates.filter((el) => {
			const style = el.style;
			return (
				style.position == 'absolute' &&
				style.height == 'inherit' &&
				style.width == 'inherit' &&
				style.display == 'flex'
			);
		});

		navPanels.forEach((panel) => {
			panel.style.pointerEvents = 'none';
		});

		return () => {
			navPanels.forEach((panel) => {
				panel.style.pointerEvents = '';
			});
		};

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

			<div style={styles.glow} />

			<div style={styles.content}>
				<div ref={setupRef} style={styles.setup}>
					uma palavra para nós:
				</div>

				<div ref={wordRef} style={styles.word}>
					{word}
				</div>

				<div ref={whisperRef} style={styles.whisper}>
					{whisper}
				</div>
				<div ref={outroRef} style={styles.outro}>
					Espero que tenhas gostado 😘
				</div>
				<div
					ref={buttonRef}
					style={styles.button}
					onClick={() => (window.location.href = '/')}
					onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
					onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
					onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
				>
					Voltar à página inicial
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
		background: '#120b18',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	glow: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		width: '120vw',
		height: '120vh',
		background: 'radial-gradient(circle at center, rgba(255, 126, 182, 0.18), transparent 42%)',
		filter: 'blur(34px)'
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

	setup: {
		marginBottom: 20,
		fontSize: 'clamp(1rem, 3vw, 1.55rem)',
		lineHeight: 1.2,
		fontWeight: 750,
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.64)'
	},

	word: {
		fontSize: 'clamp(3rem, 13vw, 8rem)',
		lineHeight: 0.95,
		fontWeight: 950,
		color: '#ffd1e6',
		textShadow: '0 22px 54px rgba(0,0,0,0.42)'
	},

	whisper: {
		marginTop: 24,
		fontSize: 'clamp(1rem, 3.2vw, 1.7rem)',
		lineHeight: 1.2,
		fontWeight: 700,
		color: 'rgba(255,255,255,0.7)'
	},
	outro: {
		marginTop: 28,
		fontSize: 'clamp(1rem, 3.2vw, 1.6rem)',
		lineHeight: 1.2,
		fontWeight: 700,
		color: 'rgba(255,255,255,0.75)'
	},
	button: {
		marginTop: 26,
		padding: '14px 22px',
		borderRadius: 999,
		background: 'rgba(255,255,255,0.12)',
		border: '1px solid rgba(255,255,255,0.18)',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 14px 40px rgba(0,0,0,0.28)',
		fontSize: 'clamp(0.95rem, 3vw, 1.3rem)',
		fontWeight: 800,
		letterSpacing: '0.04em',
		color: '#fff',
		cursor: 'pointer',
		userSelect: 'none',
		transition: 'transform 0.2s ease, background 0.2s ease'
	}
};
