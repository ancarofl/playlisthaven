import { NextResponse } from "next/server";

import { APIError } from "@/lib/errors";
import { errorResponse } from "@/lib/json-response";
import { exchangeYouTubeCodeForTokens } from "@/services/youtube/oauth-service";

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

		await exchangeYouTubeCodeForTokens({ code, sessionId });

		// Redirect to homepage after success
		return NextResponse.redirect(new URL("/copy", req.url));
	} catch (err) {
		// TODO: Log this in Sentry probably
		console.error("YouTube OAuth callback error:", err);
		return errorResponse(err);
	}
}
