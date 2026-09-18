import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

const TOOLS = [
  {
    href: "/tools/ev-subsidy",
    title: "보조금 찾기",
    description: "지역·제조사·모델별 전기차 보조금을 토스 미니앱에서 바로 확인합니다.",
  },
  {
    href: "/tools/cost-calculator",
    title: "유지비 계산기",
    description: "내 주행거리 기준으로 내연기관차와 전기차의 연간 연료비를 비교합니다.",
  },
  {
    href: "/tools/charging-rates",
    title: "충전 요금 비교",
    description: "완속·급속 충전 사업자별 요금을 비교해서 저렴한 카드를 고를 때 참고합니다.",
  },
];

const GUIDES_SHOWN = 6;
const FIXED_GUIDE_SLUGS = [
  "ev-battery-100-percent",
  "ev-charging-types",
  "ipedal-guide",
  "regen-braking-basics",
];

export const dynamic = "force-dynamic";

function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function Home() {
  const guides = getAllGuides();
  const fixedGuides = FIXED_GUIDE_SLUGS.map((slug) =>
    guides.find((g) => g.slug === slug)
  ).filter((g): g is (typeof guides)[number] => Boolean(g));
  const pool = guides.filter((g) => !FIXED_GUIDE_SLUGS.includes(g.slug));
  const randomGuides = pickRandom(pool, GUIDES_SHOWN - fixedGuides.length);
  const shownGuides = [...fixedGuides, ...randomGuides];
  const hasMoreGuides = guides.length > GUIDES_SHOWN;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="text-center">
        <span className="inline-block rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-600">
          베타
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          전기차 타면서 궁금한 것들, 한눈에
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60 dark:text-white/60">
          보조금 조회, 유지비 계산, 충전 요금 비교는 도구로, 오너들이 많이 묻는 질문은 가이드로 정리했습니다.
        </p>
      </section>

      {guides.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">가이드</h2>
            {hasMoreGuides && (
              <Link
                href="/guides"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                전체 보기
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {shownGuides.map((guide) => (
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
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-xl font-bold">바로 쓰는 도구</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-black/10 p-5 transition hover:border-blue-600 hover:shadow-sm dark:border-white/10"
            >
              <h3 className="font-semibold">{tool.title}</h3>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
