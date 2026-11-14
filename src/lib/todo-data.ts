import type { Todo, TodoDraft } from "../types/todo.ts";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export function validateTodoDraft(input: unknown): Result<TodoDraft> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "입력 내용을 확인해 주세요." };
  }
  const raw = input as Record<string, unknown>;
  const values = {
    date: typeof raw.date === "string" ? raw.date.trim() : "",
    title: typeof raw.title === "string" ? raw.title.trim() : "",
    content: typeof raw.content === "string" ? raw.content.trim() : "",
  };
  if (!values.date) return { ok: false, error: "날짜를 선택해 주세요." };
  if (!values.title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!values.content) return { ok: false, error: "내용을 입력해 주세요." };
  const date = new Date(`${values.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== values.date) {
    return { ok: false, error: "올바른 날짜를 선택해 주세요." };
  }
  return { ok: true, data: values };
}

export function parseTodoId(uid: unknown): number | null {
  if (typeof uid !== "string" || !/^[1-9]\d*$/.test(uid)) return null;
  const id = Number(uid);
  return Number.isSafeInteger(id) ? id : null;
}

// DB의 id·is_completed를 기존 화면의 uid·done으로 옮겨 디자인을 유지합니다.
export function toTodo(row: unknown): Todo {
  if (!row || typeof row !== "object") throw new Error("할 일 데이터 형식 오류");
  const value = row as Record<string, unknown>;
  const id = parseTodoId(String(value.id));
  const draft = validateTodoDraft(value);
  if (id === null || !draft.ok || typeof value.is_completed !== "boolean") {
    throw new Error("할 일 데이터 형식 오류");
  }
  return { uid: String(id), ...draft.data, done: value.is_completed };
}
