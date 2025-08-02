import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/[provider]/oauth/route";
import { PlatformKey } from "@/constants/platforms";
import { oauthAuthorizationUrlController } from "@/controllers/oauth/authorization-url-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";

vi.mock("@/helpers/cookies");
vi.mock("@/controllers/oauth/authorization-url-controller");

describe("GET /api/[provider]/authorization", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should redirect to oauth URL for a supported provider spotify with type source", async () => {
		// Arrange
		vi.mocked(getSessionIdFromCookies).mockResolvedValue("mock-session-id");
		const mockOauthUrl =
			"https://accounts.spotify.com/authorize?client_id=mock_client_id&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=playlist-modify-public+playlist-modify-private&state=mock-session-id";
		vi.mocked(oauthAuthorizationUrlController).mockResolvedValue(mockOauthUrl);

		const url = new URL("https://example.com/api/spotify/authorization?type=source");
		const request = new Request(url.toString());

		const params = { provider: "spotify" as PlatformKey };

		// Act
		const response = await GET(request, { params });

		// Assert
		expect(oauthAuthorizationUrlController).toHaveBeenCalledWith("spotify", {
			sessionId: "mock-session-id",
			type: "source",
		});

		expect(response.status).toBe(307); // NextResponse.redirect default status, what's up with this status XD
		expect(response.headers.get("location")).toBe(mockOauthUrl);
	});
});
