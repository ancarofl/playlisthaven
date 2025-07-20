"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { PlatformKey, PLATFORMS } from "@/constants/platforms";
import { Platform } from "@/types/platforms";

interface MusicPlatformButtonProps {
	platformKey: PlatformKey;
	onClick?: () => void;
	isSelected: boolean;
}

function getPlatformLogo(platform: Platform, theme: string): string {
	if (platform.themeAware && theme === "dark" && platform.logoDark) {
		return platform.logoDark;
	}
	return platform.logoLight;
}

export function MusicPlatformButton({ platformKey, onClick, isSelected }: MusicPlatformButtonProps) {
	const { resolvedTheme } = useTheme();
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		if (resolvedTheme) setTheme(resolvedTheme);
	}, [resolvedTheme]);

	const platform = PLATFORMS.find((p): p is Platform => p.key === platformKey);
	if (!platform) return null;

	return (
		<Button
			variant="ghost"
			onClick={onClick}
			className={`flex h-20 w-32 cursor-pointer items-center justify-center border p-0 transition-all duration-200 ${
				isSelected
					? // If selected, apply the selected styles and override the variant's hover effects
						"border-blue-500 bg-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:border-blue-500 hover:bg-blue-200 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:border-blue-400 dark:bg-blue-900 dark:hover:border-blue-400 dark:hover:bg-blue-900"
					: // If not selected, apply default border
						"border-gray-400 dark:border-gray-600"
			}`}
		>
			{/* TO DO: Do not harcode w h like this */}
			<Image
				src={getPlatformLogo(platform, theme)}
				alt={platform.alt}
				width={120}
				height={36}
				priority
				className="h-auto max-w-[80%]"
			/>
		</Button>
	);
}
