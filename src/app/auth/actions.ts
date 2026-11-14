"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { AuthState } from "@/types/auth";

export async function login(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "이메일과 비밀번호를 입력해 주세요.", message: "" };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: "로그인하지 못했습니다. 이메일과 비밀번호를 확인해 주세요.", message: "" };
  } catch {
    return { error: "로그인 서버에 연결하지 못했습니다. 설정을 확인해 주세요.", message: "" };
  }
  revalidatePath("/", "layout");
  redirect("/todos");
}

export async function signup(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 6) {
    return { error: "이메일과 6자 이상의 비밀번호를 입력해 주세요.", message: "" };
  }
  let signedIn = false;
  try {
    const supabase = await createClient();
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: new URL("/auth/callback", site).toString() },
    });
    if (error) return { error: "가입 요청을 처리하지 못했습니다. 입력값과 인증 설정을 확인해 주세요.", message: "" };
    signedIn = Boolean(data.session);
  } catch {
    return { error: "가입 서버에 연결하지 못했습니다. 설정을 확인해 주세요.", message: "" };
  }
  if (signedIn) {
    revalidatePath("/", "layout");
    redirect("/todos");
  }
  return { error: "", message: "가입 요청을 처리했습니다. 이메일 확인이 필요한 경우 받은 메일의 링크를 눌러 주세요." };
}

export async function logout(previous: AuthState): Promise<AuthState> {
  void previous;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) return { error: "로그아웃하지 못했습니다. 다시 시도해 주세요.", message: "" };
  } catch {
    return { error: "로그아웃 서버에 연결하지 못했습니다.", message: "" };
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
