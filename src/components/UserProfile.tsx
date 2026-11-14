"use client";

import { useActionState } from "react";
import { logout } from "@/app/auth/actions";

export default function UserProfile({ email }: { email: string }) {
  const [state, action, pending] = useActionState(logout, { error: "", message: "" });
  return (
    <section className="m-4 rounded-lg border border-orange-200 bg-yellow-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="break-all text-amber-800">접속 계정: {email || "이메일 정보 없음"}</p>
        <form action={action}><button disabled={pending} className="shrink-0 rounded bg-amber-200 px-4 py-2 text-amber-800">{pending ? "처리 중…" : "로그아웃"}</button></form>
      </div>
      {state.error && <p role="alert" className="mt-3 text-red-700">{state.error}</p>}
    </section>
  );
}
