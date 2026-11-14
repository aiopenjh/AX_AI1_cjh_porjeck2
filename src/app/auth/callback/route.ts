import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL("/todos", request.url));
    } catch {
      // 인증 코드나 토큰을 오류 메시지에 포함하지 않습니다.
    }
  }
  return NextResponse.redirect(new URL("/login?error=confirmation", request.url));
}
