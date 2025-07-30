import { errorToResponse } from "@tests/helpers/error-to-response";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/[provider]/connection/route";
import { PlatformKey } from "@/constants/platforms";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { MissingSessionError, UnsupportedProviderError } from "@/helpers/errors";

// Mock module at the top level. This is hoisted by Vitest
vi.mock("@/helpers/cookies");

type TestCase = {
	description: string;
	provider: string;
	expectedStatus: number;
	expectedBody: object;
	mockSessionId: string | undefined;
	type: string;
};

const testCases: TestCase[] = [
	{
		description: "a supported provider spotify",
		provider: "spotify",
		expectedStatus: 200,
		expectedBody: {
			success: true,
			data: {
				connected: false,
				oauthUrl: "/api/spotify/oauth/?state=mock-session-id",
			},
		},
		mockSessionId: "mock-session-id", // getSessionIdFromCookies returns undefined when no session (not null)
		type: "success",
	},
	{
		description: "an unsupported provider",
		provider: "unsupporteddproviderhehexd",
		expectedStatus: 400,
		expectedBody: errorToResponse(new UnsupportedProviderError()),
		mockSessionId: "mock-session-id",
		type: "error",
	},
	{
		description: "undefined session id",
		provider: "spotify",
		expectedStatus: 401,
		expectedBody: errorToResponse(new MissingSessionError()),
		mockSessionId: undefined, // cannot use null. small reminder: undefined = not assigned a value, null = explicitly assigned "no value"
		type: "error",
	},
];

describe("GET /api/[provider]/connection", () => {
	beforeEach(() => {
		// Clear mocks before each test to avoid leakage
		vi.clearAllMocks();
	});

	// The main benefit of it versus foreach is that if 1 test fails the rest still run!
	it.each(testCases)(
		"should return $type status $expectedStatus for $description",
		async ({ expectedStatus, provider, expectedBody, mockSessionId }) => {
			// Arrange
			vi.mocked(getSessionIdFromCookies).mockResolvedValue(mockSessionId);

			const request = new Request(`https://example.com/api/${provider}/connection`);
			const params = { provider: provider as PlatformKey };

			// Act
			const response = await GET(request, { params });
			const json = await response.json();

			// Assert
			expect(response.status).toBe(expectedStatus);
			expect(json).toEqual(expectedBody);
		},
	);

	// TODO: Add a test for unexpected errors? Maybe better for future safety?
});
