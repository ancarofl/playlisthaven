import { PlatformKey } from "@/constants/platforms";
import { MissingSessionError } from "@/helpers/errors";
import { getConnectionStatus } from "@/services/provider-connection-service";

// RESTful API design dictates to always return a JSON object, not a primitive value. So let's do that
type OauthStatus = { connected: boolean };

export async function oauthStatusController(
	sessionId: string | undefined,
	provider: PlatformKey,
): Promise<OauthStatus> {
	/* If no guest session found, then either there is a bug/issue OR the user has blocked cookies.
	So throw custom MissingSessionError and handle it in the FE(for now, assuming the latter is the case). */
	if (!sessionId) throw new MissingSessionError();

	// If a guest session is found, check if a connection exists for this session + provider combo
	const isConnected = await getConnectionStatus({
		provider,
		guestSessionId: sessionId,
	});

	return { connected: isConnected };
}
