import { cookies } from "next/headers";

import { APIError } from "@/helpers/errors";
import { oauthServices } from "@/services/oauth";
import { OauthService } from "@/types/oauth";

export async function oauthAuthorizationUrlController(provider: string): Promise<string> {
	const service: OauthService = oauthServices[provider];
	if (!service) {
		throw new APIError({
			error: "unsupported_provider",
			message: `Oauth provider '${provider}' is not supported`,
			status: 400, // TODO
		});
	}

	const cookieStore = await cookies();
	const sessionId = cookieStore.get("playlisthaven_guest_session")?.value;

	if (!sessionId) {
		throw new APIError({
			error: "no_session",
			message: "No session found",
			status: 401, // TODO
		});
	}

	return service.getAuthorizationUrl(sessionId);
}
