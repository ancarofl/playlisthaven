// TODO: Validation later
/* export interface ConnectionData {
	connected?: boolean;
	oauthUrl?: string;
}

export interface ConnectionResponse {
	data?: ConnectionData;
	message?: string;
	error?: string;
}
 */
export interface OauthCallbackParams {
	code: string;
	sessionId: string;
}

export interface OauthService {
	getAuthorizationUrl(state: StateObj): string;
	exchangeCodeForTokens(args: { code: string; sessionId: string }): Promise<void>; // Function which performs side effects and resolves with no meaningful value, hence <void> // TODO: Can it be improved?
}

export interface StateObj {
	sessionId: string;
	type: "source" | "target";
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresAt?: Date;
}
