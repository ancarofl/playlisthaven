import { Platform } from "@/types/platforms";

export const PLATFORM_KEYS = ["spotify", "youtube"] as const;

// TODO: Change to dictionary(using Record) for faster lookup? O(n) vs O(1). But what about the cons?
// TODO: Refactor into ALL_PLATFORMS and AVAILABLE_PLATFORMS?
export const PLATFORMS: Platform[] = [
	{
		key: "spotify",
		alt: "Spotify",
		logoLight: "/logos/spotify-green.svg",
	},
	{
		key: "youtube",
		alt: "YouTube",
		logoLight: "/logos/yt-light.png",
		logoDark: "/logos/yt-dark.png",
		themeAware: true,
	},
	// Test invalid config
	/* 	{
		key: "test",
		alt: "test2",
		logoLight: "/logos/test.svg",
	}, */
];

export type PlatformKey = (typeof PLATFORM_KEYS)[number];

// Spotify
export const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// YouTube
export const YOUTUBE_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token";
