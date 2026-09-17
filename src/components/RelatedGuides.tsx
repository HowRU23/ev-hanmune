import Link from "next/link";
import type { GuideMeta } from "@/lib/guides";

const MAX_SHOWN = 4;

export default function RelatedGuides({
  guides,
  category,
}: {
  guides: GuideMeta[];
  category: string;
}) {
  if (guides.length === 0) return null;

  const shown = guides.slice(0, MAX_SHOWN);
  const hasMore = guides.length > MAX_SHOWN;

  return (
    <div className="mt-12 border-t border-black/10 pt-8 dark:border-white/10">
      <p className="text-sm font-semibold text-black/60 dark:text-white/60">
        같이 보면 좋은 가이드
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {shown.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-4 py-3 text-sm transition hover:border-blue-600 dark:border-white/10"
          >
            <span className="font-medium">{guide.title}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-black/30 dark:text-white/30"
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        ))}
      </div>
      {hasMore && (
        <Link
          href={`/guides?category=${encodeURIComponent(category)}`}
          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
        >
          이 주제 가이드 더 보기 →
        </Link>
      )}
    </div>
  );
}
