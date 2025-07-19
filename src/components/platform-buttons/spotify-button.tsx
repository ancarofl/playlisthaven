"use client";

import { MusicPlatformButton } from "./common/music-platform-button";

interface SpotifyButtonProps {
	onClick?: () => void;
}

export function SpotifyButton({ onClick }: SpotifyButtonProps) {
	return <MusicPlatformButton logoLight="/logos/spotify-green.svg" alt="Spotify" onClick={onClick} />;
}
