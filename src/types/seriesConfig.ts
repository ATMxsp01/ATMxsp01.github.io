/**
 * 系列（有序连载文章组）配置。
 * 领域注册见 `scripts/content/config-domains.mjs`（key: "series"）。
 */
export interface SeriesConfig {
	/** 关闭后系列页 404、导航/侧栏入口隐藏、文章内系列卡不渲染（零额外负担） */
	enable: boolean;
	/** 文章内系列卡位置：top = 头部元信息区下方；bottom = 相关阅读之后 */
	cardPosition: "top" | "bottom";
}
