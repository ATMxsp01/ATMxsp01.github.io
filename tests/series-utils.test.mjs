import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	buildSeriesContexts,
	orderSeriesMembers,
	resolveSeriesPostCategory,
} from "../src/utils/series-utils.ts";

const member = (slug, published, seriesOrder) => ({
	slug,
	title: `Title ${slug}`,
	published: new Date(published),
	series: "demo",
	seriesOrder,
});

describe("orderSeriesMembers", () => {
	it("显式 seriesOrder 优先于发布日期", () => {
		const ordered = orderSeriesMembers([
			member("a", "2026-01-01", 3),
			member("b", "2026-01-02", 1),
			member("c", "2026-01-03", 2),
		]);
		assert.deepEqual(
			ordered.map((m) => m.slug),
			["b", "c", "a"],
		);
	});

	it("全部缺省顺序时按发布日期升序", () => {
		const ordered = orderSeriesMembers([
			member("late", "2026-03-01"),
			member("early", "2026-01-01"),
			member("mid", "2026-02-01"),
		]);
		assert.deepEqual(
			ordered.map((m) => m.slug),
			["early", "mid", "late"],
		);
	});

	it("部分标注时未标注的按日期排在已标注之后", () => {
		const ordered = orderSeriesMembers([
			member("x", "2026-01-01", 2),
			member("y", "2026-01-02"),
			member("z", "2026-01-03", 1),
		]);
		assert.deepEqual(
			ordered.map((m) => m.slug),
			["z", "x", "y"],
		);
	});

	it("同序同日期时按 slug 兜底，保证确定性", () => {
		const ordered = orderSeriesMembers([
			member("b", "2026-01-01"),
			member("a", "2026-01-01"),
		]);
		assert.deepEqual(
			ordered.map((m) => m.slug),
			["a", "b"],
		);
	});
});

describe("resolveSeriesPostCategory", () => {
	it("显式 category 优先", () => {
		assert.equal(
			resolveSeriesPostCategory("代码实践", { defaultCategory: "研究笔记" }),
			"代码实践",
		);
	});

	it("缺省时回退到系列默认分类", () => {
		assert.equal(
			resolveSeriesPostCategory("", { defaultCategory: "研究笔记" }),
			"研究笔记",
		);
		assert.equal(
			resolveSeriesPostCategory(undefined, { defaultCategory: " 研究笔记 " }),
			"研究笔记",
		);
	});

	it("两者皆空返回空串（未分类）", () => {
		assert.equal(resolveSeriesPostCategory("", undefined), "");
		assert.equal(resolveSeriesPostCategory(null, { defaultCategory: "" }), "");
	});
});

describe("buildSeriesContexts", () => {
	const catalog = new Map();
	catalog.set("demo", {
		id: "demo",
		data: { title: "Demo Series", status: "ongoing", defaultCategory: "研究笔记" },
	});

	it("按阅读顺序给出 index/total 与组内上一篇/下一篇", () => {
		const posts = [
			{ slug: "p1", title: "P1", published: new Date("2026-01-03"), series: "demo", seriesOrder: 1 },
			{ slug: "p2", title: "P2", published: new Date("2026-01-01"), series: "demo", seriesOrder: 2 },
			{ slug: "p3", title: "P3", published: new Date("2026-01-02"), series: "demo", seriesOrder: 3 },
			{ slug: "solo", title: "Solo", published: new Date("2026-01-04") },
		];
		const contexts = buildSeriesContexts({ catalog, posts });

		assert.equal(contexts.size, 3);
		const first = contexts.get("p1");
		assert.equal(first.index, 1);
		assert.equal(first.total, 3);
		assert.equal(first.prev, null);
		assert.equal(first.next.slug, "p2");
		const mid = contexts.get("p2");
		assert.equal(mid.prev.slug, "p1");
		assert.equal(mid.next.slug, "p3");
		const last = contexts.get("p3");
		assert.equal(last.next, null);
	});

	it("引用目录中不存在的系列时不生成上下文（不产生死链）", () => {
		const posts = [
			{ slug: "ghost", title: "Ghost", published: new Date("2026-01-01"), series: "no-such-series", seriesOrder: 1 },
		];
		const contexts = buildSeriesContexts({ catalog, posts });
		assert.equal(contexts.size, 0);
	});
});
