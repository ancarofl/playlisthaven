import { cookies } from "next/headers";

import { COOKIE_NAME } from "@/constants/constants";
import { PlatformKey } from "@/constants/platforms";
import { MissingSessionError } from "@/lib/errors";
import { getConnectionStatus } from "@/services/connection";

export async function GET(_: Request, { params }: { params: { provider: PlatformKey } }) {
	try {
		// This is async: https://nextjs.org/docs/app/api-reference/functions/cookies
		const cookieStore = await cookies();
		const sessionId = cookieStore.get(COOKIE_NAME)?.value;

		/* If no guest session found, then either there is an unlikely bug/issue OR the user has blocked cookies.
		So throw custom MissingSessionError and handle it in the FE, assuming the latter is the case. */
		if (!sessionId) {
			throw new MissingSessionError();
		}

		// If a guest session is found, check if a connection already exists for this session + provider combo
		const isConnected = await getConnectionStatus({
			provider: params.provider,
			guestSessionId: sessionId,
		});

		/* TODO: This exposes the user's sessionId. Think about caveats(but it's a pretty accepted pattern).
		The actual authentication happens via the cookie, which is secure, so this setup should be fine... */
		return Response.json({
			connected: isConnected,
			...(isConnected ? {} : { authUrl: `/api/oauth/${params.provider}?state=${sessionId}` }), // add authUrl to the response obj only if not already connected
		});
	} catch (err) {
		// TODO: Improve these disaster errs
		if (err instanceof MissingSessionError) {
			return Response.json(
				{
					error: err.code.toLowerCase(),
					code: err.code,
					message: err.message,
				},
				{ status: err.status },
			);
		}
		// Fallback for unhandled errors
		return Response.json(
			{
				error: "internal_error",
				code: "INTERNAL_ERROR",
				message: "Something went wrong.",
			},
			{ status: 500 },
		);
	}
}
