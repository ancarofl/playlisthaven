"use client";

import { MusicPlatformButton } from "./common/music-platform-button";

interface YouTubeButtonProps {
	onClick?: () => void;
	isSelected: boolean;
}

export function YouTubeButton({ onClick, isSelected }: YouTubeButtonProps) {
	return (
		<MusicPlatformButton
			logoLight="/logos/yt-light.png"
			logoDark="/logos/yt-dark.png"
			alt="YouTube"
			themeAware={true}
			onClick={onClick}
			isSelected={isSelected}
		/>
	);
}
