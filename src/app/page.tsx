"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
	return (
		<div className="m-auto mt-6 flex min-h-screen max-w-5xl flex-col items-center gap-y-12">
			<h1 className="text-center text-4xl font-bold text-blue-600">Welcome to PlaylistHaven</h1>

			<div className="text-center text-2xl">
				<p>Copy your playlists from one music platform to another.</p>

				<p className="my-2 max-w-xl text-center text-3xl font-bold">Fast. Simple. Secure.</p>
			</div>

			<div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl text-green-700">Quick Copy</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<ul className="list-inside list-disc">
							<li>Copy one playlist at a time</li>
							<li>100% free</li>
							<li>Great for one-time use!</li>
						</ul>
						<Link href="/copy" className={buttonVariants({ variant: "green" })}>
							Start Quick Copy
						</Link>
					</CardContent>
					<CardFooter>
						<span className="w-full text-center text-sm">
							No PlaylistHaven account needed. Only temporary playlist access is required.
						</span>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl text-blue-700">Join PlaylistHaven</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<ul className="list-inside list-disc">
							<li>Keep playlists on different platforms synced</li>
							<li>Copy multiple playlists at once</li>
							<li>Copy to multiple target platforms at once</li>
							<li>More convenient for power users: saved platform connections reduce repeated authorizations</li>
						</ul>
						<Link href="/signup" className={buttonVariants({ variant: "blue" })}>
							Sign Up
						</Link>
					</CardContent>
					<CardFooter>
						<span className="w-full text-center text-sm">Enjoy a wide range of free and premium features.</span>
					</CardFooter>
				</Card>
			</div>

			<p className="text-md mt-12 max-w-md text-center">Spotify and YouTube supported. More platforms coming soon.</p>
		</div>
	);
}
