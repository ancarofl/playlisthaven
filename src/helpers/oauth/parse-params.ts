import { PLATFORMS } from "@/constants/platforms";

// Extract and validate oauth callback parameters (connectedProvider and connectedType) from the URL, then clear them from the browser history
export function parseOauthCallbackParams(): { connectedProvider: string; connectedType: "source" | "target" } | null {
	const url = new URL(window.location.href);
	const connectedProvider = url.searchParams.get("connectedProvider");
	const connectedType = url.searchParams.get("connectedType");

	if (
		connectedProvider &&
		connectedType &&
		PLATFORMS.some((p) => p.key === connectedProvider) &&
		(connectedType === "source" || connectedType === "target")
	) {
		// Clear the URL params after reading them
		url.searchParams.delete("connectedProvider");
		url.searchParams.delete("connectedType");
		// Also remove them from history
		window.history.replaceState({}, "", url.toString());

		return { connectedProvider, connectedType };
	}

	return null;
}
