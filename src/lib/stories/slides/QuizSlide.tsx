import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import Confetti from 'react-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import SongBadge from '../components/SongBadge';

export type QuizQuestion = {
	id: string;
	question: string;
	correct: number;
	answers: string[];
};

type QuizSlideProps = {
	isPaused: boolean;
	songLabel: string;
	questions: QuizQuestion[];
	onComplete?: () => void;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizSlide({ isPaused, songLabel, questions, onComplete }: QuizSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const introRef = useRef<HTMLDivElement | null>(null);
	const questionStageRef = useRef<HTMLDivElement | null>(null);
	const questionRef = useRef<HTMLDivElement | null>(null);
	const optionsRef = useRef<HTMLDivElement | null>(null);

	const [phase, setPhase] = useState<'intro' | 'quiz' | 'done'>('intro');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [confettiOrigin, setConfettiOrigin] = useState<{ x: number; y: number } | null>(null);

	const currentQuestion = questions[currentIndex];

	const confettiConfig = useMemo(() => {
		if (!confettiOrigin) return null;

		return {
			x: confettiOrigin.x / window.innerWidth,
			y: confettiOrigin.y / window.innerHeight
		};
	}, [confettiOrigin]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(introRef.current, { opacity: 0, y: 32, scale: 0.94 });

			gsap.to(introRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.95,
				ease: 'back.out(1.7)'
			});

			gsap.to(introRef.current, {
				opacity: 0,
				y: -24,
				scale: 0.97,
				duration: 0.7,
				delay: 3,
				ease: 'power2.in',
				onComplete: () => setPhase('quiz')
			});
		}, rootRef);

		return () => ctx.revert();
	}, []);

	//panel hack

	useEffect(() => {
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

		const shouldDisableNav = phase === 'intro' || phase === 'quiz';

		navPanels.forEach((panel) => {
			panel.style.pointerEvents = shouldDisableNav ? 'none' : '';
		});

		if (phase === 'done') {
			onComplete?.();
		}

		return () => {
			navPanels.forEach((panel) => {
				panel.style.pointerEvents = '';
			});
		};
	}, [phase]);

	useEffect(() => {
		if (phase !== 'quiz') return;

		const ctx = gsap.context(() => {
			const options = optionsRef.current?.querySelectorAll('[data-option]') ?? [];

			gsap.set(questionStageRef.current, { opacity: 1, xPercent: -120, yPercent: 0 });
			gsap.set(questionRef.current, { opacity: 0, y: 20 });
			gsap.set(options, {
				opacity: 0,
				y: 26,
				scale: 0.95
			});

			const tl = gsap.timeline({ paused: isPaused });

			tl.to(questionStageRef.current, {
				xPercent: 0,
				duration: 0.75,
				ease: 'power3.out'
			})
				.to(
					questionRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.65,
						ease: 'power2.out'
					},
					'-=0.35'
				)
				.to(
					options,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.55,
						stagger: 0.13,
						ease: 'back.out(1.55)'
					},
					'-=0.25'
				)
				.to(questionRef.current, {
					y: -5,
					duration: 2.2,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				})
				.to(
					options,
					{
						y: (index) => (index % 2 === 0 ? -4 : 4),
						duration: 2,
						repeat: -1,
						yoyo: true,
						stagger: 0.08,
						ease: 'sine.inOut'
					},
					'<'
				);

			return () => tl.kill();
		}, rootRef);

		return () => ctx.revert();
	}, [phase, currentIndex, isPaused]);

	if (!currentQuestion) return null;

	const chooseAnswer = (answerIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
		if (selectedIndex !== null) return;

		setSelectedIndex(answerIndex);

		const optionNodes = optionsRef.current?.querySelectorAll<HTMLElement>('[data-option]') ?? [];

		optionNodes.forEach((node) => {
			const index = Number(node.dataset.optionIndex);
			const isCorrect = index === currentQuestion.correct;

			if (!isCorrect) {
				gsap.fromTo(
					node,
					{ x: 0 },
					{
						x: 8,
						duration: 0.08,
						repeat: 5,
						yoyo: true,
						ease: 'power1.inOut'
					}
				);
			} else {
				// subtle "pop" for correct one
				gsap.fromTo(
					node,
					{ scale: 1 },
					{
						scale: 1.06,
						duration: 0.18,
						yoyo: true,
						repeat: 1,
						ease: 'power2.out'
					}
				);
			}
		});

		const correctButton = optionsRef.current?.querySelector<HTMLElement>(
			`[data-option-index="${currentQuestion.correct}"]`
		);

		if (answerIndex === currentQuestion.correct && correctButton) {
			const rect = correctButton.getBoundingClientRect();
			setConfettiOrigin({
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2
			});
		}

		window.setTimeout(() => {
			gsap.to(questionStageRef.current, {
				xPercent: 120,
				opacity: 0,
				duration: 0.75,
				ease: 'power3.in',
				onComplete: () => {
					setConfettiOrigin(null);
					setSelectedIndex(null);

					if (currentIndex + 1 < questions.length) {
						setCurrentIndex((index) => index + 1);
					} else {
						setPhase('done');
					}
				}
			});
		}, 1700);
	};

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			{confettiConfig ? (
				<Confetti
					recycle={false}
					numberOfPieces={300}
					gravity={0.4}
					wind={0.02}
					initialVelocityX={{ min: -12, max: 12 }}
					initialVelocityY={{ min: -22, max: 4 }}
					confettiSource={{
						x: confettiOrigin!.x,
						y: confettiOrigin!.y,
						w: 10,
						h: 10
					}}
					colors={['#ff7eb6', '#ffd1e6', '#ffffff', '#b8ffec']}
					width={window.innerWidth}
					height={window.innerHeight}
					style={{ zIndex: 999 }}
				/>
			) : null}

			<div style={styles.blobOne} />
			<div style={styles.blobTwo} />

			{phase === 'intro' && (
				<div ref={introRef} style={styles.intro}>
					Consegues acertar
					<br />
					estas perguntas todas?
				</div>
			)}

			{phase === 'quiz' && (
				<div ref={questionStageRef} style={styles.questionStage}>
					<div ref={questionRef} style={styles.question}>
						{currentQuestion.question}
					</div>

					<div ref={optionsRef} style={styles.options}>
						{currentQuestion.answers.map((answer, index) => {
							const hasAnswered = selectedIndex !== null;
							const isCorrect = index === currentQuestion.correct;
							const isSelected = index === selectedIndex;

							const optionStyle: React.CSSProperties = {
								...styles.option,
								...(hasAnswered ? (isCorrect ? styles.correctOption : styles.wrongOption) : {})
							};

							return (
								<button
									key={`${currentQuestion.id}-${answer}`}
									type="button"
									data-option
									data-option-index={index}
									style={optionStyle}
									disabled={hasAnswered}
									onPointerDown={(e) => e.stopPropagation()}
									onClick={(e) => {
										e.stopPropagation();
										chooseAnswer(index, e);
									}}
								>
									<span
										style={{
											...styles.optionLetter,
											...(hasAnswered
												? isCorrect
													? styles.correctLetter
													: styles.wrongLetter
												: {})
										}}
									>
										{hasAnswered ? (
											<FontAwesomeIcon icon={isCorrect ? faCheck : faXmark} />
										) : (
											LETTERS[index]
										)}
									</span>

									<span style={styles.answerText}>{answer}</span>
								</button>
							);
						})}
					</div>
				</div>
			)}
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
		background: '#351f46',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},

	blobOne: {
		position: 'absolute',
		width: 360,
		height: 360,
		top: -130,
		left: -120,
		borderRadius: '50%',
		background: 'rgba(255, 126, 182, 0.22)',
		filter: 'blur(30px)'
	},

	blobTwo: {
		position: 'absolute',
		width: 420,
		height: 420,
		right: -160,
		bottom: -160,
		borderRadius: '50%',
		background: 'rgba(184, 255, 236, 0.14)',
		filter: 'blur(34px)'
	},

	intro: {
		position: 'absolute',
		inset: 0,
		zIndex: 4,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 28,
		textAlign: 'center',
		fontSize: 'clamp(2.1rem, 7vw, 5rem)',
		lineHeight: 1.02,
		fontWeight: 950,
		textShadow: '0 20px 46px rgba(0,0,0,0.32)'
	},

	questionStage: {
		position: 'absolute',
		inset: 0,
		zIndex: 5,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '86px 22px 34px',
		boxSizing: 'border-box'
	},

	question: {
		width: 'min(92vw, 820px)',
		marginBottom: 32,
		textAlign: 'center',
		fontSize: 'clamp(1.8rem, 5.5vw, 4rem)',
		lineHeight: 1.08,
		fontWeight: 950,
		color: '#ffe1ee',
		textShadow: '0 16px 38px rgba(0,0,0,0.28)'
	},

	options: {
		width: 'min(92vw, 760px)',
		display: 'flex',
		flexDirection: 'column',
		gap: 14
	},

	option: {
		width: '100%',
		minHeight: 72,
		border: '1px solid rgba(255,255,255,0.16)',
		borderRadius: 24,
		padding: '14px 16px',
		display: 'flex',
		alignItems: 'center',
		gap: 14,
		background: 'rgba(255,255,255,0.13)',
		color: '#fff',
		cursor: 'pointer',
		boxShadow: '0 16px 34px rgba(0,0,0,0.20)',
		backdropFilter: 'blur(14px)',
		textAlign: 'left',
		transition: 'background 220ms ease, transform 220ms ease'
	},

	correctOption: {
		background: '#47c07a',
		borderColor: 'rgba(255,255,255,0.25)'
	},

	wrongOption: {
		background: '#d9577c',
		borderColor: 'rgba(255,255,255,0.20)'
	},

	optionLetter: {
		width: 42,
		height: 42,
		borderRadius: 999,
		flexShrink: 0,
		border: '2px solid rgba(255,255,255,0.78)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		fontWeight: 950,
		color: '#fff'
	},

	correctLetter: {
		background: 'rgba(255,255,255,0.24)',
		borderColor: '#fff'
	},

	wrongLetter: {
		background: 'rgba(255,255,255,0.18)',
		borderColor: 'rgba(255,255,255,0.78)'
	},

	answerText: {
		fontSize: 'clamp(1rem, 2.7vw, 1.25rem)',
		lineHeight: 1.2,
		fontWeight: 800
	}
};
