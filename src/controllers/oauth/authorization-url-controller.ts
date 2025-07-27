import { MissingSessionError, UnsupportedProviderError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";

export async function oauthAuthorizationUrlController(provider: string, sessionId?: string): Promise<string> {
	if (!sessionId) {
		throw new MissingSessionError();
	}

	const service = oauthServices[provider];
	if (!service) {
		throw new UnsupportedProviderError(`OAuth provider '${provider}' is not supported.`);
	}

	return service.getAuthorizationUrl(sessionId);
}
