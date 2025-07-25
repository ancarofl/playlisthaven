import { YOUTUBE_TOKEN_URL } from "@/lib/api/youtube";
import { InternalServerError } from "@/lib/errors";
import { saveConnectionTokens } from "@/services/provider-connection-service";

interface ExchangeTokensArgs {
	code: string;
	sessionId: string;
}

export async function exchangeYouTubeCodeForTokens({ code, sessionId }: ExchangeTokensArgs): Promise<void> {
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
}
