"use client";

import { useEffect, useRef, useState } from "react";
import { addTodo, deleteTodo, loadTodos, setTodoCompleted, updateTodo } from "@/app/actions";
import type { Result } from "@/lib/todo-data";
import type { Todo, TodoDraft } from "@/types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import EditDialog from "./EditDialog";

export default function TodoWorkspace() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [loadVersion, setLoadVersion] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  const mutationLock = useRef(false);
  const sorted = [...todos].sort((a, b) => a.date.localeCompare(b.date));

  // 화면을 떠나거나 재시도한 뒤에는 이전 응답을 반영하지 않습니다.
  useEffect(() => {
    let active = true;
    loadTodos().then((result) => {
      if (!active) return;
      if (result.ok) {
        setTodos(result.data);
        setStatus("success");
      } else {
        setError(result.error);
        setStatus("error");
      }
    }).catch(() => {
      if (active) {
        setError("통신에 실패했습니다. 다시 시도해 주세요.");
        setStatus("error");
      }
    });
    return () => { active = false; };
  }, [loadVersion]);

  async function run<T>(request: () => Promise<Result<T>>): Promise<Result<T>> {
    if (mutationLock.current) return { ok: false, error: "다른 요청을 처리 중입니다." };
    mutationLock.current = true;
    setPending(true);
    setError("");
    try {
      return await request();
    } catch {
      return { ok: false, error: "요청을 완료하지 못했습니다. 다시 시도해 주세요." };
    } finally {
      mutationLock.current = false;
      setPending(false);
    }
  }

  async function create(values: TodoDraft) {
    const result = await run(() => addTodo(values));
    if (!result.ok) return result.error;
    setTodos((current) => [...current, result.data]);
    setNotice("할 일을 저장했습니다.");
    return null;
  }

  async function save(values: TodoDraft) {
    if (!editing) return "수정할 항목을 다시 선택해 주세요.";
    const uid = editing.uid;
    const result = await run(() => updateTodo(uid, values));
    if (!result.ok) return result.error;
    setTodos((current) => current.map((todo) => todo.uid === uid ? result.data : todo));
    setEditing(null);
    setNotice("수정 내용을 저장했습니다.");
    return null;
  }

  async function remove(uid: string) {
    const result = await run(() => deleteTodo(uid));
    if (!result.ok) { setError(result.error); return; }
    setTodos((current) => current.filter((todo) => todo.uid !== uid));
    setNotice("할 일을 삭제했습니다.");
  }

  async function toggle(uid: string) {
    const todo = todos.find((item) => item.uid === uid);
    if (!todo) return;
    const result = await run(() => setTodoCompleted(uid, !todo.done));
    if (!result.ok) { setError(result.error); return; }
    setTodos((current) => current.map((item) => item.uid === uid ? result.data : item));
    setNotice("완료 상태를 저장했습니다.");
  }

  if (status === "loading") return <p role="status" className="m-4 text-amber-800">할 일을 불러오는 중…</p>;
  if (status === "error") {
    return (
      <section className="m-4 rounded-lg border border-orange-200 p-5">
        <p role="alert" className="text-red-700">{error}</p>
        <button className="mt-3 rounded bg-yellow-100 p-3" onClick={() => { setStatus("loading"); setError(""); setLoadVersion((value) => value + 1); }}>다시 시도</button>
      </section>
    );
  }
  return (
    <>
      <TodoForm variant="add" onSave={create} disabled={pending} />
      <p role="status" className="mx-4 mt-4 min-h-7 text-sm text-amber-800">{pending ? "변경 내용을 처리하는 중…" : notice}</p>
      {error && <p role="alert" className="m-4 text-red-700">{error}</p>}
      <TodoList todos={sorted} onEdit={(todo) => { setError(""); setEditing(todo); }} onDelete={remove} onToggle={toggle} disabled={pending} details />
      {editing && <EditDialog key={editing.uid} todo={editing} onSave={save} onCancel={() => setEditing(null)} pending={pending} persistent />}
    </>
  );
}
