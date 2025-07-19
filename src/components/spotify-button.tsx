"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

interface SpotifyButtonProps {
	onClick?: () => void;
}

export function SpotifyButton({ onClick }: SpotifyButtonProps) {
	return (
		<Button
			variant="ghost"
			onClick={onClick}
			className="flex h-20 w-32 items-center justify-center border border-gray-400 p-0 dark:border-gray-600"
		>
			<Image
				src="/logos/spotify-green.svg"
				alt="Spotify"
				width={120}
				height={36}
				priority
				style={{ maxWidth: "80%", height: "auto" }}
			/>
		</Button>
	);
}
