export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-black/60 dark:text-white/60">
        © {new Date().getFullYear()} 전기차 한눈에. 전기차 오너를 위한 정보 공유 페이지입니다.
      </div>
    </footer>
  );
}
