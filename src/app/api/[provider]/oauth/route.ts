import { NextResponse } from "next/server";

import { oauthAuthorizationUrlController } from "@/controllers/oauth/authorization-url-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { errorResponse } from "@/helpers/json-response";

// Initate the oauth flow: generate the authorization URL for the given provider and redirect the client to it
export async function GET(_: Request, { params }: { params: { provider: string } }) {
	try {
		const sessionId = await getSessionIdFromCookies();
		const oauthUrl = await oauthAuthorizationUrlController(params.provider, sessionId);

		return NextResponse.redirect(oauthUrl);
	} catch (err) {
		return errorResponse(err);
	}
}
