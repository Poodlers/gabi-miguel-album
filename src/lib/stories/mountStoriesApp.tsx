import React from 'react';
import { createRoot } from 'react-dom/client';
import StoriesApp from './StoriesApp';

export function mountStoriesApp(container: HTMLDivElement) {
	const root = createRoot(container);
	root.render(<StoriesApp />);

	return () => root.unmount();
}
