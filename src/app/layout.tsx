import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { MainNav } from "@/components/navigation/main";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Playlist Haven",
	description: "Playlist Haven Description TBD...", // TODO,
	authors: [{ name: "Anca", url: "https://github.com/ancarofl" }],
	creator: "@ancarofl",
	// TODO: Open Graph metadata
	// TODO: Twitter metadata
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
				<ThemeProvider attribute="class" enableSystem defaultTheme="system">
					<TooltipProvider>
						<header className="sticky top-0 z-50">
							<MainNav />
						</header>

						<main className="p-6">{children}</main>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
