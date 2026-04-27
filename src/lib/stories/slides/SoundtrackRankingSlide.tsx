import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { toJpeg } from 'html-to-image';
import {
	closestCenter,
	DndContext,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';

import SongBadge from '../components/SongBadge';
import SortableSongCard from './soundtrack/SortableSongCard';
import Top5Poster from './soundtrack/Top5Poster';
import type { SongItem } from './soundtrack/types';

type SoundtrackRankingSlideProps = {
	isPaused: boolean;
	songLabel: string;
};

type Phase = 'intro' | 'ranking' | 'preparing' | 'result';

const INITIAL_SONGS: SongItem[] = [
	{
		id: '1',
		title: 'Mystery Song',
		artist: 'Artist One',
		cover: '/songs/covers/song1.jpg',
		note: 'a música daquela viagem'
	},
	{
		id: '2',
		title: 'Loop Forever',
		artist: 'Artist Two',
		cover: '/songs/covers/song2.jpg',
		note: 'a que ouvimos em loop'
	},
	{
		id: '3',
		title: 'Golden Hour',
		artist: 'Artist Three',
		cover: '/songs/covers/song3.jpg'
	},
	{
		id: '4',
		title: 'Blue Light',
		artist: 'Artist Four',
		cover: '/songs/covers/song4.jpg'
	},
	{
		id: '5',
		title: 'Soft Hearts',
		artist: 'Artist Five',
		cover: '/songs/covers/song5.jpg'
	},
	{
		id: '6',
		title: 'Late Night Train',
		artist: 'Artist Six',
		cover: '/songs/covers/song6.jpg'
	}
];

export default function SoundtrackRankingSlide({
	isPaused,
	songLabel
}: SoundtrackRankingSlideProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const introRef = useRef<HTMLDivElement | null>(null);
	const rankingRef = useRef<HTMLDivElement | null>(null);
	const preparingRef = useRef<HTMLDivElement | null>(null);
	const resultRef = useRef<HTMLDivElement | null>(null);
	const posterRef = useRef<HTMLDivElement | null>(null);

	const [phase, setPhase] = useState<Phase>('intro');
	const [songs, setSongs] = useState(INITIAL_SONGS);
	const [exportUrl, setExportUrl] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
	);

	const top5 = useMemo(() => songs.slice(0, 5), [songs]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([introRef.current, rankingRef.current, preparingRef.current, resultRef.current], {
				opacity: 0
			});

			gsap.set(introRef.current, { y: 20 });
			gsap.to(introRef.current, {
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power2.out'
			});
		}, rootRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		const tweens = gsap.globalTimeline.getChildren(false, true, false);
		tweens.forEach((anim) => {
			if (isPaused) anim.pause();
			else anim.resume();
		});
	}, [isPaused]);

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

		const shouldDisableNav = phase === 'intro' || phase === 'ranking' || phase === 'preparing';

		navPanels.forEach((panel) => {
			panel.style.pointerEvents = shouldDisableNav ? 'none' : '';
		});

		return () => {
			navPanels.forEach((panel) => {
				panel.style.pointerEvents = '';
			});
		};
	}, [phase]);

	const goToRanking = () => {
		const tl = gsap.timeline({
			onComplete: () => {
				setPhase('ranking');
				requestAnimationFrame(() => {
					gsap.fromTo(
						rankingRef.current,
						{ opacity: 0 },
						{ opacity: 1, duration: 0.5, ease: 'power2.out' }
					);

					const cards = rankingRef.current?.querySelectorAll('[data-song-card]');
					if (cards?.length) {
						gsap.fromTo(
							cards,
							{
								opacity: 0,
								scale: 0.7,
								y: 36,
								rotate: -4
							},
							{
								opacity: 1,
								scale: 1,
								y: 0,
								rotate: 0,
								duration: 0.7,
								ease: 'back.out(1.8)',
								stagger: 0.18
							}
						);
					}
				});
			}
		});

		tl.to(introRef.current, {
			opacity: 0,
			y: -20,
			duration: 0.6,
			ease: 'power2.in'
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		setSongs((items) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	};

	const finishRanking = async () => {
		const tl = gsap.timeline({
			onComplete: async () => {
				setPhase('preparing');

				requestAnimationFrame(() => {
					gsap.fromTo(
						preparingRef.current,
						{ opacity: 0, y: 20 },
						{ opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
					);
				});

				await new Promise((resolve) => window.setTimeout(resolve, 1600));

				try {
					const node = posterRef.current;
					if (!node) return;

					const dataUrl = await toJpeg(node, {
						quality: 0.95,
						pixelRatio: 2,
						cacheBust: true
					});

					setExportUrl(dataUrl);

					gsap.to(preparingRef.current, {
						opacity: 0,
						duration: 0.45,
						ease: 'power2.in',
						onComplete: () => {
							setPhase('result');

							requestAnimationFrame(() => {
								gsap.fromTo(
									resultRef.current,
									{ opacity: 0, y: 22 },
									{ opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
								);
							});
						}
					});
				} catch (error) {
					console.error('Failed to export poster', error);
				}
			}
		});

		tl.to(rankingRef.current, {
			opacity: 0,
			y: -16,
			duration: 0.45,
			ease: 'power2.in'
		});
	};

	const downloadPoster = () => {
		if (!exportUrl) return;

		const a = document.createElement('a');
		a.href = exportUrl;
		a.download = 'top-5-musicas-relacao.jpeg';
		a.click();
	};

	return (
		<div ref={rootRef} style={styles.slide}>
			<SongBadge label={songLabel} />

			<div style={styles.hiddenPoster}>
				<Top5Poster ref={posterRef} songs={top5} />
			</div>

			{phase === 'intro' && (
				<div ref={introRef} style={styles.centerStage}>
					<div style={styles.bigText}>
						Já ouvimos imensa música juntos,
						<br />
						mas algumas marcaram-nos mais que outras...
					</div>

					<div style={{ ...styles.bigText, marginTop: 28, fontSize: 'clamp(1.2rem, 2.6vw, 2rem)' }}>
						Das seguintes, como achas que deveria ser a ordem das nossas músicas?
					</div>

					<button style={styles.primaryButton} onClick={goToRanking}>
						Vamos lá
					</button>
				</div>
			)}

			{phase === 'ranking' && (
				<div ref={rankingRef} style={styles.rankingStage}>
					<div style={styles.heading}>Arrasta para ordenar o nosso top 💗</div>

					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext items={songs.map((song) => song.id)} strategy={rectSortingStrategy}>
							<div style={styles.grid}>
								{songs.map((song, index) => (
									<div key={song.id} data-song-card>
										<SortableSongCard song={song} index={index} />
									</div>
								))}
							</div>
						</SortableContext>
					</DndContext>

					<button style={styles.primaryButton} onClick={finishRanking}>
						Pronto!
					</button>
				</div>
			)}

			{phase === 'preparing' && (
				<div ref={preparingRef} style={styles.centerStage}>
					<div style={styles.bigText}>
						A preparar o seu top 5
						<br />
						músicas da relação...
					</div>
				</div>
			)}

			{phase === 'result' && (
				<div ref={resultRef} style={styles.centerStage}>
					<div style={styles.heading}>Top 5 oficial escolhido por ti</div>

					{exportUrl ? (
						<img src={exportUrl} alt="Top 5 músicas da relação" style={styles.previewImage} />
					) : null}

					<button style={styles.primaryButton} onClick={downloadPoster}>
						Download
					</button>
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
		background: 'linear-gradient(180deg, #5c2144 0%, #3f1630 100%)',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
	},
	centerStage: {
		position: 'absolute',
		inset: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		padding: 24
	},
	rankingStage: {
		position: 'absolute',
		inset: 0,
		padding: '88px 24px 28px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	bigText: {
		fontSize: 'clamp(1.5rem, 3.5vw, 2.7rem)',
		fontWeight: 800,
		lineHeight: 1.18,
		maxWidth: 900
	},
	heading: {
		fontSize: 'clamp(1.2rem, 2.4vw, 2rem)',
		fontWeight: 800,
		marginBottom: 24,
		textAlign: 'center'
	},
	grid: {
		width: 'min(100%, 920px)',
		display: 'grid',
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		gap: 18
	},
	primaryButton: {
		zIndex: 10000,
		marginTop: 28,
		border: 0,
		borderRadius: 999,
		padding: '14px 24px',
		background: '#ffe6f1',
		color: '#8b2557',
		fontSize: 16,
		fontWeight: 800,
		cursor: 'pointer',
		boxShadow: '0 12px 30px rgba(0,0,0,0.18)'
	},
	secondaryButton: {
		marginTop: 14,
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: 999,
		padding: '12px 20px',
		background: 'rgba(255,255,255,0.08)',
		color: '#fff',
		fontSize: 15,
		fontWeight: 700,
		cursor: 'pointer'
	},
	previewImage: {
		width: 'min(88vw, 420px)',
		borderRadius: 24,
		marginTop: 22,
		boxShadow: '0 20px 40px rgba(0,0,0,0.22)'
	},
	hiddenPoster: {
		position: 'fixed',
		left: -99999,
		top: 0,
		pointerEvents: 'none'
	}
};
