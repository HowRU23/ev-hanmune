import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  popular?: boolean;
  summary?: string[];
  related?: string[];
  body: string;
};

export type Guide = GuideMeta & {
  contentHtml: string;
};

function readGuideFile(slug: string) {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw);
}

export function getAllGuideSlugs(): string[] {
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllGuides(): GuideMeta[] {
  return getAllGuideSlugs()
    .map((slug) => {
      const { data, content } = readGuideFile(slug);
      return { slug, body: content, ...data } as GuideMeta;
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getAllCategories(): string[] {
  const categories = new Set(getAllGuides().map((guide) => guide.category));
  return Array.from(categories);
}

export function getGuideBySlug(slug: string): Guide {
  const { data, content } = readGuideFile(slug);
  const contentHtml = marked.parse(content, { async: false }) as string;
  return { slug, contentHtml, ...data } as Guide;
}

export function getRelatedGuides(slugs: string[]): GuideMeta[] {
  const all = getAllGuides();
  return slugs
    .map((slug) => all.find((guide) => guide.slug === slug))
    .filter((guide): guide is GuideMeta => Boolean(guide));
}
