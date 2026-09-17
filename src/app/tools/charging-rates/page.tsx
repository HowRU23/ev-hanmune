import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import RateRankTable from "@/components/RateRankTable";

export const metadata: Metadata = {
  title: "충전 요금 비교 | 전기차 한눈에",
  description: "완속·급속 충전 사업자별 회원가를 비교해서 저렴한 충전 카드를 고를 때 참고하세요.",
};

const DATA_DATE = "2026-09-15";
const SOURCE_URL = "https://ev.or.kr";

const SLOW = {
  threshold: 300,
  total: 27,
  best: [
    { name: "태성콘텍", price: 250, count: 332, updated: "2026-03-13" },
    { name: "이엘일렉트릭", price: 260, count: 570, updated: "2026-08-06" },
    { name: "이카플러그", price: 275, count: 1380, updated: "2026-03-13" },
    { name: "채비", price: 275, count: 2272, updated: "2026-03-13" },
    { name: "제주전기자동차서비스", price: 280, count: 734, updated: "2026-03-13" },
  ],
  worst: [
    { name: "쿨사인", price: 324.4, count: 426, updated: "2026-03-13" },
    { name: "블루네트웍스", price: 324.4, count: 594, updated: "2026-03-13" },
    { name: "파워큐브", price: 319, count: 7773, updated: "2026-03-13" },
    { name: "타디스테크놀로지", price: 317, count: 438, updated: "2026-07-29" },
    { name: "이브이시스", price: 310, count: 686, updated: "2026-05-11" },
  ],
};

const FAST = {
  threshold: 100,
  total: 14,
  best: [
    { name: "이지차저", price: 289, count: 303, updated: "2026-08-06" },
    { name: "에버온", price: 296, count: 121, updated: "2026-04-15" },
    { name: "휴맥스이브이", price: 340, count: 172, updated: "2026-08-06" },
    { name: "GS차지비", price: 345, count: 213, updated: "2026-08-05" },
    { name: "펌프킨", price: 347.1, count: 350, updated: "2026-03-13" },
  ],
  worst: [
    { name: "채비", price: 430, count: 1239, updated: "2026-03-13" },
    { name: "한국전기차충전서비스", price: 398, count: 110, updated: "2026-08-18" },
    { name: "SK일렉링크", price: 391, count: 941, updated: "2026-08-06" },
    { name: "이브이시스", price: 380, count: 283, updated: "2026-05-11" },
    { name: "현대엔지니어링", price: 350, count: 113, updated: "2026-09-07" },
  ],
};

export default function ChargingRatesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <BackLink href="/" label="홈으로" />

      <h1 className="mt-6 text-3xl font-bold tracking-tight">충전 요금 비교</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">
        완속·급속 충전 사업자별 회원가를 비교했습니다. 전국에 충전기를 일정 규모 이상 보유한 사업자만 모아서, 실제로 자주 마주치는 곳들 위주로 봤습니다.{" "}
        <a href="#notice" className="text-blue-600 hover:underline">
          자세히
        </a>
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <section>
          <h2 className="text-lg font-bold">완속 충전 (30kW 미만)</h2>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            전국 {SLOW.threshold}기 이상 보유한 사업자 {SLOW.total}곳 중 비교입니다.
          </p>
          <div className="mt-3 flex flex-col gap-4">
            <RateRankTable title="저렴한 사업자 TOP 5" badge="BEST" badgeColor="good" rows={SLOW.best} />
            <RateRankTable title="비싼 사업자 TOP 5" badge="WORST" badgeColor="bad" rows={SLOW.worst} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold">급속 충전 (100~199kW)</h2>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            전국 {FAST.threshold}기 이상 보유한 사업자 {FAST.total}곳 중 비교입니다.
          </p>
          <div className="mt-3 flex flex-col gap-4">
            <RateRankTable title="저렴한 사업자 TOP 5" badge="BEST" badgeColor="good" rows={FAST.best} />
            <RateRankTable title="비싼 사업자 TOP 5" badge="WORST" badgeColor="bad" rows={FAST.worst} />
          </div>
        </section>
      </div>

      <div id="notice" className="mt-10 rounded-xl bg-black/[0.03] p-4 text-xs text-black/50 dark:bg-white/[0.05] dark:text-white/50">
        <p>각 사업자 앱·카드 회원가 기준이며, 사업자별 요금 갱신 시점은 다를 수 있습니다. 자료 수집일: {DATA_DATE}</p>
        <p className="mt-1">
          전체 사업자 요금과 실시간 정보는{" "}
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            무공해차 통합누리집
          </a>
          에서, 가장 정확한 공식 요금은 각 사업자 앱에서 확인하세요.
        </p>
      </div>
    </div>
  );
}
