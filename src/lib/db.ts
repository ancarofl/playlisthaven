import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/* Singleton Prisma Client.
Without this this pattern, every reload would create a new PrismaClient, eventually hitting max DB connections.
This survives hot reloads. 
See https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient. */
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ["query"], // logs every SQL query sent to the DB
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
