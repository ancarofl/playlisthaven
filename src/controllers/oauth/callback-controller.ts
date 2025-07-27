import { APIError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";
import { OauthService } from "@/types/oauth";

export async function oauthCallbackController(provider: string, searchParams: URLSearchParams): Promise<void> {
	const service: OauthService | undefined = oauthServices[provider];
	if (!service) {
		throw new APIError({
			error: "unsupported_provider",
			message: `Oauth provider '${provider}' is not supported`,
			status: 400,
		});
	}

	const code = searchParams.get("code");
	const sessionId = searchParams.get("state");

	// If missing, return 400 with JSON error
	if (!code || !sessionId) {
		throw new APIError({
			error: "bad_request",
			message: "Missing code or session",
			status: 400,
		});
	}

	await service.exchangeCodeForTokens({ code, sessionId });
}
