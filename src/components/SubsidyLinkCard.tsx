"use client";

import { useEffect, useState, type ReactNode } from "react";

const TOSS_LINK = "https://minion.toss.im/zQshQ9j7";

export default function SubsidyLinkCard({ qrCode }: { qrCode: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="mt-10 rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
      <p className="text-sm font-semibold text-blue-600">토스 미니앱</p>
      <h2 className="mt-2 text-lg font-bold">전기차 보조금 찾기</h2>

      {isMobile && (
        <a
          href={TOSS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          토스 앱에서 열기
        </a>
      )}

      {isMobile === false && (
        <div className="mt-6 rounded-xl bg-black/5 p-4 text-sm text-black/70 dark:bg-white/10 dark:text-white/70">
          <p className="font-semibold">PC에서는 이 링크가 정상적으로 열리지 않습니다.</p>
          <p className="mt-1">아래 QR코드를 휴대폰 카메라로 찍어서 확인해주세요.</p>
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-2">
        {qrCode}
        <p className="text-xs text-black/40 dark:text-white/40">
          토스 앱이 없다면 먼저 앱스토어에서 설치한 뒤 QR을 찍어주세요.
        </p>
      </div>
    </div>
  );
}
