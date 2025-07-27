"use client";

import { useEffect, useState } from "react";

import { MusicPlatformButton } from "@/components/music-platform-button";
import { SELECTED_SOURCE_KEY, SELECTED_TARGET_KEY } from "@/constants";
import { PlatformKey, PLATFORMS } from "@/constants/platforms";

// TODO: Toast not alert
function showError(msg: string, error?: unknown) {
	if (error) console.error(msg, error);
	alert(msg);
}

function LoadingSkeleton() {
	return (
		<div className="flex flex-wrap gap-3">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="h-20 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
			))}
		</div>
	);
}

function Placeholder() {
	return (
		<div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-gray-400 text-gray-500 dark:border-gray-600 dark:text-gray-400">
			Placeholder
		</div>
	);
}

export default function Page() {
	const [selectedSource, setSelectedSource] = useState<PlatformKey | null>(null);
	const [selectedTarget, setSelectedTarget] = useState<PlatformKey | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const sourcePlatforms = PLATFORMS.filter((p) => p.key !== selectedTarget);
	const targetPlatforms = PLATFORMS.filter((p) => p.key !== selectedSource);

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
			const oppositeProvider = localStorage.getItem(oppositeStorageKey) as PlatformKey | null;

			// Save connected provider/type to storage
			const currentStorageKey = connectedType === "source" ? SELECTED_SOURCE_KEY : SELECTED_TARGET_KEY;
			localStorage.setItem(currentStorageKey, connectedProvider);

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
			const savedSource = localStorage.getItem(SELECTED_SOURCE_KEY) as PlatformKey | null;
			const savedTarget = localStorage.getItem(SELECTED_TARGET_KEY) as PlatformKey | null;

			setSelectedSource(savedSource);
			setSelectedTarget(savedTarget);
		}
		setIsLoading(false);
	}, []);

	const handleSourceSelect = (platformKey: PlatformKey | null) => {
		setSelectedSource((prev) => {
			const newValue = prev === platformKey ? null : platformKey;
			if (newValue === null) {
				localStorage.removeItem(SELECTED_SOURCE_KEY);
			} else {
				localStorage.setItem(SELECTED_SOURCE_KEY, newValue);
			}
			return newValue;
		});
	};

	const handleTargetSelect = (platformKey: PlatformKey | null) => {
		setSelectedTarget((prev) => {
			const newValue = prev === platformKey ? null : platformKey;
			if (newValue === null) {
				localStorage.removeItem(SELECTED_TARGET_KEY);
			} else {
				localStorage.setItem(SELECTED_TARGET_KEY, newValue);
			}
			return newValue;
		});
	};

	async function handlePlatformClick(platformKey: PlatformKey, type: "source" | "target") {
		// TODO: Disable button while this is happening??? What is "this" xD

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
			<div className="m-auto mt-6 flex flex-col gap-y-12">
				<h1 className="text-center text-3xl font-semibold">Select source and target platform</h1>
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
					<div className="flex flex-col items-center gap-6">
						<h2 className="text-2xl">Source</h2>
						<LoadingSkeleton />
					</div>
					<div className="flex flex-col items-center gap-6">
						<h2 className="text-2xl">Target</h2>
						<LoadingSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="m-auto mt-6 flex flex-col gap-y-12">
			<h1 className="text-center text-3xl font-semibold">Select source and target platform</h1>

			<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
				<div className="flex flex-col items-center gap-6">
					<h2 className="text-2xl">Source</h2>
					<div className="flex flex-wrap justify-center gap-3">
						{sourcePlatforms.map(({ key }) => (
							<MusicPlatformButton
								key={key}
								platformKey={key}
								isSelected={selectedSource === key}
								onClick={() => handlePlatformClick(key, "source")}
							/>
						))}
						{[...Array(18)].map((_, i) => (
							<Placeholder key={`source-placeholder-${i}`} />
						))}
					</div>
				</div>

				<div className="flex flex-col items-center gap-6">
					<h2 className="text-2xl">Target</h2>
					<div className="flex flex-wrap justify-center gap-3">
						{targetPlatforms.map(({ key }) => (
							<MusicPlatformButton
								key={key}
								platformKey={key}
								isSelected={selectedTarget === key}
								onClick={() => handlePlatformClick(key, "target")}
							/>
						))}
						{[...Array(18)].map((_, i) => (
							<Placeholder key={`target-placeholder-${i}`} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
