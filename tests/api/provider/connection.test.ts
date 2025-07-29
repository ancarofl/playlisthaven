import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/[provider]/connection/route";
import { PlatformKey } from "@/constants/platforms";
import * as cookiesHelper from "@/helpers/cookies";

// Mock the getSessionIdFromCookies helper
vi.mock("@/helpers/cookies", () => ({
	getSessionIdFromCookies: vi.fn(),
}));

describe("GET /api/[provider]/connection", () => {
	beforeEach(() => {
		// Clear mocks before each test to avoid leakage
		vi.clearAllMocks();
	});

	it("returns a successful response with valid provider spotify", async () => {
		// Arrange
		vi.mocked(cookiesHelper.getSessionIdFromCookies).mockResolvedValue("mock-session-id");

		const dummyRequest = new Request("https://example.com/api/spotify/connection");
		const dummyParams: { provider: PlatformKey } = { provider: "spotify" };

		// Act
		const response = await GET(dummyRequest, { params: dummyParams });

		// Assert
		expect(response.status).toBe(200);
		expect(response).toHaveProperty("json");

		const json = await response.json();

		expect(json).toEqual({
			success: true,
			data: {
				connected: false,
				oauthUrl: "/api/spotify/oauth/?state=mock-session-id",
			},
		});
	});

	it("returns 400 UnsupportedProviderError for unsupported provider", async () => {
		// Arrange
		const dummyRequest = new Request("https://example.com/api/invalidprovider/connection");
		// Bypass TS check since invalid provider is intentional for this test. TODO: Other nicer options...?
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dummyParams = { provider: "invalidprovider" } as any;

		// Act
		const response = await GET(dummyRequest, { params: dummyParams });
		const json = await response.json();

		// Assert. TODO: Helper for error asserts
		expect(response.status).toBe(400);
		expect(json).toHaveProperty("error", "unsupported_provider");
		expect(json).toHaveProperty("message", "Unsupported OAuth provider.");
	});
});
