import { NextResponse } from "next/server";

import { oauthAuthorizationUrlController } from "@/controllers/oauth/authorization-url-controller";
import { errorResponse } from "@/helpers/json-response";

// Initate the oauth flow: generate the authorization URL for the given provider and redirect the client to it
export async function GET(_: Request, { params }: { params: { provider: string } }) {
	try {
		const oauthUrl = await oauthAuthorizationUrlController(params.provider);
		return NextResponse.redirect(oauthUrl);
	} catch (err) {
		return errorResponse(err);
	}
}
