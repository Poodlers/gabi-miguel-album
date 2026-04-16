import React from 'react';

type SongBadgeProps = {
	label?: string;
};

export default function SongBadge({ label }: SongBadgeProps) {
	return <div style={styles.songTag}>{label}</div>;
}

const styles: Record<string, React.CSSProperties> = {
	songTag: {
		position: 'absolute',
		top: 24,
		left: 24,
		zIndex: 2,
		fontSize: 13,
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		opacity: 0.9,
		color: '#fff'
	}
};
