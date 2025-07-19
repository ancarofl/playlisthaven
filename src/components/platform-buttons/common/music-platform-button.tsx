"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface MusicPlatformButtonProps {
	logoLight: string;
	logoDark?: string;
	alt: string;
	onClick?: () => void;
	themeAware?: boolean;
}

export function MusicPlatformButton({
	logoLight,
	logoDark,
	alt,
	onClick,
	themeAware = false,
}: MusicPlatformButtonProps) {
	const { resolvedTheme } = useTheme();
	const [theme, setTheme] = useState("light");

	// Sync theme only on client side after mount to prevent hydration mismatch. TODO: Improve...
	useEffect(() => {
		if (resolvedTheme) setTheme(resolvedTheme);
	}, [resolvedTheme]);

	const logoSrc = themeAware && theme === "dark" && logoDark ? logoDark : logoLight;

	return (
		<Button
			variant="ghost"
			onClick={onClick}
			className="flex h-20 w-32 items-center justify-center border border-gray-400 p-0 dark:border-gray-600"
		>
			<Image src={logoSrc} alt={alt} width={120} height={36} priority className="h-auto max-w-[80%]" />
		</Button>
	);
}
