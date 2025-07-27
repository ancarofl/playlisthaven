import { NextResponse } from "next/server";

import { oauthCallbackController } from "@/controllers/oauth/callback-controller";
import { debugLogGreen } from "@/helpers/debug-log";
import { BadRequestError } from "@/helpers/errors";
import { errorResponse } from "@/helpers/json-response";
import { OauthCallbackParams } from "@/types/oauth";

export async function GET(req: Request, { params }: { params: { provider: string } }) {
	debugLogGreen("###### DEBUG - CALLBACK ROUTE");

	try {
		const { provider } = params;
		const url = new URL(req.url);

		const code = url.searchParams.get("code");
		const sessionId = url.searchParams.get("state");

		if (!code || !sessionId) {
			return errorResponse(new BadRequestError("Missing code or session."));
		}

		const oauthParams: OauthCallbackParams = { code, sessionId };

		await oauthCallbackController(provider, oauthParams);

		// Redirect to copy page after success. TODO: Always redirect there? Should depend on the source of the oauth no? FOR NOW it's only copy
		// TODO: Should I care about the session here? PROBABLY?!
		return NextResponse.redirect(new URL("/copy", req.url));
	} catch (err) {
		return errorResponse(err);
	}
}
