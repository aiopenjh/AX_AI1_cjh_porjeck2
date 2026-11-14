import AuthForm from "@/components/AuthForm";
import SetupNotice from "@/components/SetupNotice";
import { getSupabaseConfig } from "@/utils/supabase/config";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(getSupabaseConfig());
  return (
    <main className="py-8">
      {!configured && <SetupNotice />}
      {params.error === "confirmation" && <p role="alert" className="m-4 text-red-700">이메일 확인을 완료하지 못했습니다. 링크를 다시 확인해 주세요.</p>}
      <AuthForm variant="login" disabled={!configured} />
    </main>
  );
}
