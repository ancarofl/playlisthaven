"use client";

import React, { useEffect, useMemo, useState } from "react";

import { LoadingSkeletonPlatformButton } from "@/components/platform/loading-skeleton-button";
import { PlatformSelector } from "@/components/platform/selector";
import { SELECTED_SOURCE_KEY, SELECTED_TARGET_KEY } from "@/constants";
import { PlatformKey, PLATFORMS } from "@/constants/platforms";
import { clearFromStorage, getFromStorage, saveToStorage } from "@/helpers/local-storage";
import { showError } from "@/helpers/show-error";

function LoadingSection({ title }: { title: string }) {
	return (
		<div className="flex flex-col items-center gap-6">
			<h2 className="text-2xl">{title}</h2>
			<LoadingSkeletonPlatformButton />
		</div>
	);
}

function PageLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="m-auto mt-6 flex flex-col gap-y-12">
			<h1 className="text-center text-3xl font-semibold">Select source and target platform</h1>
			<div className="grid grid-cols-1 gap-12 md:grid-cols-2">{children}</div>
		</div>
	);
}

export default function Page() {
	const [selectedSource, setSelectedSource] = useState<PlatformKey | null>(null);
	const [selectedTarget, setSelectedTarget] = useState<PlatformKey | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const sourcePlatforms = PLATFORMS.filter((p) => p.key !== selectedTarget);
	const targetPlatforms = PLATFORMS.filter((p) => p.key !== selectedSource);

	const selectors = useMemo(
		() => [
			{ title: "Source", platforms: sourcePlatforms, selected: selectedSource, type: "source" as const },
			{ title: "Target", platforms: targetPlatforms, selected: selectedTarget, type: "target" as const },
		],
		[sourcePlatforms, targetPlatforms, selectedSource, selectedTarget],
	);

	// TODO: Temppp
	useEffect(() => {
		// On mount, check for query params to set selected source/target from oauth callback
		const url = new URL(window.location.href);
		const connectedProvider = url.searchParams.get("connectedProvider");
		const connectedType = url.searchParams.get("connectedType");

		if (
			connectedProvider &&
			connectedType &&
			PLATFORMS.some((p) => p.key === connectedProvider) &&
			(connectedType === "source" || connectedType === "target")
		) {
			// Determine opposite type key
			const oppositeType = connectedType === "source" ? "target" : "source";

			// Load opposite from storage
			const oppositeStorageKey = oppositeType === "source" ? SELECTED_SOURCE_KEY : SELECTED_TARGET_KEY;
			const oppositeProvider = getFromStorage(oppositeStorageKey) as PlatformKey | null;

			// Save connected provider/type to storage
			const currentStorageKey = connectedType === "source" ? SELECTED_SOURCE_KEY : SELECTED_TARGET_KEY;
			saveToStorage(currentStorageKey, connectedProvider);

			// Set state for both
			if (connectedType === "source") {
				setSelectedSource(connectedProvider as PlatformKey);
				setSelectedTarget(oppositeProvider);
			} else {
				setSelectedTarget(connectedProvider as PlatformKey);
				setSelectedSource(oppositeProvider);
			}

			// Clean URL params
			url.searchParams.delete("connectedProvider");
			url.searchParams.delete("connectedType");
			window.history.replaceState({}, "", url.toString());
		} else {
			// No URL params, fallback to localStorage normally
			const savedSource = getFromStorage(SELECTED_SOURCE_KEY) as PlatformKey | null;
			const savedTarget = getFromStorage(SELECTED_TARGET_KEY) as PlatformKey | null;

			setSelectedSource(savedSource);
			setSelectedTarget(savedTarget);
		}
		setIsLoading(false);
	}, []);

	const handleSourceSelect = (platformKey: PlatformKey | null) => {
		setSelectedSource((prev) => {
			const newValue = prev === platformKey ? null : platformKey;
			if (newValue === null) {
				clearFromStorage(SELECTED_SOURCE_KEY);
			} else {
				saveToStorage(SELECTED_SOURCE_KEY, newValue);
			}
			return newValue;
		});
	};

	const handleTargetSelect = (platformKey: PlatformKey | null) => {
		setSelectedTarget((prev) => {
			const newValue = prev === platformKey ? null : platformKey;
			if (newValue === null) {
				clearFromStorage(SELECTED_TARGET_KEY);
			} else {
				saveToStorage(SELECTED_TARGET_KEY, newValue);
			}
			return newValue;
		});
	};

	async function handlePlatformClick(platformKey: PlatformKey, type: "source" | "target") {
		// TODO: Disable button while this is happening??? What is "this" xD
		// TODO: Add validation(Zod?)

		try {
			const res = await fetch(`/api/${platformKey}/connection`);
			const body = await res.json();

			// Error - request not ok aka status not 2xx
			if (!res.ok) {
				// Error - session missing
				if (res.status === 401 && body.error === "no_session") {
					showError("This feature requires cookies. Please enable cookies in your browser and reload.");
				}
				// Error - other
				else {
					showError(body.message || "Unknown error occurred.");
				}
				return;
			}

			// TODO: Type or something?
			if (body.data) {
				// Success - connected - set the selected platform
				if (body.data.connected) {
					if (type === "source") handleSourceSelect(platformKey);
					else handleTargetSelect(platformKey);
					return;
				}

				// Success - needs oauth
				// TODO: Right now, redirect to oauthUrl. Consider modal/popup
				if (body.data.oauthUrl) {
					const url = new URL(body.data.oauthUrl, window.location.origin);
					url.searchParams.set("type", type);
					window.location.href = url.toString();
					return;
				}
			}

			// Weird/unexpected response
			showError("Something unexpected happened. Please try again later.");
			console.error("Unexpected API response:", body);
		} catch (err) {
			showError("Could not connect to server. Please try again.", err);
		}
	}

	if (isLoading) {
		return (
			<PageLayout>
				<LoadingSection title="Source" />
				<LoadingSection title="Target" />
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			{selectors.map(({ title, platforms, selected, type }) => (
				<PlatformSelector
					key={title}
					title={title}
					platforms={platforms}
					selected={selected}
					onClick={(key) => handlePlatformClick(key, type)}
				/>
			))}
		</PageLayout>
	);
}
