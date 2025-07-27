import { NextResponse } from "next/server";

import { oauthCallbackController } from "@/controllers/oauth/callback-controller";
import { debugLogGreen } from "@/helpers/debug-log";
import { errorResponse } from "@/helpers/json-response";

export async function GET(req: Request, { params }: { params: { provider: string } }) {
	debugLogGreen("###### DEBUG - CALLBACK ROUTE");

	try {
		const { provider } = params;
		const { searchParams } = new URL(req.url);

		await oauthCallbackController(provider, searchParams);

		// Redirect to copy page after success
		console.log(`Redirect in ${`provider`}/oauth/callback`);
		return NextResponse.redirect(new URL("/copy", req.url));
	} catch (err) {
		// TODO: Log this in Sentry probably
		console.error(`${params.provider} Oauth callback error:`, err);
		return errorResponse(err);
	}
}
