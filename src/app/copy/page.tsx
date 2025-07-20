"use client";

import { useState } from "react";

import { SpotifyButton } from "@/components/platform-buttons/spotify-button";
import { YouTubeButton } from "@/components/platform-buttons/youtube-button";

function Placeholder() {
	return (
		<div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-gray-400 text-gray-500 dark:border-gray-600 dark:text-gray-400">
			Placeholder
		</div>
	);
}

export default function Page() {
	const [selectedSource, setSelectedSource] = useState<string | null>(null);
	const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

	const handleSourceSelect = (platform: string) => {
		setSelectedSource((prev) => (prev === platform ? null : platform));
	};

	const handleTargetSelect = (platform: string) => {
		setSelectedTarget((prev) => (prev === platform ? null : platform));
	};

	const allPlatforms = ["spotify", "youtube"];

	const sourcePlatforms = allPlatforms.filter((p) => p !== selectedTarget);
	const targetPlatforms = allPlatforms.filter((p) => p !== selectedSource);

	return (
		<div className="m-auto mt-6 flex flex-col gap-y-12">
			<div>
				<h1 className="text-center text-3xl font-semibold">Select source and target platform</h1>
			</div>

			<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
				<div className="flex flex-col items-center gap-6">
					<h2 className="text-2xl">Source</h2>
					<div className="flex flex-wrap justify-center gap-3">
						{sourcePlatforms.includes("spotify") && (
							<SpotifyButton isSelected={selectedSource === "spotify"} onClick={() => handleSourceSelect("spotify")} />
						)}
						{sourcePlatforms.includes("youtube") && (
							<YouTubeButton isSelected={selectedSource === "youtube"} onClick={() => handleSourceSelect("youtube")} />
						)}
						{[...Array(18)].map((_, i) => (
							<Placeholder key={`source-placeholder-${i}`} />
						))}
					</div>
				</div>

				<div className="flex flex-col items-center gap-6">
					<h2 className="text-2xl">Target</h2>
					<div className="flex flex-wrap justify-center gap-3">
						{targetPlatforms.includes("spotify") && (
							<SpotifyButton isSelected={selectedTarget === "spotify"} onClick={() => handleTargetSelect("spotify")} />
						)}
						{targetPlatforms.includes("youtube") && (
							<YouTubeButton isSelected={selectedTarget === "youtube"} onClick={() => handleTargetSelect("youtube")} />
						)}
						{[...Array(18)].map((_, i) => (
							<Placeholder key={`target-placeholder-${i}`} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
