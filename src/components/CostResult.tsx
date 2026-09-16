function formatWon(n: number) {
  if (!Number.isFinite(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

export default function CostResult({
  fuelCost,
  chargeCost,
}: {
  fuelCost: number;
  chargeCost: number;
}) {
  const saved = fuelCost - chargeCost;
  const isSaving = saved >= 0;
  const maxValue = Math.max(fuelCost, chargeCost, 1);
  const percent = fuelCost > 0 ? Math.round((Math.abs(saved) / fuelCost) * 100) : 0;

  const bars = [
    { label: "내연기관차 (연료비)", value: fuelCost, color: "bg-[#eb6834] dark:bg-[#d95926]" },
    { label: "전기차 (충전비)", value: chargeCost, color: "bg-[#2a78d6] dark:bg-[#3987e5]" },
  ];

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isSaving
              ? "bg-[#0ca30c]/10 text-[#0ca30c]"
              : "bg-[#d03b3b]/10 text-[#d03b3b]"
          }`}
        >
          {isSaving ? "▼ 절감" : "▲ 추가 지출"} {percent}%
        </span>
      </div>

      <p
        className="mt-3 font-bold tracking-tight text-black dark:text-white"
        style={{ fontSize: 48, lineHeight: 1.1 }}
      >
        연 {formatWon(Math.abs(saved))}
      </p>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        {isSaving
          ? `전기차로 타면 매달 약 ${formatWon(Math.abs(saved) / 12)}씩 아낍니다.`
          : `이 조건에서는 전기차 충전비가 오히려 매달 약 ${formatWon(Math.abs(saved) / 12)}씩 더 듭니다.`}
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-medium">{bar.label}</span>
              <span className="text-black/70 dark:text-white/70">{formatWon(bar.value)}</span>
            </div>
            <div className="h-6 w-full rounded-[4px] bg-black/5 dark:bg-white/10">
              <div
                className={`h-6 rounded-[4px] ${bar.color}`}
                style={{ width: `${Math.max((bar.value / maxValue) * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
