import { NextRequest, NextResponse } from "next/server";

import { guestSessionMiddleware } from "./helpers/middlewares/guest-session";

export function middleware(req: NextRequest) {
	// Start with the default response
	let res = NextResponse.next();

	// Apply guest session logic = set cookie if missing
	res = guestSessionMiddleware(req, res);

	// res = rateLimitMiddleware(req, res);

	return res;
}

export const config = {
	// Apply middleware to all routes EXCEPT API, static files, image optimization, and favicon
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
