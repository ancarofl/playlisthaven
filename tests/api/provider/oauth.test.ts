import { errorToResponse } from "@tests/helpers/error-to-response";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/[provider]/oauth/route";
import { PlatformKey } from "@/constants/platforms";
import * as oauthAuthorizationUrlControllerModule from "@/controllers/oauth/authorization-url-controller";
import { getSessionIdFromCookies } from "@/helpers/cookies";
import { BadRequestError, InternalServerError, MissingSessionError, UnsupportedProviderError } from "@/helpers/errors";

vi.mock("@/helpers/cookies");
vi.mock("@/controllers/oauth/authorization-url-controller");

type TestCase = {
	description: string;
	provider: string;
	type: string | undefined;
	expectedStatus: number;
	expectedBody: object;
	mockSessionId: string | undefined;
	expectedControllerCall: boolean;
};

const successTestCases: TestCase[] = [
	{
		description: "a supported provider spotify",
		provider: "spotify",
		type: "source",
		expectedStatus: 307,
		expectedBody: {}, // no JSON body on redirect
		mockSessionId: "mock-session-id",
		expectedControllerCall: true,
	},
	{
		description: "a supported provider spotify",
		provider: "spotify",
		type: "target",
		expectedStatus: 307,
		expectedBody: {},
		mockSessionId: "mock-session-id",
		expectedControllerCall: true,
	},
];

const errorTestCases: TestCase[] = [
	{
		description: "an unsupported provider",
		provider: "unsupporteddproviderhehexd",
		type: "source",
		expectedStatus: 400,
		expectedBody: errorToResponse(new UnsupportedProviderError()),
		mockSessionId: "mock-session-id",
		expectedControllerCall: false,
	},
	{
		description: "a supported provider spotify",
		provider: "spotify",
		type: "invalidtypehehexd",
		expectedStatus: 400,
		expectedBody: errorToResponse(new BadRequestError("Missing or invalid 'type' query parameter.")),
		mockSessionId: "mock-session-id",
		expectedControllerCall: false,
	},
	{
		description: "a supported provider spotify",
		provider: "spotify",
		type: undefined,
		expectedStatus: 400,
		expectedBody: errorToResponse(new BadRequestError("Missing or invalid 'type' query parameter.")),
		mockSessionId: "mock-session-id",
		expectedControllerCall: false,
	},
	{
		description: "undefined session id",
		provider: "spotify",
		type: "source",
		expectedStatus: 401,
		expectedBody: errorToResponse(new MissingSessionError()),
		mockSessionId: undefined,
		expectedControllerCall: false,
	},
];

describe("GET /api/[provider]/oauth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it.each(successTestCases)(
		"should redirect to oauth URL with status $expectedStatus for $description with type $type",
		async ({ provider, type, mockSessionId }) => {
			// Arrange
			// Params
			const request = new Request(`https://example.com/api/${provider}/xddddddd?type=${type}`);
			const params = { provider: provider as PlatformKey };

			// Session
			vi.mocked(getSessionIdFromCookies).mockResolvedValue(mockSessionId);

			// Controller
			const mockOauthUrl = "https://mock-url.com/";
			const spy = vi
				.spyOn(oauthAuthorizationUrlControllerModule, "oauthAuthorizationUrlController")
				.mockResolvedValue(mockOauthUrl);

			// Act
			const response = await GET(request, { params });

			// Assert
			expect(spy).toHaveBeenCalledWith(provider, {
				sessionId: mockSessionId!,
				type,
			});
			expect(response.status).toBe(307); // redirect status
			expect(response.headers.get("location")).toBe(mockOauthUrl);
		},
	);

	it.each(errorTestCases)(
		"should return status $expectedStatus for $description with type $type",
		async ({ expectedStatus, provider, type, expectedBody, mockSessionId, expectedControllerCall }) => {
			// Arrange
			const spy = vi.spyOn(oauthAuthorizationUrlControllerModule, "oauthAuthorizationUrlController");
			if (expectedControllerCall) {
				spy.mockResolvedValue("mock-url");
			}

			const request = new Request(`https://example.com/api/${provider}/oauth?type=${type ?? ""}`);
			const params = { provider: provider as PlatformKey };

			vi.mocked(getSessionIdFromCookies).mockResolvedValue(mockSessionId);

			// Act
			const response = await GET(request, { params });
			const json = await response.json();

			// Assert
			if (expectedControllerCall) {
				expect(spy).toHaveBeenCalledWith(provider, {
					sessionId: mockSessionId!,
					type,
				});
			} else {
				expect(spy).not.toHaveBeenCalled();
			}
			expect(response.status).toBe(expectedStatus);
			expect(json).toEqual(expectedBody);
		},
	);

	it("should return status 500 for unexpected errors", async () => {
		// Arrange
		const request = new Request("https://example.com/api/spotify/oauth?type=source");
		const params = { provider: "spotify" as PlatformKey };

		vi.mocked(getSessionIdFromCookies).mockResolvedValue("mock-session-id");
		vi.spyOn(oauthAuthorizationUrlControllerModule, "oauthAuthorizationUrlController").mockRejectedValue(
			new Error("Unexpected error."),
		);

		// Act
		const response = await GET(request, { params });
		const json = await response.json();

		// Assert
		expect(response.status).toBe(500);
		expect(json).toEqual(errorToResponse(new InternalServerError()));
	});
});
