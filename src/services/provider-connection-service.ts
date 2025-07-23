import { PlatformKey } from "@/constants/platforms";
import { UserConnection } from "@/generated/prisma";
import { prisma } from "@/lib/db";

// TODO: Do I want destructured arguments or positional? Destructured is safer but SO MUCH DAMN CODE
type GetConnectionStatusArgs = {
	provider: PlatformKey;
	guestSessionId: string;
};

type GetConnectionForUserArgs = {
	sessionId: string;
	provider: PlatformKey;
};

type SaveConnectionTokensArgs = {
	sessionId: string;
	provider: PlatformKey;
	accessToken: string;
	refreshToken: string;
	expiresAt?: Date;
};

export async function getConnectionStatus({ provider, guestSessionId }: GetConnectionStatusArgs): Promise<boolean> {
	const connection = await prisma.userConnection.findFirst({
		where: { provider, guestSessionId },
	});

	return !!connection; // true if found, false if not found. !! turns anything truthy into true, anything falsy into false
}

export async function getConnectionForUser({
	sessionId,
	provider,
}: GetConnectionForUserArgs): Promise<UserConnection | null> {
	return prisma.userConnection.findFirst({
		where: { provider, guestSessionId: sessionId },
	});
}

// Also return the connection?
export async function saveConnectionTokens({
	sessionId,
	provider,
	accessToken,
	refreshToken,
	expiresAt,
}: SaveConnectionTokensArgs) {
	// Update or create GuestSession
	await prisma.guestSession.upsert({
		// upsert = Laravel's updateOrCreate basically
		where: { id: sessionId },
		update: {},
		create: { id: sessionId },
	});

	// TODO: Encrypt tokens :D
	// If connection exists, UPDATE tokens and expiresAt (if expiresAt exists, might not depending on the provider). Else, CREATE a new connection
	await prisma.userConnection.upsert({
		where: {
			guestSessionId_provider: {
				guestSessionId: sessionId,
				provider,
			},
		},
		update: {
			accessToken,
			refreshToken,
			expiresAt: expiresAt ?? null,
		},
		create: {
			provider,
			accessToken,
			refreshToken,
			expiresAt: expiresAt ?? null,
			guestSession: { connect: { id: sessionId } },
		},
	});
}
