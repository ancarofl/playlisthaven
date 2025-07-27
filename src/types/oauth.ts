export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresAt?: Date;
}

export interface OauthService {
	getAuthorizationUrl(state: string): string;
	exchangeCodeForTokens(args: { code: string; sessionId: string }): Promise<void>; // Function which performs side effects and resolves with no meaningful value, hence <void> // TODO: Can it be improved?
}
