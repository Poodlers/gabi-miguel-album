import React, { forwardRef } from 'react';
import type { SongItem } from './types';

type Top5PosterProps = {
	songs: SongItem[];
};

const Top5Poster = forwardRef<HTMLDivElement, Top5PosterProps>(function Top5Poster({ songs }, ref) {
	return (
		<div ref={ref} style={styles.poster}>
			<div style={styles.header}>Top 5 músicas da relação</div>
			<div style={styles.subheader}>edição oficial escolhida pela Gabi 💗</div>

			<div style={styles.list}>
				{songs.slice(0, 5).map((song, index) => (
					<div key={song.id} style={styles.row}>
						<div style={styles.position}>{index + 1}</div>
						<img src={song.cover} alt="" style={styles.cover} />
						<div style={styles.meta}>
							<div style={styles.title}>{song.title}</div>
							<div style={styles.artist}>{song.artist}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

export default Top5Poster;

const styles: Record<string, React.CSSProperties> = {
	poster: {
		width: 900,
		padding: 40,
		borderRadius: 34,
		background: 'linear-gradient(180deg, #ffd3e6 0%, #ffbad7 100%)',
		color: '#5f1739',
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		boxSizing: 'border-box'
	},
	header: {
		fontSize: 40,
		fontWeight: 900
	},
	subheader: {
		marginTop: 8,
		fontSize: 18,
		opacity: 0.85
	},
	list: {
		marginTop: 28,
		display: 'flex',
		flexDirection: 'column',
		gap: 16
	},
	row: {
		display: 'flex',
		alignItems: 'center',
		gap: 16,
		padding: 16,
		borderRadius: 22,
		background: 'rgba(255,255,255,0.56)'
	},
	position: {
		width: 44,
		height: 44,
		borderRadius: 999,
		background: '#fff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 900,
		fontSize: 18
	},
	cover: {
		width: 72,
		height: 72,
		borderRadius: 16,
		objectFit: 'cover'
	},
	meta: {
		minWidth: 0
	},
	title: {
		fontSize: 22,
		fontWeight: 800
	},
	artist: {
		marginTop: 4,
		fontSize: 16,
		opacity: 0.8
	}
};
