import { cookies } from "next/headers";

import { COOKIE_NAME } from "@/constants";
import { PlatformKey } from "@/constants/platforms";
import { providerAuthStatusController } from "@/controllers/provider-auth-status-controller";
import { providerAuthUrlController } from "@/controllers/provider-auth-url-controller";
import { errorResponse, successResponse } from "@/lib/json-response";

export async function GET(_: Request, { params }: { params: { provider: PlatformKey } }) {
	try {
		// This is async: https://nextjs.org/docs/app/api-reference/functions/cookies
		const cookieStore = await cookies();
		const sessionId = cookieStore.get(COOKIE_NAME)?.value;

		const result = await providerAuthStatusController(sessionId, params.provider);

		let response = { ...result };

		// If not connected, delegate authUrl creation to the controller
		if (!result.connected && sessionId) {
			response = {
				...result,
				...providerAuthUrlController(sessionId, params.provider),
			};
		}

		return successResponse(response);
	} catch (err) {
		return errorResponse(err);
	}
}
