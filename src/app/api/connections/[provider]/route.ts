import { cookies } from "next/headers";

import { COOKIE_NAME } from "@/constants/constants";
import { PlatformKey } from "@/constants/platforms";
import { providerAuthStatusController } from "@/controllers/provider-auth-status-controller";
import { providerAuthUrlController } from "@/controllers/provider-auth-url-controller";
import { APIError, InternalServerError } from "@/lib/errors";
import { errorResponse } from "@/utils/api";

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

		return Response.json(response);
	} catch (err) {
		if (err instanceof APIError) {
			return errorResponse(err);
		}
		return errorResponse(new InternalServerError());
	}
}
