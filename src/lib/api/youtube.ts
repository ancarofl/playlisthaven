const YOUTUBE_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export function getYouTubeAuthUrl(sessionId: string): string {
	const params = new URLSearchParams({
		client_id: process.env.YOUTUBE_CLIENT_ID!,
		redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
		response_type: "code",
		scope: "https://www.googleapis.com/auth/youtube",
		state: sessionId,
		access_type: "offline",
		prompt: "consent",
	});

	return `${YOUTUBE_AUTHORIZE_URL}?${params.toString()}`;
}
