import { PlatformKey } from "@/constants/platforms";

export function buildOauthUrl(sessionId: string, provider: PlatformKey): { oauthUrl: string } {
	/* TODO: This exposes the user's sessionId. Think about caveats (but it's a pretty accepted pattern).
    The actual authentication happens via the cookie, which is secure, so this setup should be fine... */
	return {
		oauthUrl: `/api/${provider}/oauth/?state=${sessionId}`,
	};
}
