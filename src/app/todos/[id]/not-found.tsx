import Link from "next/link";

export default function NotFound() {
  return <main className="m-6 text-amber-800"><h1 className="text-2xl font-bold">할 일을 찾을 수 없습니다</h1><p className="my-4">존재하지 않거나 볼 수 없는 항목입니다.</p><Link href="/todos" className="underline">목록으로 돌아가기</Link></main>;
}
