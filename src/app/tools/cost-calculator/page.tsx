"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CostResult from "@/components/CostResult";

const FUEL_PRICE_DEFAULTS: Record<"gasoline" | "diesel", number> = {
  gasoline: 1859,
  diesel: 1844,
};

const EV_EFFICIENCY_PRESETS: { label: string; value: number }[] = [
  { label: "EV3 롱레인지", value: 5.4 },
  { label: "EV5 롱레인지", value: 5.0 },
  { label: "아이오닉5 롱레인지", value: 5.2 },
  { label: "아이오닉9", value: 4.3 },
];

export default function CostCalculatorPage() {
  const [distance, setDistance] = useState("");
  const [iceEfficiency, setIceEfficiency] = useState("");
  const [fuelType, setFuelType] = useState<"gasoline" | "diesel">("gasoline");
  const [fuelPrice, setFuelPrice] = useState(String(FUEL_PRICE_DEFAULTS.gasoline));
  const [evEfficiency, setEvEfficiency] = useState("");
  const [chargePrice, setChargePrice] = useState("");

  const handleFuelTypeChange = (type: "gasoline" | "diesel") => {
    setFuelType(type);
    setFuelPrice(String(FUEL_PRICE_DEFAULTS[type]));
  };

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const ice = parseFloat(iceEfficiency);
    const fp = parseFloat(fuelPrice);
    const ev = parseFloat(evEfficiency);
    const cp = parseFloat(chargePrice);

    if (![d, ice, fp, ev, cp].every((n) => Number.isFinite(n) && n > 0)) {
      return null;
    }

    const fuelCost = (d / ice) * fp;
    const chargeCost = (d / ev) * cp;
    return { fuelCost, chargeCost, saved: fuelCost - chargeCost };
  }, [distance, iceEfficiency, fuelPrice, evEfficiency, chargePrice]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 홈으로
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">유지비 계산기</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">
        내 주행거리를 기준으로 내연기관차와 전기차의 연간 연료비를 직접 비교해보세요. 본인 차량의 공인 연비/전비를 입력하면 정확도가 올라갑니다.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">연간 주행거리 (km)</span>
          <input
            type="number"
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="예: 15000"
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
          />
          <div className="flex flex-wrap gap-2">
            {[10000, 15000, 20000, 25000].map((km) => (
              <button
                key={km}
                onClick={() => setDistance(String(km))}
                className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/60"
              >
                {(km / 10000).toLocaleString("ko-KR")}만km
              </button>
            ))}
          </div>
        </label>

        <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm font-semibold">내연기관차</p>
          <div className="mt-3 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm">공인 연비 (km/L)</span>
              <input
                type="number"
                inputMode="decimal"
                value={iceEfficiency}
                onChange={(e) => setIceEfficiency(e.target.value)}
                placeholder="예: 12.5"
                className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
              />
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => handleFuelTypeChange("gasoline")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  fuelType === "gasoline"
                    ? "bg-blue-600 text-white"
                    : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                }`}
              >
                휘발유
              </button>
              <button
                onClick={() => handleFuelTypeChange("diesel")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  fuelType === "diesel"
                    ? "bg-blue-600 text-white"
                    : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                }`}
              >
                경유
              </button>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm">유가 (원/L)</span>
              <input
                type="number"
                inputMode="decimal"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
              />
              <span className="text-xs text-black/40 dark:text-white/40">
                기본값은 오피넷 2026-09-14 전국평균. 본인 동네 가격으로 바꿔도 됩니다.
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm font-semibold">전기차</p>
          <div className="mt-3 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm">공인 전비 (km/kWh)</span>
              <input
                type="number"
                inputMode="decimal"
                value={evEfficiency}
                onChange={(e) => setEvEfficiency(e.target.value)}
                placeholder="예: 5.5"
                className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
              />
              <div className="flex flex-wrap gap-2">
                {EV_EFFICIENCY_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setEvEfficiency(String(preset.value))}
                    className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/60"
                  >
                    {preset.label}(약 {preset.value})
                  </button>
                ))}
              </div>
              <span className="text-xs text-black/40 dark:text-white/40">
                본인 차량의 공인 전비는 자동차 등록증이나 제조사 홈페이지에서 확인할 수 있습니다. 실제 운행 전비는 운전 습관·날씨·속도에 따라 공인전비와 다를 수 있습니다.
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm">충전단가 (원/kWh)</span>
              <input
                type="number"
                inputMode="decimal"
                value={chargePrice}
                onChange={(e) => setChargePrice(e.target.value)}
                placeholder="본인이 실제로 내는 단가를 입력하세요"
                className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setChargePrice("300")}
                  className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/60"
                >
                  공용 완속(약 300원)
                </button>
                <button
                  onClick={() => setChargePrice("345")}
                  className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/60"
                >
                  공용 급속(약 345원)
                </button>
              </div>
              <span className="text-xs text-black/40 dark:text-white/40">
                집에서 충전한다면 관리사무소나 명세서에서 확인한 실제 단가를 직접 입력하는 게 가장 정확합니다. 아파트마다 계약 방식이 달라 대표 단가를 제공하지 않습니다.
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm font-semibold text-black/60 dark:text-white/60">계산 결과</p>
        {result ? (
          <div className="mt-4">
            <CostResult fuelCost={result.fuelCost} chargeCost={result.chargeCost} />
          </div>
        ) : (
          <p className="mt-3 text-sm text-black/40 dark:text-white/40">
            모든 항목을 입력하면 결과가 여기 나타납니다.
          </p>
        )}
      </div>
    </div>
  );
}
