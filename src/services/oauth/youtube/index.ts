import { YOUTUBE_AUTHORIZE_URL, YOUTUBE_TOKEN_URL } from "@/constants/platforms";
import { InternalServerError } from "@/helpers/errors";
import { saveConnectionTokens } from "@/services/provider-connection-service";
import { OauthService, StateObj } from "@/types/oauth";

interface ExchangeTokensArgs {
	code: string;
	sessionId: string;
}

export const youtubeOauthService: OauthService = {
	getAuthorizationUrl(stateObj: StateObj): string {
		const state = encodeURIComponent(JSON.stringify(stateObj));
		const params = new URLSearchParams({
			client_id: process.env.YOUTUBE_CLIENT_ID!,
			redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
			response_type: "code",
			scope: "https://www.googleapis.com/auth/youtube",
			state,
			access_type: "offline",
			prompt: "consent",
		});

		return `${YOUTUBE_AUTHORIZE_URL}?${params.toString()}`;
	},

	async exchangeCodeForTokens({ code, sessionId }: ExchangeTokensArgs): Promise<void> {
		const res = await fetch(YOUTUBE_TOKEN_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				code,
				client_id: process.env.YOUTUBE_CLIENT_ID!,
				client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
				redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
				grant_type: "authorization_code",
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new InternalServerError(data.error_description || "Could not get tokens from YouTube");
		}

		await saveConnectionTokens({
			sessionId,
			provider: "youtube",
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
		});
	},
};
