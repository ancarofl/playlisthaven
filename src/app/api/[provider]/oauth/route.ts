import { NextResponse } from "next/server";

import { oauthAuthorizationUrlController } from "@/controllers/oauth/authorization-url-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { BadRequestError, MissingSessionError } from "@/helpers/errors";
import { errorResponse } from "@/helpers/json-response";

// Initate the oauth flow: generate the authorization URL for the given provider and redirect the client to it
export async function GET(req: Request, { params }: { params: { provider: string } }) {
	try {
		const sessionId = await getSessionIdFromCookies();
		if (!sessionId) throw new MissingSessionError();

		const url = new URL(req.url);
		const type = url.searchParams.get("type");
		if (type !== "source" && type !== "target") {
			throw new BadRequestError("Missing or invalid 'type' query parameter.");
		}

		const oauthUrl = await oauthAuthorizationUrlController(params.provider, { sessionId, type });

		return NextResponse.redirect(oauthUrl);
	} catch (err) {
		return errorResponse(err);
	}
}
