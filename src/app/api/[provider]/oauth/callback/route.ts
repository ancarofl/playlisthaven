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

		// Redirect to copy page after success. TODO: Always redirect there? Should depend on the source of the oauth no? FOR NOW it's only copy
		// TODO: Should I care about the session here? PROBABLY?!
		return NextResponse.redirect(new URL("/copy", req.url));
	} catch (err) {
		return errorResponse(err);
	}
}
