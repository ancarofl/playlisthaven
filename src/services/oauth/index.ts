import { OauthService } from "@/types/oauth";

import { spotifyOauthService } from "./spotify";
import { youtubeOauthService } from "./youtube";

export const oauthServices: Record<string, OauthService> = {
	spotify: spotifyOauthService,
	youtube: youtubeOauthService,
};
