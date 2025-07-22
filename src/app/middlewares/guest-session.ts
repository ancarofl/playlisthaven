import { NextRequest, NextResponse } from "next/server";

export function guestSessionMiddleware(req: NextRequest, res: NextResponse): NextResponse {
	const COOKIE_NAME = "playlisthaven_guest_session";

	// Check if the guest session cookie already exists
	const existingCookie = req.cookies.get(COOKIE_NAME);

	if (!existingCookie) {
		// If not, generate a new session ID
		const guestSessionId = crypto.randomUUID();

		// Set the guest session cookie with appropriate flags
		res.cookies.set({
			name: COOKIE_NAME,
			value: guestSessionId,
			maxAge: 60 * 60 * 24, // s * m * h. 1 day (in seconds). Better option than expires, where you set an exact expiration date/time
			path: "/", // Cookie applies to entire site. This is also the default, but typing it for clarity
			secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
			httpOnly: true, // Prevent JS access (for security)
			/* When and how cokies are sent in cross-site requests. 
			Prevent CSRF. 
			TODO: Might need to change this for OAuth! 
			TODO: This is also not sent if the protocol differs, not sure if I care about that? 
			HAD TO BE CHANGED FOR OAUTH YES. HAVE ANOTHER LOOK. HOW DOES IT DIFFER IF MODAL OR STH? */
			sameSite: "lax",
		});
	}

	return res;
}
