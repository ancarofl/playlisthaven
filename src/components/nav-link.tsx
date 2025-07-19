"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
	href: string;
	label: string;
	icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	onClick?: () => void;
	className?: string;
}

export function NavLink({ href, label, icon: Icon, onClick, className = "" }: NavLinkProps) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			onClick={onClick}
			className={`text-md hover:underline ${isActive ? "text-primary font-semibold underline" : ""} ${className}`} // TODO: Proper active + hover states
		>
			<span className="flex items-center">
				{Icon && <Icon className="mr-5 size-5" />}
				{label}
			</span>
		</Link>
	);
}
