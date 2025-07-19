"use client";

import { MusicPlatformButton } from "./common/music-platform-button";

interface YouTubeButtonProps {
	onClick?: () => void;
}

export function YouTubeButton({ onClick }: YouTubeButtonProps) {
	return (
		<MusicPlatformButton
			logoLight="/logos/yt-light.png"
			logoDark="/logos/yt-dark.png"
			alt="YouTube"
			themeAware={true}
			onClick={onClick}
		/>
	);
}
