import type { SeriesConfig } from "../types/seriesConfig.ts";
import { withUserConfig } from "../utils/config-overlay.ts";

export const seriesConfig: SeriesConfig = withUserConfig("series", {
	enable: true,
	cardPosition: "bottom",
});
