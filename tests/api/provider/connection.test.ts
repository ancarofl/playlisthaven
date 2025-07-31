import { errorToResponse } from "@tests/helpers/error-to-response";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/[provider]/connection/route";
import { PlatformKey } from "@/constants/platforms";
import * as oauthController from "@/controllers/oauth/status-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { InternalServerError, MissingSessionError, UnsupportedProviderError } from "@/helpers/errors";
import * as buildOauthUrlModule from "@/helpers/oauth/build-url";

// Mock module at the top level. This is hoisted by Vitest
vi.mock("@/helpers/cookies");

type TestCase = {
	description: string;
	provider: string;
	expectedStatus: number;
	expectedBody: object;
	mockSessionId: string | undefined;
};

const testCases: TestCase[] = [
	{
		description: "an unsupported provider",
		provider: "unsupporteddproviderhehexd",
		expectedStatus: 400,
		expectedBody: errorToResponse(new UnsupportedProviderError()),
		mockSessionId: "mock-session-id",
	},
	{
		description: "undefined session id",
		provider: "spotify",
		expectedStatus: 401,
		expectedBody: errorToResponse(new MissingSessionError()),
		mockSessionId: undefined, // cannot use null. small reminder: undefined = not assigned a value, null = explicitly assigned "no value"
	},
];

describe("GET /api/[provider]/connection", () => {
	beforeEach(() => {
		// Clear mocks before each test to avoid leakage
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Restore all spies/mocks to their original implementation after each test
		/* If I don't do this, the mocked implementation is used in subsequent tests, which I do not want
		There's an argument to be made for using the mock controller in all the tests but I am not sure about it yet. */
		vi.restoreAllMocks();
	});

	it("should return status 200 without oauthUrl for a supported provider spotify with connected true", async () => {
		// Arrange
		vi.mocked(getSessionIdFromCookies).mockResolvedValue("mock-session-id");
		vi.spyOn(oauthController, "oauthStatusController").mockResolvedValue({ connected: true });

		// Spy on buildOauthUrl to verify it is NOT called
		const spy = vi.spyOn(buildOauthUrlModule, "buildOauthUrl");

		const request = new Request("https://example.com/api/spotify/connection");
		const params = { provider: "spotify" as PlatformKey };

		// Act
		const response = await GET(request, { params });
		const json = await response.json();

		// Assert
		expect(response.status).toBe(200);
		expect(json.success).toBe(true);
		expect(json.data.connected).toBe(true);
		expect(json.data.oauthUrl).toBeUndefined();
		expect(spy).not.toHaveBeenCalled();

		// Cleanup
		// Restore original buildOauthUrlModule implementation after test - not needed cuz all are restored in afterEach instead
		// This wouldn't have been enough on its own, cuz it wouldn't restore oauthController implementation
		// spy.mockRestore();
	});

	// TODO: Mock the controller so it's really an isolated unit test?
	it("should return status 200 with oauthUrl for a supported provider spotify with connected false", async () => {
		// Arrange
		vi.mocked(getSessionIdFromCookies).mockResolvedValue("mock-session-id");

		// Spy on buildOauthUrl to verify it's called
		const spy = vi.spyOn(buildOauthUrlModule, "buildOauthUrl");

		const request = new Request("https://example.com/api/spotify/connection");
		const params = { provider: "spotify" as PlatformKey };

		// Act
		const response = await GET(request, { params });
		const json = await response.json();

		// Assert
		expect(response.status).toBe(200);
		expect(json).toEqual({
			success: true,
			data: {
				connected: false,
				oauthUrl: "/api/spotify/oauth/?state=mock-session-id",
			},
		});
		expect(spy).toHaveBeenCalled();
	});

	// The main benefit of it versus foreach is that if 1 test fails the rest still run!
	it.each(testCases)(
		"should return status $expectedStatus for $description",
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

	it("should return status 500 for unexpected errors", async () => {
		// Arrange
		vi.mocked(getSessionIdFromCookies).mockResolvedValue("mock-session-id");

		const request = new Request("https://example.com/api/spotify/connection");
		const params = { provider: "spotify" as PlatformKey };

		// Mock oauthStatusController only in this test
		const spy = vi.spyOn(oauthController, "oauthStatusController").mockRejectedValue(new Error("Unexpected error."));

		// Act
		const response = await GET(request, { params });
		const json = await response.json();

		// Assert
		expect(response.status).toBe(500);
		expect(json).toEqual(errorToResponse(new InternalServerError()));

		// Cleanup
		// spy.mockRestore(); // restore original implementation after test - not needed cuz done in afterEach
	});
});
