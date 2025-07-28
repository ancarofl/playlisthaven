import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
	{ id: "light", label: "Light", icon: Sun },
	{ id: "dark", label: "Dark", icon: Moon },
	{ id: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="ring-primary/50 cursor-pointer rounded-md focus-visible:ring"
					aria-label="Toggle theme"
				>
					<Sun className="size-6 scale-100 rotate-0 transition-all duration-600 dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute size-6 scale-0 rotate-90 transition-all duration-600 dark:scale-100 dark:rotate-0" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="cursor-pointer">
				{themes.map(({ id, label, icon: Icon }) => (
					<DropdownMenuItem className="cursor-pointer" key={id} onClick={() => setTheme(id)}>
						<Icon aria-hidden="true" focusable="false" />
						{label}
						{theme === id && <Check className="ml-auto size-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
