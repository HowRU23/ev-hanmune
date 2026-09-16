import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ⚡ 전기차 한눈에
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600">
            홈
          </Link>
          <Link href="/guides" className="hover:text-blue-600">
            가이드
          </Link>
          <Link href="/tools/ev-subsidy" className="hover:text-blue-600">
            보조금 찾기
          </Link>
          <Link href="/tools/cost-calculator" className="hover:text-blue-600">
            유지비 계산기
          </Link>
          <Link href="/tools/charging-rates" className="hover:text-blue-600">
            충전 요금 비교
          </Link>
        </nav>
      </div>
    </header>
  );
}
