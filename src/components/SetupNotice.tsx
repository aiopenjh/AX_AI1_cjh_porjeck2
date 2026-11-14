import Link from "next/link";

export default function SetupNotice() {
  return (
    <section className="m-4 rounded-xl border border-orange-200 bg-yellow-50 p-6 text-amber-800">
      <h1 className="mb-3 text-2xl font-bold text-rose-800">Supabase 연결 설정이 필요합니다</h1>
      <p className="leading-8">현재 실행 환경에 프로젝트 주소와 공개 키가 준비되지 않아 회원 데이터는 조회하지 않았습니다. 연결 설정 후 로그인과 DB 동작을 확인해야 합니다.</p>
      <p className="mt-4 leading-8">DB와 연결되지 않는 기존 연습 화면은 별도로 사용할 수 있습니다.</p>
      <Link className="mt-4 inline-block underline underline-offset-4" href="/demo">로컬 연습 화면 열기</Link>
    </section>
  );
}
