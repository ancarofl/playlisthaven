"use client";

import { MusicPlatformButton } from "./common/music-platform-button";

interface SpotifyButtonProps {
	onClick?: () => void;
	isSelected: boolean;
}

export function SpotifyButton({ onClick, isSelected }: SpotifyButtonProps) {
	return (
		<MusicPlatformButton logoLight="/logos/spotify-green.svg" alt="Spotify" onClick={onClick} isSelected={isSelected} />
	);
}
