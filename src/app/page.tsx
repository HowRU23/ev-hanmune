import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

const TOOLS = [
  {
    href: "/tools/cost-calculator",
    title: "유지비 계산기",
    description: "내 주행거리 기준으로 내연기관차와 전기차의 연간 연료비를 비교합니다.",
  },
  {
    href: "/tools/ev-subsidy",
    title: "보조금 찾기",
    description: "지역·제조사·모델별 전기차 보조금을 토스 미니앱에서 바로 확인합니다.",
  },
  {
    href: "/tools/charging-rates",
    title: "충전 요금 비교",
    description: "완속·급속 충전 사업자별 요금을 비교해서 저렴한 카드를 고를 때 참고합니다.",
  },
];

export default function Home() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          전기차 타면서 헷갈리는 것들, 여기서 확인하세요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60 dark:text-white/60">
          충전 요금, 유지비, 보조금처럼 전기차를 타면서 실제로 마주치는 질문과 도구를 모았습니다.
        </p>
        <a
          href="#tools"
          className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          도구 둘러보기
        </a>
      </section>

      <section id="tools" className="mt-20">
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

      {guides.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-bold">최신 가이드</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {guides.map((guide) => (
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
    </div>
  );
}
