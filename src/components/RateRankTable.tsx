type RateRow = {
  name: string;
  price: number;
  count: number;
  updated: string;
};

function formatPrice(n: number) {
  return (Number.isInteger(n) ? String(n) : n.toFixed(1)) + "원";
}

function formatCount(n: number) {
  return n.toLocaleString("ko-KR") + "기";
}

export default function RateRankTable({
  title,
  badge,
  badgeColor,
  rows,
}: {
  title: string;
  badge: string;
  badgeColor: "good" | "bad";
  rows: RateRow[];
}) {
  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            badgeColor === "good"
              ? "bg-[#0ca30c]/10 text-[#0ca30c]"
              : "bg-[#d03b3b]/10 text-[#d03b3b]"
          }`}
        >
          {badge}
        </span>
        <p className="text-sm font-semibold">{title}</p>
      </div>

      <div className="mt-3 flex flex-col">
        {rows.map((row, i) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-3 border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-4 text-black/40 dark:text-white/40">{i + 1}</span>
              <span className="font-medium">{row.name}</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="text-black/40 dark:text-white/40">{formatCount(row.count)} 보유</span>
              <span className="w-16 font-semibold">{formatPrice(row.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
