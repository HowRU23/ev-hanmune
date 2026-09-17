import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "유지비 계산기",
  description: "내 주행거리를 기준으로 내연기관차와 전기차의 연간 연료비를 직접 비교해보세요.",
};

export default function CostCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
