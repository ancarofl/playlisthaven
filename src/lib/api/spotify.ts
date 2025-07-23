const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export function getSpotifyAuthUrl(sessionId: string): string {
	const params = new URLSearchParams({
		client_id: process.env.SPOTIFY_CLIENT_ID!,
		response_type: "code",
		redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
		scope: "playlist-modify-public playlist-modify-private",
		state: sessionId,
		show_dialog: "true",
	});

	return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
}
