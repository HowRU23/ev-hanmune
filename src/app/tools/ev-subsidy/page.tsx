import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import SubsidyLinkCard from "@/components/SubsidyLinkCard";
import QrCode from "@/components/QrCode";

const TOSS_LINK = "https://minion.toss.im/zQshQ9j7";

export const metadata: Metadata = {
  title: "전기차 보조금 찾기 | 전기차 한눈에",
  description: "지역·제조사·모델별 전기차 보조금을 토스 미니앱에서 간편히 확인하세요.",
};

export default function EvSubsidyToolPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <BackLink href="/" label="홈으로" />

      <h1 className="mt-6 text-3xl font-bold tracking-tight">전기차 보조금 찾기</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">
        국비+지방비 보조금은 지역·제조사·모델마다 다릅니다. 내 조건에 맞는 정확한 금액을 토스 미니앱에서 바로 확인하세요.
      </p>

      <SubsidyLinkCard qrCode={<QrCode value={TOSS_LINK} size={140} />} />
    </div>
  );
}
