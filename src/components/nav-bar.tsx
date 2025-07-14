"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Copy, Layers, Settings, Music, Heart } from "lucide-react";

// TODO: Yes update
const links = [
	{ href: "/clone", label: "Clone Playlist", Icon: Copy }, //  TODO: Name?
	{ href: "/placeholder1", label: "Placeholder 1", Icon: Heart },
	{ href: "/placeholder2", label: "Placeholder 2", Icon: Layers },
	{ href: "/placeholder3", label: "Placeholder 3", Icon: Settings },
	{ href: "/placeholder4", label: "Placeholder 4", Icon: Music },
];

export function NavBar() {
	return (
		<nav
			className="flex flex-wrap items-center justify-between gap-y-2 border-b px-6 py-2"
			aria-label="Primary navigation"
		>
			<div className="flex items-center">
				<MobileNav links={links} />

				<Link href="/" className="p-4 text-lg font-bold">
					PlaylistHaven
				</Link>
			</div>

			<div className="hidden flex-1 flex-wrap justify-center gap-6 md:flex">
				{links.map((link) => (
					<Link key={link.href} href={link.href} className="text-lg hover:underline">
						{link.label}
					</Link>
				))}
			</div>

			<div className="flex-shrink-0">
				<ThemeToggle />
			</div>
		</nav>
	);
}
