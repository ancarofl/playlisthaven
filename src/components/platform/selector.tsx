import { PlatformKey, PLATFORMS } from "@/constants/platforms";

import { PlatformButton } from "./button";
import { PlatformPlaceholder } from "./placeholder";

export function PlatformSelector({
	title,
	platforms,
	selected,
	onClick,
	placeholderCount = 18,
}: {
	title: string;
	platforms: typeof PLATFORMS;
	selected: PlatformKey | null;
	onClick: (key: PlatformKey) => void;
	placeholderCount?: number;
}) {
	return (
		<div className="flex flex-col items-center gap-6">
			<h2 className="text-2xl">{title}</h2>
			<div className="flex flex-wrap justify-center gap-3">
				{platforms.map(({ key }) => (
					<PlatformButton key={key} platformKey={key} isSelected={selected === key} onClick={() => onClick(key)} />
				))}
				{[...Array(placeholderCount)].map((_, i) => (
					<PlatformPlaceholder key={`${title}-placeholder-${i}`} />
				))}
			</div>
		</div>
	);
}
