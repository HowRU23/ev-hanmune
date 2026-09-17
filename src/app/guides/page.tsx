import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllGuides } from "@/lib/guides";
import GuideBrowser from "@/components/GuideBrowser";

export const metadata: Metadata = {
  title: "가이드 | 전기차 한눈에",
  description: "전기차 오너들이 가장 많이 묻는 질문을 모아 정리했습니다.",
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-bold">뭐가 궁금하세요?</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        전기차 오너들이 실제로 자주 묻는 질문을 검색하거나 카테고리로 찾아보세요.
      </p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <GuideBrowser guides={guides} />
        </Suspense>
      </div>
    </div>
  );
}
