"use client";

import { SpotifyButton } from "@/components/spotify-button";
import { YouTubeButton } from "@/components/youtube-button";

function Placeholder() {
	return (
		<div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-gray-400 text-gray-500 dark:border-gray-600 dark:text-gray-400">
			Placeholder
		</div>
	);
}

export default function Page() {
	return (
		<div className="m-auto mt-6 flex flex-col gap-y-12">
			<div>
				<h1 className="text-center text-3xl font-semibold">Select source and target platform</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex flex-col items-center gap-6">
					<h2 className="text-2xl">Source</h2>
					<div className="flex flex-wrap justify-center gap-3">
						<SpotifyButton />
						<YouTubeButton />
						{[...Array(18)].map((_, i) => (
							<Placeholder key={`source-placeholder-${i}`} />
						))}
					</div>
				</div>

				<div className="flex flex-col items-center gap-6">
					<h2 className="text-2xl">Target</h2>
					<div className="flex flex-wrap justify-center gap-3">
						<SpotifyButton />
						<YouTubeButton />
						{[...Array(18)].map((_, i) => (
							<Placeholder key={`target-placeholder-${i}`} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
