import { redirect } from "next/navigation";
import TodoWorkspace from "@/components/TodoWorkspace";
import UserProfile from "@/components/UserProfile";
import SetupNotice from "@/components/SetupNotice";
import { authenticatedClient } from "@/utils/supabase/server";
import { getSupabaseConfig } from "@/utils/supabase/config";

export const dynamic = "force-dynamic";

export default async function TodosPage() {
  if (!getSupabaseConfig()) return <main><SetupNotice /></main>;
  let email: string;
  try {
    email = (await authenticatedClient()).email;
  } catch {
    redirect("/login");
  }
  return (
    <main>
      <h1 className="bg-yellow-50 text-orange-500 px-5 py-2 text-3xl text-center mb-4 tracking-[10px]">할 일을 등록하세요</h1>
      <UserProfile email={email} />
      <p id="migration-status" className="mx-4 mb-4 text-sm leading-7 text-amber-800">로그인한 계정의 할 일을 조회하고 저장합니다. 제목을 누르면 상세 화면으로 이동합니다.</p>
      <TodoWorkspace />
    </main>
  );
}
