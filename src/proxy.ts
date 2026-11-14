import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

// 수업의 middleware.ts는 이 프로젝트의 Next.js 16에서 proxy.ts로 부릅니다.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = { matcher: ["/todos/:path*", "/login", "/signup"] };
