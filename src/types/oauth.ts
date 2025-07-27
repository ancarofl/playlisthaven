export interface OauthCallbackParams {
	code: string;
	sessionId: string;
}

export interface OauthService {
	getAuthorizationUrl(state: string): string;
	exchangeCodeForTokens(args: { code: string; sessionId: string }): Promise<void>; // Function which performs side effects and resolves with no meaningful value, hence <void> // TODO: Can it be improved?
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresAt?: Date;
}
