import { NextResponse } from "next/server";

import { APIError } from "@/lib/errors";
import { errorResponse } from "@/lib/json-response";
import { exchangeSpotifyCodeForTokens } from "@/services/spotify/auth-service";

// Handles Spotify OAuth callback, exchanges code for tokens, saves connection, and redirects.
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const code = searchParams.get("code");
		const sessionId = searchParams.get("state");

		// If missing, return 400 with JSON error
		if (!code || !sessionId) {
			return errorResponse(
				new APIError({
					error: "bad_request",
					message: "Missing code or session",
					status: 400,
				}),
			);
		}

		await exchangeSpotifyCodeForTokens({ code, sessionId });

		// Redirect to homepage after success
		return NextResponse.redirect(new URL("/copy", req.url));
	} catch (err) {
		// TODO: Log this in Sentry probably
		console.error("Spotify OAuth callback error:", err);
		return errorResponse(err);
	}
}
