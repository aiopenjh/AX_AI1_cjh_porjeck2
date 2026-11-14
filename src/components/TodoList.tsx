import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (uid: string) => void;
  onToggle: (uid: string) => void;
  disabled?: boolean;
  details?: boolean;
};

export default function TodoList({ todos, onEdit, onDelete, onToggle, disabled = false, details = false }: TodoListProps) {
  return (
    <section aria-labelledby="todo-list-title">
      <h2 id="todo-list-title" className="mx-4 mt-6 text-sm text-amber-800">
        현재 화면의 할 일 {todos.length}개 · 날짜순
      </h2>
      {todos.length === 0 ? (
        <p className="m-4 rounded-lg border border-orange-200 p-5 text-amber-800">
          등록된 할 일이 없습니다. 위 폼에서 새로 등록해 주세요.
        </p>
      ) : (
        <ul id="todo-lists" className="m-4 p-4 grid grid-cols-3 gap-4">
          {todos.map((todo) => (
            <TodoItem key={todo.uid} todo={todo} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} disabled={disabled} details={details} />
          ))}
        </ul>
      )}
    </section>
  );
}
