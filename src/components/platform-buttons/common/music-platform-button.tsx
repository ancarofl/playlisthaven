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

/* TODO: Logos start as light logo till the theme is known - so there will be a flash of different coloured logo(s) IF the user has dark as system setting/has visited before and has selected dark theme. 
Seems tricky to fix completely, haven't found a solution yet. Might not need to worry about it at all, recheck after colour palette is fully done. 
Could use a single logo and use CSS but the YT logos are pngs... yeah come back to this later.
*/
export function MusicPlatformButton({
	logoLight,
	logoDark,
	alt,
	onClick,
	themeAware = false,
}: MusicPlatformButtonProps) {
	const { resolvedTheme } = useTheme();
	const [theme, setTheme] = useState("light");

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
