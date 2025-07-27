"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/helpers/utils";

export default function Page() {
	return (
		<div className="m-auto mt-6 flex max-w-5xl flex-col items-center gap-y-12">
			<h1 className="text-center text-5xl font-bold text-blue-600">Welcome to PlaylistHaven</h1>

			<div className="w-full text-center text-3xl">
				<p>Copy your playlists from one music platform to another.</p>

				<p className="my-2 text-center text-4xl font-bold">Fast. Simple. Secure.</p>
			</div>

			<div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-3xl text-green-700">Quick Copy</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-6 text-lg">
						<ul className="list-inside list-disc">
							<li>Copy one playlist at a time</li>
							<li>100% free</li>
							<li>Great for one-time use!</li>
						</ul>
						{/* TODO: button variant maybe */}
						<Link href="/copy" className={cn(buttonVariants({ variant: "green" }), "text-lg")}>
							Start Quick Copy
						</Link>
					</CardContent>
					<CardFooter>
						<span className="text-md w-full text-center">
							No PlaylistHaven account needed. Only temporary playlist access is required.
						</span>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-3xl text-blue-700">Join PlaylistHaven</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-6 text-lg">
						<ul className="list-inside list-disc">
							<li>Keep playlists on different platforms synced</li>
							<li>Copy multiple playlists at once</li>
							<li>Copy to multiple target platforms at once</li>
							<li>More convenient for power users: saved platform connections reduce repeated authorizations</li>
						</ul>
						{/* TODO: button variant maybe */}
						<Link href="/signup" className={cn(buttonVariants({ variant: "blue" }), "text-lg")}>
							Sign Up
						</Link>
					</CardContent>
					<CardFooter>
						<span className="text-md w-full text-center">Enjoy a wide range of free and premium features.</span>
					</CardFooter>
				</Card>
			</div>

			<p className="mt-12 text-center text-lg">Spotify and YouTube supported. More platforms coming soon.</p>
		</div>
	);
}
