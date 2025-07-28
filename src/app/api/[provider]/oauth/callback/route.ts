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

		// Extract url params
		const url = new URL(req.url);
		const code = url.searchParams.get("code");
		const stateParam = url.searchParams.get("state");
		if (!code || !stateParam) {
			throw new BadRequestError("Missing code or state.");
		}

		// Decode and parse state parameter safely
		let stateObj: StateObj;
		try {
			stateObj = JSON.parse(decodeURIComponent(stateParam));
		} catch {
			throw new BadRequestError("Invalid state parameter format.");
		}

		const oauthParams: OauthCallbackParams = { code, sessionId: stateObj.sessionId };

		await oauthCallbackController(provider, oauthParams);

		// Build redirect to copy page after success with provider and type params. TODO: Always redirect there? Should depend on the initializer of the oauth no? FOR NOW the only initializer is quick copy
		// TODO: Should I care about the session here? PROBABLY?!
		const redirectUrl = new URL("/copy", req.url);
		redirectUrl.searchParams.set("connectedProvider", provider);
		redirectUrl.searchParams.set("connectedType", stateObj.type);

		return NextResponse.redirect(redirectUrl);
	} catch (err) {
		return errorResponse(err);
	}
}
