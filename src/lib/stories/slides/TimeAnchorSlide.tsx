import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import SongBadge from '../components/SongBadge';

type TimeAnchorSlideProps = {
	isPaused: boolean;
	songLabel: string;
};

const RELATIONSHIP_START = new Date('2024-05-03T00:00:00');

type ElapsedParts = {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

function getElapsedParts(from: Date, to: Date): ElapsedParts {
	let years = to.getFullYear() - from.getFullYear();
	let months = to.getMonth() - from.getMonth();
	let days = to.getDate() - from.getDate();
	let hours = to.getHours() - from.getHours();
	let minutes = to.getMinutes() - from.getMinutes();
	let seconds = to.getSeconds() - from.getSeconds();

	if (seconds < 0) {
		seconds += 60;
		minutes -= 1;
	}

	if (minutes < 0) {
		minutes += 60;
		hours -= 1;
	}

	if (hours < 0) {
		hours += 24;
		days -= 1;
	}

	if (days < 0) {
		const previousMonth = new Date(to.getFullYear(), to.getMonth(), 0);
		days += previousMonth.getDate();
		months -= 1;
	}

	if (months < 0) {
		months += 12;
		years -= 1;
	}

	return { years, months, days, hours, minutes, seconds };
}

function getHeartbeatCount(from: Date, to: Date, bpm = 60): number {
	const diffMs = Math.max(0, to.getTime() - from.getTime());
	const totalMinutes = diffMs / 1000 / 60;
	return Math.floor(totalMinutes * bpm);
}

function pluralizePt(value: number, singular: string, plural: string): string {
	return value === 1 ? singular : plural;
}

export default function TimeAnchorSlide({ isPaused, songLabel }: TimeAnchorSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const titleLine1Ref = useRef<HTMLDivElement | null>(null);
	const titleLine2Ref = useRef<HTMLDivElement | null>(null);
	const timerWrapRef = useRef<HTMLDivElement | null>(null);
	const curiosityRef = useRef<HTMLDivElement | null>(null);
	const tileRefs = useRef<Array<HTMLDivElement | null>>([]);

	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		if (isPaused) return;

		const interval = window.setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => window.clearInterval(interval);
	}, [isPaused]);

	const elapsed = useMemo(() => getElapsedParts(RELATIONSHIP_START, now), [now]);
	const heartbeatCount = useMemo(() => getHeartbeatCount(RELATIONSHIP_START, now, 60), [now]);

	const tiles = [
		{
			value: elapsed.years,
			label: pluralizePt(elapsed.years, 'ano', 'anos')
		},
		{
			value: elapsed.months,
			label: pluralizePt(elapsed.months, 'mês', 'meses')
		},
		{
			value: elapsed.days,
			label: pluralizePt(elapsed.days, 'dia', 'dias')
		},
		{
			value: elapsed.hours,
			label: 'h'
		},
		{
			value: elapsed.minutes,
			label: 'min'
		},
		{
			value: elapsed.seconds,
			label: 's'
		}
	];

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(
				[titleLine1Ref.current, titleLine2Ref.current, timerWrapRef.current, curiosityRef.current],
				{ opacity: 0 }
			);

			gsap.set(titleLine1Ref.current, { y: 28 });
			gsap.set(titleLine2Ref.current, { y: 28 });
			gsap.set(timerWrapRef.current, { y: 36 });
			gsap.set(curiosityRef.current, { y: 24 });

			gsap.set(tileRefs.current, { opacity: 0, y: 26, scale: 0.96 });

			const tl = gsap.timeline();

			tl.to(titleLine1Ref.current, {
				opacity: 1,
				y: 0,
				duration: 0.9,
				ease: 'power2.out'
			})
				.to(titleLine2Ref.current, {
					opacity: 1,
					y: 0,
					duration: 0.9,
					ease: 'power2.out'
				})
				.to(
					timerWrapRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power2.out'
					},
					'+=0.35'
				)
				.to(
					tileRefs.current,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.7,
						ease: 'power3.out',
						stagger: 0.28
					},
					'+=0.2'
				)
				.to(
					curiosityRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.9,
						ease: 'power2.out'
					},
					'+=0.65'
				);

			gsap.to(tileRefs.current, {
				y: '-=5',
				duration: 2.4,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				stagger: {
					each: 0.08,
					from: 'start'
				}
			});

			const heart = curiosityRef.current?.querySelector('.heart-inline');
			if (heart) {
				gsap.to(heart, {
					scale: 1.16,
					duration: 0.55,
					repeat: -1,
					yoyo: true,
					ease: 'power1.inOut',
					transformOrigin: 'center center'
				});
			}
		}, rootRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		const animations = gsap.globalTimeline.getChildren(false, true, false);
		animations.forEach((anim) => {
			if (isPaused) anim.pause();
			else anim.resume();
		});
	}, [isPaused]);

	const heartbeatDisplay = heartbeatCount.toLocaleString('pt-PT');

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.centerWrap}>
				<div ref={titleLine1Ref} style={styles.titleLine1}>
					Desde 3 de Maio de 2024
				</div>

				<div ref={titleLine2Ref} style={styles.titleLine2}>
					já se passaram:
				</div>

				<div ref={timerWrapRef} style={styles.timerWrap}>
					{tiles.map((tile, index) => (
						<div
							key={`${tile.label}-${index}`}
							ref={(el) => {
								tileRefs.current[index] = el;
							}}
							style={{
								...styles.tile,
								...tileStyles[index]
							}}
						>
							<div style={styles.tileValue}>{tile.value}</div>
							<div style={styles.tileLabel}>{tile.label}</div>
						</div>
					))}
				</div>

				<div ref={curiosityRef} style={styles.curiosityText}>
					<span className="heart-inline" style={styles.heartInline}>
						♥
					</span>
					<br />
					Os nossos corações já bateram{' '}
					<span style={styles.heartbeatHighlight}>{heartbeatDisplay}</span> vezes desde então
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
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		background: '#4b2240'
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
		padding: '32px 24px'
	},

	titleLine1: {
		fontSize: 'clamp(1.7rem, 4vw, 3.2rem)',
		fontWeight: 700,
		lineHeight: 1.15,
		color: '#ffe6f2',
		marginBottom: 10
	},

	titleLine2: {
		fontSize: 'clamp(1.2rem, 2.8vw, 2rem)',
		fontWeight: 500,
		lineHeight: 1.2,
		color: '#ffd3e6',
		marginBottom: 28
	},

	timerWrap: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 14,
		maxWidth: 920,
		marginBottom: 30
	},

	tile: {
		minWidth: 116,
		padding: '18px 16px',
		borderRadius: 22,
		border: '1px solid rgba(255,255,255,0.16)',
		boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
		backdropFilter: 'blur(8px)'
	},

	tileValue: {
		fontSize: 'clamp(1.9rem, 4vw, 3rem)',
		fontWeight: 800,
		lineHeight: 1,
		marginBottom: 8,
		color: '#fff8fc'
	},

	tileLabel: {
		fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
		fontWeight: 600,
		color: 'rgba(255,255,255,0.86)'
	},

	curiosityText: {
		fontSize: 'clamp(1rem, 2.1vw, 1.3rem)',
		lineHeight: 1.5,
		color: '#ffeaf4',
		marginTop: 50,
		maxWidth: 760
	},

	heartInline: {
		display: 'inline-block',
		color: '#ffb0cf',
		scale: 1.5,
		textShadow: '0 0 12px rgba(255, 176, 207, 0.35)'
	},

	heartbeatHighlight: {
		fontWeight: 800,
		color: '#ffffff'
	}
};

const tileStyles: React.CSSProperties[] = [
	{ background: '#d96c9f' },
	{ background: '#db78a8' },
	{ background: '#de84b1' },
	{ background: '#e191ba' },
	{ background: '#e59dc4' },
	{ background: '#e8a9cd' }
];
