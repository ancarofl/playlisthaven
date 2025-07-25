import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getYouTubeAuthUrl } from "@/lib/api/youtube";

// TODO
export async function GET() {
	const sessionId = (await cookies()).get("playlisthaven_guest_session")?.value;
	if (!sessionId) return new Response("No session", { status: 401 });

	const authUrl = getYouTubeAuthUrl(sessionId);
	return NextResponse.redirect(authUrl);
}
