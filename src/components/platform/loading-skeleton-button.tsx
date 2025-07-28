export function LoadingSkeletonPlatformButton() {
	return (
		<div className="flex flex-wrap gap-3">
			{[...Array(20)].map((_, i) => (
				<div key={i} className="h-20 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
			))}
		</div>
	);
}
