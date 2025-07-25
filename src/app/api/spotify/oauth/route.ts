import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSpotifyAuthUrl } from "@/lib/api/spotify";

// TODO
export async function GET() {
	const sessionId = (await cookies()).get("playlisthaven_guest_session")?.value;
	if (!sessionId) return new Response("No session", { status: 401 });

	const authUrl = getSpotifyAuthUrl(sessionId);
	return NextResponse.redirect(authUrl);
}
