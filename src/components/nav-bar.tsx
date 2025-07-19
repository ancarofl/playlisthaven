"use client";

import { Copy, UserPlus } from "lucide-react";
import Link from "next/link";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

// TODO: Yes update
const links = [
	{ href: "/copy", label: "Quick Playlist Copy", Icon: Copy }, //  TODO: Name?
	{ href: "/signup", label: "Join PlaylistHaven", Icon: UserPlus }, // TODO: NAME 2 IDK MAN
	/* 	{ href: "/placeholder", label: "Placeholder", Icon: Music },
	{ href: "/placeholder2", label: "Placeholder2", Icon: Music },
	{ href: "/placeholder3", label: "Placeholder3", Icon: Music },
	{ href: "/placeholder4", label: "Placeholder4", Icon: Music },
	{ href: "/placeholder5", label: "Placeholder5", Icon: Music },
	{ href: "/placeholder6", label: "Placeholder6", Icon: Music },
	{ href: "/placeholder7", label: "Placeholder7", Icon: Music }, */
];

export function NavBar() {
	return (
		<nav
			className="bg-background dark:bg-card grid grid-cols-[auto_1fr] items-center px-6 py-2 shadow-xl md:grid-cols-[1fr_6fr_1fr]"
			aria-label="Primary navigation"
		>
			<div className="flex items-center">
				<MobileNav links={links} />
				<Link href="/" className="p-2 text-lg font-bold">
					PlaylistHaven
				</Link>
			</div>

			<div className="hidden justify-center overflow-x-auto md:flex">
				<div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="text-md hover:underline">
							{link.label}
						</Link>
					))}
				</div>
			</div>

			<div className="flex justify-end">
				<ThemeToggle />
			</div>
		</nav>
	);
}
