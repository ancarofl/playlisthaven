import { errorToResponse } from "@tests/helpers/error-to-response";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/[provider]/oauth/callback/route";
import { PlatformKey } from "@/constants/platforms";
import * as oauthCallbackControllerModule from "@/controllers/oauth/callback-controller";
import { BadRequestError, InternalServerError } from "@/helpers/errors";

type TestCase = {
	description: string;
	provider: PlatformKey;
	code?: string;
	state?: string;
	expectedStatus: number;
	expectedBody: object;
	expectedControllerCall: boolean;
};

const successTestCases: TestCase[] = [
	{
		description: "valid callback with code and valid state (source type)",
		provider: "spotify",
		code: "auth-code-123",
		state: encodeURIComponent(JSON.stringify({ sessionId: "mock-session-id", type: "source" })),
		expectedStatus: 307,
		expectedBody: {}, // no JSON body on redirect
		expectedControllerCall: true,
	},
	{
		description: "valid callback with code and valid state (target type)",
		provider: "spotify",
		code: "auth-code-456",
		state: encodeURIComponent(JSON.stringify({ sessionId: "mock-session-id", type: "target" })),
		expectedStatus: 307,
		expectedBody: {}, // no JSON body on redirect
		expectedControllerCall: true,
	},
];

const errorTestCases: TestCase[] = [
	{
		description: "missing code param",
		provider: "spotify",
		state: encodeURIComponent(JSON.stringify({ sessionId: "mock-session-id", type: "source" })),
		expectedStatus: 400,
		expectedBody: errorToResponse(new BadRequestError("Missing code or state.")),
		expectedControllerCall: false,
	},
	{
		description: "missing state param",
		provider: "spotify",
		code: "auth-code-123",
		expectedStatus: 400,
		expectedBody: errorToResponse(new BadRequestError("Missing code or state.")),
		expectedControllerCall: false,
	},
	{
		description: "invalid JSON state param",
		provider: "spotify",
		code: "auth-code-123",
		state: encodeURIComponent("not-a-json"),
		expectedStatus: 400,
		expectedBody: errorToResponse(new BadRequestError("Invalid state parameter format.")),
		expectedControllerCall: false,
	},
];

describe("GET /api/[provider]/oauth/callback", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it.each(successTestCases)(
		"should redirect with status $expectedStatus for $description",
		async ({ provider, code, state, expectedStatus, expectedControllerCall }) => {
			// Arrange
			const urlStr = `https://example.com/api/${provider}/oauth/callback?code=${code}&state=${state}`;
			const req = new Request(urlStr);
			const params = { provider };

			const spy = vi.spyOn(oauthCallbackControllerModule, "oauthCallbackController").mockResolvedValue(undefined);

			// Act
			const response = await GET(req, { params });

			// Assert
			if (expectedControllerCall && code && state) {
				const parsedState = JSON.parse(decodeURIComponent(state));
				expect(spy).toHaveBeenCalledWith(provider, { code, sessionId: parsedState.sessionId });
			} else {
				expect(spy).not.toHaveBeenCalled();
			}
			expect(response.status).toBe(expectedStatus);
			if (expectedStatus === 307) {
				const location = response.headers.get("location");
				expect(location).toBeTruthy();
				if (location) {
					const redirectUrl = new URL(location);
					expect(redirectUrl.pathname).toBe("/copy");
					expect(redirectUrl.searchParams.get("connectedProvider")).toBe(provider);
					expect(redirectUrl.searchParams.get("connectedType")).toBe(
						JSON.parse(decodeURIComponent(state || "{}")).type,
					);
				}
			}
		},
	);

	it.each(errorTestCases)(
		"should return status $expectedStatus for $description",
		async ({ provider, code, state, expectedStatus, expectedBody, expectedControllerCall }) => {
			// Arrange
			const queryParams = new URLSearchParams();
			if (code) queryParams.append("code", code);
			if (state) queryParams.append("state", state);
			const urlStr = `https://example.com/api/${provider}/oauth/callback?${queryParams.toString()}`;
			const req = new Request(urlStr);
			const params = { provider };

			const spy = vi.spyOn(oauthCallbackControllerModule, "oauthCallbackController");

			// Act
			const response = await GET(req, { params });
			const json = await response.json();

			// Assert
			if (expectedControllerCall) {
				expect(spy).toHaveBeenCalled();
			} else {
				expect(spy).not.toHaveBeenCalled();
			}
			expect(response.status).toBe(expectedStatus);
			expect(json).toEqual(expectedBody);
		},
	);

	it("should return status 500 for unexpected errors", async () => {
		// Arrange
		const provider = "spotify" as PlatformKey;
		const sessionId = "mock-session-id";
		const type = "source";
		const code = "auth-code-123";
		const stateObj = { sessionId, type };
		const encodedState = encodeURIComponent(JSON.stringify(stateObj));

		const url = `https://example.com/api/${provider}/oauth/callback?code=${code}&state=${encodedState}`;
		const req = new Request(url);
		const params = { provider };

		vi.spyOn(oauthCallbackControllerModule, "oauthCallbackController").mockRejectedValue(new Error("Unexpected error"));

		// Act
		const response = await GET(req, { params });
		const json = await response.json();

		// Assert
		expect(response.status).toBe(500);
		expect(json).toEqual(errorToResponse(new InternalServerError()));
	});
});
