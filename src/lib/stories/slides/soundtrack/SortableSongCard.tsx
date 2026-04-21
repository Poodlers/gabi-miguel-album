import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { SongItem } from './types';

type SortableSongCardProps = {
	song: SongItem;
	index: number;
};

export default function SortableSongCard({ song, index }: SortableSongCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: song.id
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.7 : 1,
		zIndex: isDragging ? 20 : 1,
		cursor: 'grab',
		userSelect: 'none',
		touchAction: 'none'
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<div style={styles.card}>
				<div style={styles.rankBubble}>#{index + 1}</div>

				<img src={song.cover} alt={`${song.title} cover`} style={styles.cover} draggable={false} />

				<div style={styles.meta}>
					<div style={styles.title}>{song.title}</div>
					<div style={styles.artist}>{song.artist}</div>
					{song.note ? <div style={styles.note}>{song.note}</div> : null}
				</div>
			</div>
		</div>
	);
}

const styles: Record<string, React.CSSProperties> = {
	card: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		gap: 14,
		padding: 14,
		borderRadius: 22,
		background: 'rgba(255,255,255,0.12)',
		border: '1px solid rgba(255,255,255,0.14)',
		backdropFilter: 'blur(10px)',
		boxShadow: '0 14px 30px rgba(0,0,0,0.16)'
	},
	rankBubble: {
		position: 'absolute',
		top: -10,
		left: -8,
		minWidth: 34,
		height: 34,
		padding: '0 10px',
		borderRadius: 999,
		background: '#fff0f6',
		color: '#a92f68',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 800,
		fontSize: 14,
		boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
	},
	cover: {
		width: 72,
		height: 72,
		borderRadius: 16,
		objectFit: 'cover',
		flexShrink: 0
	},
	meta: {
		minWidth: 0,
		textAlign: 'left'
	},
	title: {
		fontSize: 17,
		fontWeight: 800,
		color: '#fff'
	},
	artist: {
		marginTop: 3,
		fontSize: 14,
		color: 'rgba(255,255,255,0.82)'
	},
	note: {
		marginTop: 8,
		fontSize: 12,
		color: '#ffd6e8'
	}
};
