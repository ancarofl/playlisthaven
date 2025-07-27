import { PlatformKey } from "@/constants/platforms";
import { oauthStatusController } from "@/controllers/oauth/status-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { MissingSessionError } from "@/helpers/errors";
import { errorResponse, successResponse } from "@/helpers/json-response";
import { buildOauthUrl } from "@/helpers/oauth-url";

// Check oauth connection status for a given provider, and if not connected, return the url where the ouath connection can be initiated
export async function GET(_: Request, { params }: { params: { provider: PlatformKey } }) {
	try {
		const { provider } = params;
		const sessionId = await getSessionIdFromCookies();
		if (!sessionId) throw new MissingSessionError();

		const result = await oauthStatusController(sessionId, provider);

		let response = { ...result };

		// If not connected, add oauthUrl
		// The sessionId check is kinda redundant cuz the controller throws if it's missing... but keep it for clarity/safety...
		if (!result.connected && sessionId) {
			response = {
				...result,
				...buildOauthUrl(sessionId, provider),
			};
		}

		return successResponse(response);
	} catch (err) {
		return errorResponse(err);
	}
}
