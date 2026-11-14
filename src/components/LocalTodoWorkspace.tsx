"use client";

import { useState } from "react";
import type { Todo, TodoDraft } from "@/types/todo";
import EditDialog from "./EditDialog";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

type TodoWorkspaceProps = {
  initialTodos: Todo[];
};

// 입력·클릭·상태 변경을 다루는 부분만 클라이언트에 둡니다.
export default function LocalTodoWorkspace({ initialTodos }: TodoWorkspaceProps) {
  const [todos, setTodos] = useState(initialTodos);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [notice, setNotice] = useState("");
  const sortedTodos = [...todos].sort((a, b) => a.date.localeCompare(b.date));

  function addTodo(values: TodoDraft) {
    const nextTodo: Todo = { ...values, uid: crypto.randomUUID(), done: false };
    setTodos((current) => [...current, nextTodo]);
    setNotice("현재 화면에 등록했습니다.");
  }

  function updateTodo(values: TodoDraft) {
    if (!editingTodo) return;
    setTodos((current) =>
      current.map((todo) =>
        todo.uid === editingTodo.uid ? { ...todo, ...values } : todo,
      ),
    );
    setEditingTodo(null);
    setNotice("현재 화면에서 수정했습니다.");
  }

  function removeTodo(uid: string) {
    setTodos((current) => current.filter((todo) => todo.uid !== uid));
    setNotice("현재 화면에서 삭제했습니다.");
  }

  function toggleTodo(uid: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.uid === uid ? { ...todo, done: !todo.done } : todo,
      ),
    );
    setNotice("완료 상태를 바꿨습니다.");
  }

  return (
    <>
      <TodoForm variant="add" onSave={addTodo} />
      <p role="status" className="mx-4 mt-4 min-h-7 text-sm text-amber-800">
        {notice}
      </p>
      <TodoList
        todos={sortedTodos}
        onEdit={(todo) => {
          setNotice("");
          setEditingTodo(todo);
        }}
        onDelete={removeTodo}
        onToggle={toggleTodo}
      />
      {editingTodo && (
        <EditDialog
          key={editingTodo.uid}
          todo={editingTodo}
          onSave={updateTodo}
          onCancel={() => {
            setEditingTodo(null);
            setNotice("수정을 취소했습니다.");
          }}
        />
      )}
    </>
  );
}
