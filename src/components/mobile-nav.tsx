"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LinkWithIcon {
	href: string;
	label: string;
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface MobileNavProps {
	links: LinkWithIcon[];
}

export function MobileNav({ links }: MobileNavProps) {
	const [open, setOpen] = useState(false);

	const handleClose = () => setOpen(false);

	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Open menu">
						<Menu className="size-6" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col">
					<DialogTitle>
						<VisuallyHidden>Menu</VisuallyHidden>
					</DialogTitle>

					<DialogDescription asChild>
						<VisuallyHidden>Navigation menu with links to different pages</VisuallyHidden>
					</DialogDescription>

					<Link href="/" className="border-b px-6 py-4 text-2xl font-bold" onClick={handleClose}>
						PlaylistHaven
					</Link>

					<div className="flex flex-col gap-y-4 p-6">
						{links.map(({ href, label, Icon }) => (
							<Link key={href} href={href} onClick={handleClose} className="flex items-center text-lg hover:underline">
								<Icon className="mr-5 size-5" />
								{label}
							</Link>
						))}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
