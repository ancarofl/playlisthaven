import "@testing-library/jest-dom";

import { vi } from "vitest";

vi.mock("@/helpers/cookies", () => ({
	getSessionIdFromCookies: vi.fn(),
}));
