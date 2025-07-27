import { SPOTIFY_AUTHORIZE_URL, SPOTIFY_TOKEN_URL } from "@/constants/platforms";
import { InternalServerError } from "@/helpers/errors";
import { saveConnectionTokens } from "@/services/provider-connection-service";
import { OauthService } from "@/types/oauth";

export const spotifyOauthService: OauthService = {
	getAuthorizationUrl(state: string): string {
		const params = new URLSearchParams({
			client_id: process.env.SPOTIFY_CLIENT_ID!,
			response_type: "code",
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
			scope: "playlist-modify-public playlist-modify-private",
			state,
			show_dialog: "true",
		});

		return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
	},

	async exchangeCodeForTokens({ code, sessionId }: { code: string; sessionId: string }): Promise<void> {
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
	},
};
