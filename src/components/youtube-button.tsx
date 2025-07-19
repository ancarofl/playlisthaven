"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface YouTubeButtonProps {
	onClick?: () => void;
}

export function YouTubeButton({ onClick }: YouTubeButtonProps) {
	const { resolvedTheme } = useTheme();
	const [theme, setTheme] = useState<string>("light");

	// Sync theme only on client side after mount to prevent hydration mismatch. TODO: Improve...
	useEffect(() => {
		if (resolvedTheme) {
			setTheme(resolvedTheme);
		}
	}, [resolvedTheme]);

	const logoSrc = theme === "dark" ? "/logos/yt-dark.png" : "/logos/yt-light.png";

	return (
		<Button
			variant="ghost"
			onClick={onClick}
			className="flex h-20 w-32 items-center justify-center border border-gray-400 p-0 dark:border-gray-600"
		>
			<Image src={logoSrc} alt="YouTube" width={120} height={36} priority style={{ maxWidth: "80%", height: "auto" }} />
		</Button>
	);
}
