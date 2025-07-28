import { PlatformKey } from "@/constants/platforms";
import { getConnectionStatus } from "@/services/provider-connection-service";

// RESTful API design dictates to always return a JSON object, not a primitive value. So let's do that
type OauthStatus = { connected: boolean };

// Check if a connection exists for the guest session + provider combo
export async function oauthStatusController(sessionId: string, provider: PlatformKey): Promise<OauthStatus> {
	const isConnected = await getConnectionStatus({
		provider,
		guestSessionId: sessionId,
	});

	return { connected: isConnected };
}
