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
    if (error) {
      if (error.code === "email_address_invalid") {
        return { error: "인증 메일을 받을 수 있는 실제 이메일 주소를 입력해 주세요.", message: "" };
      }
      if (error.code === "over_email_send_rate_limit") {
        return { error: "메일 요청이 너무 많습니다. 잠시 뒤 다시 시도해 주세요.", message: "" };
      }
      return { error: "가입 요청을 처리하지 못했습니다. 입력값과 인증 설정을 확인해 주세요.", message: "" };
    }
    signedIn = Boolean(data.session);
  } catch {
    return { error: "가입 서버에 연결하지 못했습니다. 설정을 확인해 주세요.", message: "" };
  }
  if (signedIn) {
    revalidatePath("/", "layout");
    redirect("/todos");
  }
  return { error: "", message: "아직 로그인되지 않았습니다. 처음 가입한 이메일이라면 받은 인증 링크를 가입을 시작한 브라우저에서 열어 주세요. 이미 가입한 이메일이라면 기존 비밀번호로 로그인하세요." };
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
