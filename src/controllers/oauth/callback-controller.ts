import { UnsupportedProviderError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";
import { OauthCallbackParams, OauthService } from "@/types/oauth";

export async function oauthCallbackController(provider: string, params: OauthCallbackParams): Promise<void> {
	const { code, sessionId } = params;

	const service: OauthService | undefined = oauthServices[provider];
	if (!service) {
		throw new UnsupportedProviderError(`OAuth provider '${provider}' is not supported.`);
	}

	await service.exchangeCodeForTokens({ code, sessionId });
}
