import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import RelatedGuides from "@/components/RelatedGuides";
import { getAllGuideSlugs, getGuideBySlug, getRelatedGuides } from "@/lib/guides";

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

async function loadGuide(slug: string) {
  try {
    return getGuideBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await loadGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `/guides/${slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await loadGuide(slug);
  if (!guide) notFound();

  const relatedGuides = getRelatedGuides(guide.related ?? []);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <BackLink href="/guides" label="가이드 목록으로" />

      <span className="mt-6 block text-xs font-semibold text-blue-600">
        {guide.category}
      </span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{guide.title}</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">{guide.description}</p>

      {guide.summary && guide.summary.length > 0 && (
        <div className="mt-8 rounded-xl border border-blue-600/20 bg-blue-600/5 p-5">
          <p className="text-xs font-semibold text-blue-600">핵심만 먼저</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            {guide.summary.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="prose prose-neutral dark:prose-invert mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
      />

      <RelatedGuides guides={relatedGuides} category={guide.category} />
    </article>
  );
}
