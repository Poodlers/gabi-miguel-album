import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import Stories from 'react-insta-stories';
import SoundtrackRankingSlide from './slides/SoundtrackRankingSlide';
import IntroSlide from './slides/IntroSlide';
import TimeAnchorSlide from './slides/TimeAnchorSlide';
import MapJourneySlide from './slides/MapJourneySlide';
import type { MapStoryPlace } from './slides/map/types';
import DistanceSlide from './slides/DistanceSlide';
import LongDistanceRitualsSlide from './slides/LongDistanceRitualsSlide';
import StatsSlide from './slides/StatsSlide';
import CoreMemoriesSlide, { type CoreMemory } from './slides/CoreMemoriesSlide';
import QuizSlide, { type QuizQuestion } from './slides/QuizSlide';
import SmallThingsSlide, { type SmallThing } from './slides/SmallThingsSlide';

type StoryAudio = {
	songLabel?: string;
	songSrc?: string;
	startSecond?: number;
	volume?: number;
};

type AppStory = StoryAudio & {
	duration: number;
	render: (props: { isPaused: boolean; songLabel: string }) => React.ReactNode;
};

export default function StoriesApp() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const goNextStory = () => {
		setCurrentIndex((prev) => prev + 1);
	};

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const gabiSmallThings: SmallThing[] = [
		{
			id: 'cabeca',
			emoji: '💆‍♀️',
			text: 'gostas de ser coçada no couro cabeludo'
		},
		{
			id: 'borbulhas',
			emoji: '😈',
			text: 'gostas demasiado de espremer borbulhas'
		},
		{
			id: 'voz-fofa',
			emoji: '🥺',
			text: 'fazes uma voz fofa quando vês algo fofo'
		},
		{
			id: 'solucos',
			emoji: '🤭',
			text: 'os teus soluçinhos fofos'
		},
		{
			id: 'ah',
			emoji: '😮',
			text: 'o “ahhhh” quando algo te surpreende'
		},
		{
			id: 'riso',
			emoji: '✨',
			text: 'tens um riso mesmo muito fofo'
		},
		{
			id: 'danca',
			emoji: '💃',
			text: 'melhores passos de dança'
		},
		{
			id: 'sono',
			emoji: '🛌',
			text: 'amas dormir e reclamar para sair da cama'
		},
		{
			id: 'doces',
			emoji: '🍦',
			text: 'amas doces, panquecas e gelados'
		},
		{
			id: 'fotos',
			emoji: '📸',
			text: 'tens talento para tirar fotos lindas'
		},
		{
			id: 'banhos',
			emoji: '🔥',
			text: 'banhos a escaldar, preparação para o inferno'
		}
	];

	const quizQuestions: QuizQuestion[] = [
		{
			id: 'first-series',
			question: 'Qual foi a primeira série que vimos juntos?',
			correct: 0,
			answers: ['Severance', 'Death Note', 'Modern Family', 'Foi o telejornal sem querer']
		},
		{
			id: 'first-meeting',
			question: 'Lembras-te do dia em que nos conhecemos?',
			correct: 1,
			answers: [
				'Não, foi tudo um sonho',
				'Claro que sim',
				'Só lembro do outfit',
				'Ainda estou a processar'
			]
		}
	];

	const coreMemories: CoreMemory[] = [
		{
			id: 'first-date',
			title: 'O nosso primeiro date',
			image: '/core-memories/first-date.jpg',
			text: 'quando ainda era tudo novo, mas já parecia tão certo.'
		},
		{
			id: 'asking-gf',
			title: 'O dia em que te pedi em namoro',
			image: '/core-memories/pedido.jpg',
			text: 'um dos meus “sim” favoritos de sempre.'
		},
		{
			id: 'first-trip',
			title: 'A nossa primeira viagem',
			image: '/core-memories/first-trip.jpg',
			text: 'a primeira de muitas aventuras juntos.'
		},
		{
			id: 'reunion',
			title: 'Os nossos reencontros',
			image: '/core-memories/reunion.jpg',
			text: 'cada abraço parecia matar meses de saudades.'
		},
		{
			id: 'latest-trip',
			title: 'A nossa viagem mais recente',
			image: '/core-memories/latest-trip.jpg',
			text: 'prova de que a melhor parte ainda está sempre a chegar.'
		}
	];

	const journeyPlaces: MapStoryPlace[] = [
		{
			id: 'lisbon',
			name: 'Lisboa',
			country: 'Portugal',
			coordinates: { lat: 38.7223, lng: -9.1393 },
			photos: ['/moments/lisbon/photo-1.jpg', '/moments/lisbon/photo-2.jpg'],
			text: 'Onde começámos a construir esta história.'
		},
		{
			id: 'berlin',
			name: 'Berlim',
			country: 'Alemanha',
			coordinates: { lat: 52.52, lng: 13.405 },
			photos: ['/moments/berlin/photo-1.jpg', '/moments/berlin/photo-2.jpg'],
			text: 'Mesmo longe, havia sempre um bocadinho de nós aqui.'
		}
	];

	const watchedSeries = [
		{
			id: 'severance',
			name: 'Severance',
			image: '/series/severance.jpg'
		},
		{
			id: 'death-note',
			name: 'Death Note',
			image: '/series/death-note.jpg'
		},
		{
			id: 'modern-family',
			name: 'Modern Family',
			image: '/series/modern-family.jpg'
		},
		{
			id: 'arcane',
			name: 'Arcane',
			image: '/series/arcane.jpg'
		},
		{
			id: 'the-office',
			name: 'The Office',
			image: '/series/the-office.jpg'
		}
	];

	const appStories: AppStory[] = useMemo(
		() => [
			{
				duration: 5000,
				songLabel: 'My Kind of Woman — Artist name',
				songSrc: '/songs/my_kind_of_woman.mp3',
				startSecond: 12,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<IntroSlide isPaused={isPaused} songLabel={songLabel} />
				)
			},
			{
				duration: 10000,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/your-song.mp3',
				startSecond: 24,
				volume: 0.72,
				render: ({ isPaused, songLabel }) => (
					<TimeAnchorSlide isPaused={isPaused} songLabel={songLabel ?? ''} />
				)
			},
			{
				duration: 11000,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/distance-song.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<DistanceSlide isPaused={isPaused} songLabel={songLabel ?? ''} />
				)
			},
			{
				duration: 17000,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/rituals.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<LongDistanceRitualsSlide
						isPaused={isPaused}
						songLabel={songLabel ?? ''}
						watchedSeries={watchedSeries}
					/>
				)
			},
			{
				duration: 11500,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/stats.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<StatsSlide isPaused={isPaused} songLabel={songLabel ?? ''} />
				)
			},
			{
				duration: 4000 + coreMemories.length * 6500,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/core-memories.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<CoreMemoriesSlide
						isPaused={isPaused}
						songLabel={songLabel ?? ''}
						memories={coreMemories}
					/>
				)
			},
			{
				duration: 17500,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/small-things.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<SmallThingsSlide
						isPaused={isPaused}
						songLabel={songLabel ?? ''}
						things={gabiSmallThings}
					/>
				)
			},
			{
				duration: 999999,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/quiz.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<QuizSlide
						isPaused={isPaused}
						songLabel={songLabel ?? ''}
						questions={quizQuestions}
						onComplete={goNextStory}
					/>
				)
			},

			{
				duration:
					4000 +
					journeyPlaces.reduce(
						(total, place) =>
							total + 2700 + 850 + 1000 + Math.max(place.photos.length, 1) * 3250 + 1650,
						0
					),
				songLabel: 'Around the World — Daft Punk',
				songSrc: '/songs/map-song.mp3',
				startSecond: 0,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<MapJourneySlide isPaused={isPaused} songLabel={songLabel ?? ''} places={journeyPlaces} />
				)
			}
			/*{
				duration: 999999,
				songLabel: 'Your soundtrack song — Artist',
				songSrc: '/songs/soundtrack.mp3',
				startSecond: 18,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<SoundtrackRankingSlide isPaused={isPaused} songLabel={songLabel ?? ''} />
				)
			} */
		],
		[isPaused]
	);

	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio();
		}

		const audio = audioRef.current;
		const story = appStories[currentIndex];

		if (!story?.songSrc) {
			audio.pause();
			audio.removeAttribute('src');
			audio.load();
			return;
		}

		const nextSrc = story.songSrc;
		const nextVolume = story.volume ?? 1;
		const nextStart = story.startSecond ?? 0;

		const shouldReplaceSrc = audio.getAttribute('src') !== nextSrc;

		if (shouldReplaceSrc) {
			audio.src = nextSrc;
		}

		audio.volume = Math.max(0, Math.min(1, nextVolume));

		const seekAndPlay = async () => {
			const onReady = () => {
				audio.currentTime = nextStart;
				if (!isPaused) {
					audio.play().catch(() => {
						// autoplay may be blocked until user interacts
					});
				}
			};

			if (shouldReplaceSrc) {
				audio.addEventListener('loadedmetadata', onReady, { once: true });
				audio.load();
			} else {
				audio.currentTime = nextStart;
				if (!isPaused) {
					audio.play().catch(() => {});
				}
			}
		};

		seekAndPlay();

		return () => {
			// optional cleanup per story change
		};
	}, [currentIndex, appStories, isPaused]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPaused) audio.pause();
		else audio.play().catch(() => {});
	}, [isPaused]);

	const stories = appStories.map((story) => ({
		duration: story.duration,
		content: () => story.render({ isPaused, songLabel: story.songLabel || '' })
	}));

	return (
		<div style={{ width: '100vw', height: '100vh', background: '#000' }}>
			<Stories
				stories={stories}
				width="100vw"
				height="100vh"
				defaultInterval={5000}
				currentIndex={currentIndex}
				onStoryStart={(index: number) => {
					setCurrentIndex(index);
				}}
				keyboardNavigation
				storyContainerStyles={{
					width: '100vw',
					height: '100vh',
					maxWidth: '100vw',
					maxHeight: '100vh',
					margin: 0,
					background: '#000'
				}}
			/>
		</div>
	);
}
