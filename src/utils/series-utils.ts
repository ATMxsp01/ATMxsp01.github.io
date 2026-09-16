import type { CollectionEntry } from "astro:content";

export type SeriesEntity = CollectionEntry<"series">;

export interface SeriesPostRef {
	slug: string;
	title: string;
}

export interface SeriesContext {
	/** 系列 slug（集合条目 id） */
	slug: string;
	title: string;
	status: "ongoing" | "completed";
	defaultCategory: string;
	/** 系列内文章，按阅读顺序 */
	posts: SeriesPostRef[];
	total: number;
}

export interface SeriesPostContext extends SeriesContext {
	/** 当前文章在系列中的 1-based 位置 */
	index: number;
	prev: SeriesPostRef | null;
	next: SeriesPostRef | null;
}

export interface SeriesMemberInput {
	slug: string;
	title: string;
	published: Date;
	/** 所属系列 slug（空 = 不属于任何系列） */
	series?: string;
	seriesOrder?: number;
}

/**
 * 系列内阅读顺序：显式 `seriesOrder` 优先；缺省回退为按发布日期升序。
 * 部分标注时，未标注的按日期排在已标注之后，保证确定性。
 */
export function orderSeriesMembers<T extends SeriesMemberInput>(
	members: readonly T[],
): T[] {
	return [...members].sort((a, b) => {
		const aOrder = typeof a.seriesOrder === "number" ? a.seriesOrder : null;
		const bOrder = typeof b.seriesOrder === "number" ? b.seriesOrder : null;
		if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
			return aOrder - bOrder;
		}
		if (aOrder !== null && bOrder === null) return -1;
		if (aOrder === null && bOrder !== null) return 1;
		const dateDiff = a.published.getTime() - b.published.getTime();
		return dateDiff !== 0 ? dateDiff : a.slug.localeCompare(b.slug);
	});
}

/**
 * 有效 category 的唯一解析点（回退链，非强制）：
 * 显式 post.category → series.defaultCategory → ""（未分类）。
 */
export function resolveSeriesPostCategory(
	category: string | null | undefined,
	seriesData: { defaultCategory?: string } | undefined,
): string {
	const explicit = (category ?? "").trim();
	if (explicit) return explicit;
	return (seriesData?.defaultCategory ?? "").trim();
}

export interface BuildSeriesContextsOptions {
	catalog: Map<string, SeriesEntity>;
	posts: readonly SeriesMemberInput[];
}

/**
 * 为每篇文章构建系列上下文（阅读顺序、index/total、组内上一篇/下一篇）。
 * 没有系列、或引用了目录中不存在的系列的文章 → 不生成上下文（不产生死链）。
 */
export function buildSeriesContexts(
	options: BuildSeriesContextsOptions,
): Map<string, SeriesPostContext> {
	const { catalog, posts } = options;

	const groups = new Map<string, SeriesMemberInput[]>();
	for (const post of posts) {
		const seriesSlug = post.series?.trim();
		if (!seriesSlug || !catalog.has(seriesSlug)) continue;
		const group = groups.get(seriesSlug) ?? [];
		group.push(post);
		groups.set(seriesSlug, group);
	}

	const contexts = new Map<string, SeriesPostContext>();
	for (const [slug, members] of groups) {
		const entity = catalog.get(slug);
		if (!entity) continue;
		const ordered = orderSeriesMembers(members);
		const refs: SeriesPostRef[] = ordered.map((member) => ({
			slug: member.slug,
			title: member.title,
		}));
		ordered.forEach((member, index) => {
			contexts.set(member.slug, {
				slug,
				title: entity.data.title,
				status: entity.data.status,
				defaultCategory: entity.data.defaultCategory,
				posts: refs,
				total: refs.length,
				index: index + 1,
				prev: index > 0 ? refs[index - 1] : null,
				next: index < refs.length - 1 ? refs[index + 1] : null,
			});
		});
	}

	return contexts;
}
