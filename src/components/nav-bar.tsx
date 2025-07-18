"use client";

import { Copy, Music, UserPlus } from "lucide-react";
import Link from "next/link";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

const links = [
	{ href: "/copy", label: "Quick Playlist Copy", Icon: Copy },
	{ href: "/signup", label: "Join PlaylistHaven", Icon: UserPlus },
	{ href: "/placeholder", label: "Placeholder", Icon: Music },
	{ href: "/placeholder2", label: "Placeholder2", Icon: Music },
	{ href: "/placeholder3", label: "Placeholder3", Icon: Music },
	{ href: "/placeholder4", label: "Placeholder4", Icon: Music },
	{ href: "/placeholder5", label: "Placeholder5", Icon: Music },
	{ href: "/placeholder6", label: "Placeholder6", Icon: Music },
	{ href: "/placeholder7", label: "Placeholder7", Icon: Music },
];

export function NavBar() {
	return (
		<nav className="bg-background flex items-center border-b px-6 py-2" aria-label="Primary navigation">
			<div className="flex shrink-0 items-center gap-2">
				<MobileNav links={links} />
				<Link href="/" className="p-4 text-lg font-bold">
					PlaylistHaven
				</Link>
			</div>

			<div className="hidden flex-1 justify-center overflow-x-auto md:flex">
				<div className="flex flex-wrap justify-center gap-6">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="text-lg whitespace-nowrap hover:underline">
							{link.label}
						</Link>
					))}
				</div>
			</div>

			<div className="shrink-0">
				<ThemeToggle />
			</div>
		</nav>
	);
}
