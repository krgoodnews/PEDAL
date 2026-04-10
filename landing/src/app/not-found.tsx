import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-[#8b5cf6]/20 blur-[120px]" />
        <div className="absolute -right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#00d4ff]/15 blur-[120px]" />
      </div>

      <div className="glass rounded-3xl p-12 max-w-lg w-full">
        <p className="text-sm font-mono text-white/40 mb-4">404</p>
        <h1 className="text-5xl font-extrabold mb-4">
          <span className="gradient-text">페이지 없음</span>
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          요청하신 페이지를 찾을 수 없습니다.
          <br />
          PEDAL 워크플로가 이 갭을 분석 중입니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
