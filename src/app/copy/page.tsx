"use client";

import { useState } from "react";

import { MusicPlatformButton } from "@/components/music-platform-button";
import { PlatformKey, PLATFORMS } from "@/constants/platforms";

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

	const sourcePlatforms = PLATFORMS.filter((p) => p.key !== selectedTarget);
	const targetPlatforms = PLATFORMS.filter((p) => p.key !== selectedSource);

	const handleSourceSelect = (platformKey: PlatformKey) => {
		setSelectedSource((prev) => (prev === platformKey ? null : platformKey));
	};

	const handleTargetSelect = (platformKey: PlatformKey) => {
		setSelectedTarget((prev) => (prev === platformKey ? null : platformKey));
	};

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
								onClick={() => handleSourceSelect(key)}
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
								onClick={() => handleTargetSelect(key)}
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
