import { NextResponse } from "next/server";

import { oauthCallbackController } from "@/controllers/oauth/callback-controller";
import { debugLogGreen } from "@/helpers/debug-log";
import { BadRequestError } from "@/helpers/errors";
import { errorResponse } from "@/helpers/json-response";
import { OauthCallbackParams, StateObj } from "@/types/oauth";

export async function GET(req: Request, { params }: { params: { provider: string } }) {
	debugLogGreen("###### DEBUG - CALLBACK ROUTE");

	try {
		const { provider } = params;
		const url = new URL(req.url);

		const code = url.searchParams.get("code");
		const stateParam = url.searchParams.get("state");

		if (!code || !stateParam) {
			throw new BadRequestError("Missing code or state.");
		}

		const stateObj = JSON.parse(decodeURIComponent(stateParam)) as StateObj;

		const oauthParams: OauthCallbackParams = { code, sessionId: stateObj.sessionId };

		await oauthCallbackController(provider, oauthParams);

		// Redirect to copy page after success with provider and type params. TODO: Always redirect there? Should depend on the source of the oauth no? FOR NOW it's only copy
		// TODO: Should I care about the session here? PROBABLY?!
		const redirectUrl = new URL("/copy", req.url);
		redirectUrl.searchParams.set("connectedProvider", provider);
		redirectUrl.searchParams.set("connectedType", stateObj.type);

		return NextResponse.redirect(redirectUrl);
	} catch (err) {
		return errorResponse(err);
	}
}
