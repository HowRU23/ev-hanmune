"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { GuideMeta } from "@/lib/guides";

const MAX_POPULAR = 5;
const PAGE_SIZE = 10;

export default function GuideBrowser({ guides }: { guides: GuideMeta[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category]);

  const categories = useMemo(
    () => Array.from(new Set(guides.map((g) => g.category))),
    [guides]
  );

  const popularGuides = useMemo(
    () => guides.filter((g) => g.popular).slice(0, MAX_POPULAR),
    [guides]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      const matchesQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.body.toLowerCase().includes(q);
      const matchesCategory = !category || g.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [guides, query, category]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="궁금한 걸 검색해보세요 (예: 충전요금, 보증연장, 회생제동...)"
        className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue-600 dark:border-white/10"
      />

      {!query && !category && popularGuides.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">
            많이 찾는 질문
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {popularGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="block rounded-lg border border-black/10 px-4 py-3 text-sm font-medium hover:border-blue-600 dark:border-white/10"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            category === null
              ? "bg-blue-600 text-white"
              : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
          }`}
        >
          전체
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-black/40 dark:text-white/40">
            검색 결과가 없어요. 다른 키워드로 찾아보세요.
          </p>
        )}
        {filtered.slice(0, visibleCount).map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-xl border border-black/10 p-5 transition hover:border-blue-600 hover:shadow-sm dark:border-white/10"
          >
            <span className="text-xs font-semibold text-blue-600">
              {guide.category}
            </span>
            <h3 className="mt-2 font-semibold">{guide.title}</h3>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          className="mt-6 w-full rounded-xl border border-black/10 py-3 text-sm font-semibold text-black/70 hover:border-blue-600 hover:text-blue-600 dark:border-white/10 dark:text-white/70"
        >
          더 보기
        </button>
      )}
    </div>
  );
}
