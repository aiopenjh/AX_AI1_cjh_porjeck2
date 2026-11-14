import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { loadTodo } from "@/app/actions";
import { parseTodoId } from "@/lib/todo-data";
import { authenticatedClient } from "@/utils/supabase/server";
import { getSupabaseConfig } from "@/utils/supabase/config";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

// 상세는 서버에서 본인 데이터 한 건만 읽으므로 클라이언트 상태가 필요 없습니다.
export default async function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (parseTodoId(id) === null) notFound();
  if (!getSupabaseConfig()) return <main><SetupNotice /></main>;
  try { await authenticatedClient(); } catch { redirect("/login"); }
  const result = await loadTodo(id);
  if (!result.ok) return <main className="m-6"><p role="alert" className="text-red-700">{result.error}</p><Link href="/todos" className="mt-4 inline-block underline">목록으로 돌아가기</Link></main>;
  if (!result.data) notFound();
  const todo = result.data;
  return (
    <main className="mx-auto max-w-2xl p-6">
      <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
        <p className="text-orange-700">{todo.date}</p>
        <h1 className="my-4 break-words text-3xl font-bold text-rose-800">{todo.title}</h1>
        <p className="whitespace-pre-wrap break-words leading-8 text-amber-800">{todo.content}</p>
        <p className="mt-5 text-amber-800">상태: {todo.done ? "완료" : "진행 중"}</p>
      </article>
      <Link href="/todos" className="mt-5 inline-block text-amber-800 underline">목록으로 돌아가기</Link>
    </main>
  );
}
