import { PlatformKey } from "@/constants/platforms";

export function providerAuthUrlController(sessionId: string, provider: PlatformKey): { authUrl: string } {
	/* TODO: This exposes the user's sessionId. Think about caveats (but it's a pretty accepted pattern).
    The actual authentication happens via the cookie, which is secure, so this setup should be fine... */
	return {
		authUrl: `/api/${provider}/oauth/?state=${sessionId}`,
	};
}
