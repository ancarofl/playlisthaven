"use client";

import Link from "next/link";

import { NAV_LINKS } from "@/constants/navigation";

import { ThemeToggle } from "../common/theme-toggle";
import { NavLink } from "./link";
import { MobileNav } from "./mobile";

export function MainNav() {
	return (
		<nav
			className="bg-background dark:bg-card grid grid-cols-[auto_1fr] items-center px-6 py-2 shadow-xl md:grid-cols-[1fr_6fr_1fr]"
			aria-label="Primary navigation"
		>
			<div className="flex items-center">
				<MobileNav />
				<Link href="/" className="p-2 text-lg font-bold">
					PlaylistHaven
				</Link>
			</div>

			<div className="hidden justify-center overflow-x-auto md:flex">
				<div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
					{NAV_LINKS.map(({ href, label }) => (
						<NavLink key={href} href={href} label={label} />
					))}
				</div>
			</div>

			<div className="flex justify-end">
				<ThemeToggle />
			</div>
		</nav>
	);
}
