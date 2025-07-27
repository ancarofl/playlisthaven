import { PlatformKey } from "@/constants/platforms";

export interface Platform {
	key: PlatformKey;
	alt: string;
	logoLight: string;
	logoDark?: string;
	themeAware?: boolean;
}
