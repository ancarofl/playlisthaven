import { NextResponse } from "next/server";

import { PlatformKey, PLATFORMS } from "@/constants/platforms";
import { oauthAuthorizationUrlController } from "@/controllers/oauth/authorization-url-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { BadRequestError, MissingSessionError, UnsupportedProviderError } from "@/helpers/errors";
import { errorResponse } from "@/helpers/json-response";

// Initate the oauth flow: generate the authorization URL for the given provider and redirect the client to it
export async function GET(req: Request, { params }: { params: { provider: PlatformKey } }) {
	try {
		const { provider } = params;
		// TODO: Extract into helper/validator
		if (!PLATFORMS.some((platform) => platform.key === provider)) {
			return errorResponse(new UnsupportedProviderError());
		}

		const url = new URL(req.url);
		const type = url.searchParams.get("type");
		if (type !== "source" && type !== "target") {
			throw new BadRequestError("Missing or invalid 'type' query parameter.");
		}

		const sessionId = await getSessionIdFromCookies();
		if (!sessionId) throw new MissingSessionError();

		const oauthUrl = await oauthAuthorizationUrlController(provider, { sessionId, type });

		return NextResponse.redirect(oauthUrl);
	} catch (err) {
		return errorResponse(err);
	}
}
