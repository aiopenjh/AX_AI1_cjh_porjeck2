"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup } from "@/app/auth/actions";

export default function AuthForm({ variant, disabled = false }: { variant: "login" | "signup"; disabled?: boolean }) {
  const [state, action, pending] = useActionState(variant === "login" ? login : signup, { error: "", message: "" });
  const title = variant === "login" ? "로그인" : "회원가입";
  return (
    <section className="mx-auto max-w-md rounded-xl border border-orange-200 bg-yellow-50 p-6">
      <h1 className="mb-4 text-2xl font-bold text-rose-800">{title}</h1>
      {disabled && <p className="mb-4 text-amber-800">Supabase 연결 설정 전에는 인증 요청을 보낼 수 없습니다.</p>}
      {state.error && <p role="alert" className="mb-3 text-red-700">{state.error}</p>}
      {state.message && <p role="status" className="mb-3 text-amber-800">{state.message}</p>}
      <form action={action}>
        <fieldset disabled={disabled || pending} className="grid gap-3">
          <label htmlFor="auth-email">이메일</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" required className="rounded border border-orange-200 bg-white p-3" />
          <label htmlFor="auth-password">비밀번호</label>
          <input id="auth-password" name="password" type="password" minLength={variant === "signup" ? 6 : undefined} autoComplete={variant === "signup" ? "new-password" : "current-password"} required className="rounded border border-orange-200 bg-white p-3" />
          <button type="submit" disabled={disabled || pending} className="mt-3 rounded-lg border border-orange-300 bg-yellow-100 p-3 text-amber-800 disabled:cursor-not-allowed">
            {pending ? "처리 중…" : title}
          </button>
        </fieldset>
      </form>
      <p className="mt-5 text-sm"><Link className="underline" href={variant === "login" ? "/signup" : "/login"}>{variant === "login" ? "회원가입으로 이동" : "로그인으로 이동"}</Link></p>
    </section>
  );
}
