import { cookies } from "next/headers";

import { COOKIE_NAME } from "@/constants";

export async function getSessionIdFromCookies(): Promise<string | undefined> {
	// This is async: https://nextjs.org/docs/app/api-reference/functions/cookies
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_NAME)?.value;
}
