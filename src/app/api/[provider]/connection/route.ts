import { PlatformKey, PLATFORMS } from "@/constants/platforms";
import { oauthStatusController } from "@/controllers/oauth/status-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { MissingSessionError, UnsupportedProviderError } from "@/helpers/errors";
import { errorResponse, successResponse } from "@/helpers/json-response";
import { buildOauthUrl } from "@/helpers/oauth/build-url";

// Check oauth connection status for a given provider, and if not connected, also return the url where the ouath connection can be initiated
export async function GET(_: Request, { params }: { params: { provider: PlatformKey } }) {
	try {
		const { provider } = params;
		// TODO: Extract intrao helper/validator
		if (!PLATFORMS.some((platform) => platform.key === provider)) {
			return errorResponse(new UnsupportedProviderError());
		}

		const sessionId = await getSessionIdFromCookies();
		if (!sessionId) throw new MissingSessionError();

		const result = await oauthStatusController(sessionId, provider);

		// Build response
		let response = { ...result };

		// If not connected, add oauthUrl
		if (!result.connected) {
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
