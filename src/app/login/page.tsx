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
      {params.error === "confirmation" && <p role="alert" className="m-4 text-red-700">이메일 인증으로 로그인하지 못했습니다. 가입을 시작한 브라우저에서 인증 링크를 다시 열거나, 이미 인증했다면 기존 계정으로 로그인해 주세요.</p>}
      <AuthForm variant="login" disabled={!configured} />
    </main>
  );
}
