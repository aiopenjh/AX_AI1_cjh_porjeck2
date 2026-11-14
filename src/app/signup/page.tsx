import AuthForm from "@/components/AuthForm";
import SetupNotice from "@/components/SetupNotice";
import { getSupabaseConfig } from "@/utils/supabase/config";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const configured = Boolean(getSupabaseConfig());
  return <main className="py-8">{!configured && <SetupNotice />}<AuthForm variant="signup" disabled={!configured} /></main>;
}
