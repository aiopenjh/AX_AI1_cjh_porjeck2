"use server";

import { revalidatePath } from "next/cache";
import { authenticatedClient } from "@/utils/supabase/server";
import { parseTodoId, toTodo, validateTodoDraft, type Result } from "@/lib/todo-data";
import type { Todo, TodoDraft } from "@/types/todo";

const columns = "id,date,title,content,is_completed";
const connectionError = "데이터를 처리하지 못했습니다. 로그인과 DB 설정을 확인한 뒤 다시 시도해 주세요.";

export async function loadTodos(): Promise<Result<Todo[]>> {
  try {
    const { supabase, userId } = await authenticatedClient();
    const { data, error } = await supabase.from("todos").select(columns)
      .eq("user_id", userId).order("date", { ascending: true }).order("id", { ascending: true });
    if (error) return { ok: false, error: connectionError };
    return { ok: true, data: (data ?? []).map(toTodo) };
  } catch {
    return { ok: false, error: connectionError };
  }
}

export async function loadTodo(uid: string): Promise<Result<Todo | null>> {
  const id = parseTodoId(uid);
  if (id === null) return { ok: true, data: null };
  try {
    const { supabase, userId } = await authenticatedClient();
    const { data, error } = await supabase.from("todos").select(columns)
      .eq("id", id).eq("user_id", userId).maybeSingle();
    if (error) return { ok: false, error: connectionError };
    return { ok: true, data: data ? toTodo(data) : null };
  } catch {
    return { ok: false, error: connectionError };
  }
}

export async function addTodo(input: TodoDraft): Promise<Result<Todo>> {
  const values = validateTodoDraft(input);
  if (!values.ok) return values;
  try {
    const { supabase, userId } = await authenticatedClient();
    const { data, error } = await supabase.from("todos")
      .insert({ ...values.data, user_id: userId, is_completed: false }).select(columns).single();
    if (error || !data) return { ok: false, error: connectionError };
    revalidatePath("/todos");
    return { ok: true, data: toTodo(data) };
  } catch {
    return { ok: false, error: connectionError };
  }
}

export async function updateTodo(uid: string, input: TodoDraft): Promise<Result<Todo>> {
  const id = parseTodoId(uid);
  if (id === null) return { ok: false, error: "수정할 항목을 확인해 주세요." };
  const values = validateTodoDraft(input);
  if (!values.ok) return values;
  try {
    const { supabase, userId } = await authenticatedClient();
    const { data, error } = await supabase.from("todos").update(values.data)
      .eq("id", id).eq("user_id", userId).select(columns).single();
    if (error || !data) return { ok: false, error: connectionError };
    revalidatePath("/todos");
    revalidatePath(`/todos/${id}`);
    return { ok: true, data: toTodo(data) };
  } catch {
    return { ok: false, error: connectionError };
  }
}

export async function setTodoCompleted(uid: string, done: boolean): Promise<Result<Todo>> {
  const id = parseTodoId(uid);
  if (id === null || typeof done !== "boolean") return { ok: false, error: "완료 상태를 확인해 주세요." };
  try {
    const { supabase, userId } = await authenticatedClient();
    const { data, error } = await supabase.from("todos").update({ is_completed: done })
      .eq("id", id).eq("user_id", userId).select(columns).single();
    if (error || !data) return { ok: false, error: connectionError };
    revalidatePath("/todos");
    revalidatePath(`/todos/${id}`);
    return { ok: true, data: toTodo(data) };
  } catch {
    return { ok: false, error: connectionError };
  }
}

export async function deleteTodo(uid: string): Promise<Result<null>> {
  const id = parseTodoId(uid);
  if (id === null) return { ok: false, error: "삭제할 항목을 확인해 주세요." };
  try {
    const { supabase, userId } = await authenticatedClient();
    const { data, error } = await supabase.from("todos").delete()
      .eq("id", id).eq("user_id", userId).select("id").maybeSingle();
    if (error || !data) return { ok: false, error: connectionError };
    revalidatePath("/todos");
    revalidatePath(`/todos/${id}`);
    return { ok: true, data: null };
  } catch {
    return { ok: false, error: connectionError };
  }
}
