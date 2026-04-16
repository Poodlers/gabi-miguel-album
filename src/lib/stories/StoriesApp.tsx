import React, { useEffect, useMemo, useRef, useState } from 'react';
import Stories from 'react-insta-stories';
import IntroSlide from './slides/IntroSlide';

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
	const audioRef = useRef<HTMLAudioElement | null>(null);

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
				duration: 5000,
				songLabel: 'Song name — Artist name',
				songSrc: '/songs/intro.mp3',
				startSecond: 12,
				volume: 0.7,
				render: ({ isPaused, songLabel }) => (
					<IntroSlide isPaused={isPaused} songLabel={songLabel} />
				)
			}
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
