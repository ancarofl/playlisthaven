import { UnsupportedProviderError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";
import { OauthService, StateObj } from "@/types/oauth";

// Return oauth authorization URL generation using the specified provider's service
export async function oauthAuthorizationUrlController(provider: string, stateObj: StateObj): Promise<string> {
	const service: OauthService | undefined = oauthServices[provider];
	if (!service) {
		throw new UnsupportedProviderError(`OAuth provider '${provider}' is not supported.`);
	}

	return service.getAuthorizationUrl(stateObj);
}
