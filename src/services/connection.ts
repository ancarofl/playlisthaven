import { PlatformKey } from "@/constants/platforms";
import { prisma } from "@/lib/db";

// TODO: File name? Too vague?

export async function getConnectionStatus({
	provider,
	guestSessionId,
}: {
	provider: string;
	guestSessionId: string;
}): Promise<boolean> {
	const connection = await prisma.userConnection.findFirst({
		where: {
			provider,
			guestSessionId,
		},
	});

	return !!connection; // true if found, false if not found. !! turns anything truthy into true, anything falsy into false
}

export async function getConnectionForUser(sessionId: string, provider: PlatformKey) {
	return prisma.userConnection.findFirst({
		where: {
			provider,
			guestSessionId: sessionId,
		},
	});
}

export async function saveConnectionTokens({
	sessionId,
	provider,
	accessToken,
	refreshToken,
	expiresAt,
}: {
	sessionId: string;
	provider: PlatformKey;
	accessToken: string;
	refreshToken: string;
	expiresAt?: Date;
}) {
	// Create GuestSession if missing
	await prisma.guestSession.upsert({
		// upsert = createOrUpdate basically
		where: { id: sessionId },
		update: {},
		create: { id: sessionId },
	});

	const existing = await prisma.userConnection.findFirst({
		where: {
			guestSessionId: sessionId,
			provider,
		},
	});

	// TODO: Use upsert? Issue if provider null which it shouldn't be. Think about it but tbh it's fine like this probably
	// If connection exists, update tokens and expires at (if it too exists)
	if (existing) {
		return prisma.userConnection.update({
			where: { id: existing.id },
			data: {
				accessToken,
				refreshToken,
				expiresAt: expiresAt ?? null,
			},
		});
	}
	// Else create a new connection
	else {
		return prisma.userConnection.create({
			data: {
				provider,
				accessToken,
				refreshToken,
				expiresAt: expiresAt ?? null,
				guestSession: { connect: { id: sessionId } },
			},
		});
	}
}
