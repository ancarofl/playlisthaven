import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/[provider]/connection/route";
import { PlatformKey } from "@/constants/platforms";

describe("GET /api/[provider]/connection smoke test", () => {
	it("should not throw and return a response", async () => {
		// Arrange
		// Create dummy request and params
		const dummyRequest = new Request("https://example.com/api/spotify/connection"); // TODO: example.com or sth else?
		const dummyParams: { provider: PlatformKey } = { provider: "spotify" };

		// Act & Assert
		const response = await GET(dummyRequest, { params: dummyParams });
		expect(response).toHaveProperty("json");
	});
});

// TODO: Specific error. Should I throw in the controller on invalid provider for this route?
describe("GET /api/[provider]/connection error cases", () => {
	it("should return an error response for nonexistent provider", async () => {
		// Arrange
		const dummyRequest = new Request("https://example.com/api/invalidprovider/connection");
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dummyParams = { provider: "invalidprovider" } as any;

		// Act & Assert
		const response = await GET(dummyRequest, { params: dummyParams });

		// The response should be an error response with non-200 status
		expect(response).toHaveProperty("status");
		expect(response.status).not.toBe(200);

		const json = await response.json();
		expect(json).toHaveProperty("error");
	});
});
