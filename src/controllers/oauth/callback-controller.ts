import { UnsupportedProviderError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";
import { OauthCallbackParams, OauthService } from "@/types/oauth";

// Handle oauth callback process by exchanging the authorization code for tokens using the specified provider's service
export async function oauthCallbackController(provider: string, params: OauthCallbackParams): Promise<void> {
	const { code, sessionId } = params;

	const service: OauthService | undefined = oauthServices[provider];
	if (!service) {
		throw new UnsupportedProviderError(`OAuth provider '${provider}' is not supported.`);
	}

	await service.exchangeCodeForTokens({ code, sessionId });
}
