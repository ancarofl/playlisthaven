import { BadRequestError, UnsupportedProviderError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";
import { OauthService } from "@/types/oauth";

export async function oauthCallbackController(provider: string, searchParams: URLSearchParams): Promise<void> {
	const service: OauthService | undefined = oauthServices[provider];
	if (!service) {
		throw new UnsupportedProviderError(`OAuth provider '${provider}' is not supported.`);
	}

	// TODO: Extract to helper if it'll be reused, wait and see
	const code = searchParams.get("code");
	const sessionId = searchParams.get("state");

	if (!code || !sessionId) {
		throw new BadRequestError("Missing code or session.");
	}

	await service.exchangeCodeForTokens({ code, sessionId });
}
