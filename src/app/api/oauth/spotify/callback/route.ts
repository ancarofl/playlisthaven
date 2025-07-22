import { NextResponse } from "next/server";

import { saveConnectionTokens } from "@/services/connection";

// TODO
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");
	const sessionId = searchParams.get("state");

	if (!code || !sessionId) {
		return new Response("Missing code or session", { status: 400 });
	}

	const res = await fetch("https://accounts.spotify.com/api/token", {
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
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
		}),
	});

	const data = await res.json();
	if (!res.ok) return NextResponse.json(data, { status: 400 });

	await saveConnectionTokens({
		sessionId,
		provider: "spotify",
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: new Date(Date.now() + data.expires_in * 1000),
	});

	return NextResponse.redirect(new URL("/", req.url));
}
