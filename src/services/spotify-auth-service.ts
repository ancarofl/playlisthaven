import { SPOTIFY_TOKEN_URL } from "@/lib/api/spotify";
import { InternalServerError } from "@/lib/errors";
import { saveConnectionTokens } from "@/services/provider-connection-service";

export async function exchangeSpotifyCodeForTokens({ code, sessionId }: { code: string; sessionId: string }) {
	const res = await fetch(SPOTIFY_TOKEN_URL, {
		method: "POST",
		headers: {
			Authorization:
				"Basic " +
				Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI!, // ! asserts it's never undefined... which it won't be
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new InternalServerError(data.error_description || "Could not get tokens from Spotify");
	}

	await saveConnectionTokens({
		sessionId,
		provider: "spotify",
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: new Date(Date.now() + data.expires_in * 1000),
	});
}
