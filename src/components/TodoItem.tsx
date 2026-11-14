import type { Todo } from "@/types/todo";
import Link from "next/link";

type TodoItemProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (uid: string) => void;
  onToggle: (uid: string) => void;
  disabled?: boolean;
  details?: boolean;
};

export default function TodoItem({ todo, onEdit, onDelete, onToggle, disabled = false, details = false }: TodoItemProps) {
  return (
    <li
      id={`item-${todo.uid}`}
      className="relative flex flex-col rounded-xl border border-yellow-200 bg-yellow-50 p-2 shadow-sm transition-shadow hover:shadow-md"
      aria-describedby="migration-status"
    >
      <div className="mb-2">
        <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-orange-700">
          {todo.date}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold text-rose-800 break-words">
        {details ? <Link className="underline underline-offset-4" href={`/todos/${encodeURIComponent(todo.uid)}`}>{todo.title}</Link> : todo.title}
        {todo.done && <span className="text-sm text-amber-700"> (완료)</span>}
      </h3>
      <p className="mb-5 whitespace-pre-wrap text-sm leading-7 text-amber-700 break-words">
        {todo.content}
      </p>
      <div className="mt-auto flex gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"

          onClick={() => onEdit(todo)}
          disabled={disabled}
          className="edit-action flex-1 rounded-lg bg-amber-100 py-0.5 text-lg font-medium text-orange-400 hover:bg-amber-300 cursor-pointer disabled:cursor-not-allowed"
        >
          수정
        </button>
        <button
          type="button"

          onClick={() => onDelete(todo.uid)}
          disabled={disabled}
          className="delete-action flex-1 rounded-lg bg-amber-200 py-0.5 text-lg font-medium text-amber-600 hover:bg-amber-300 hover:rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          삭제
        </button>
        <label className="absolute top-4 right-4 h-6 w-6 cursor-pointer">
          <input
            type="checkbox"
            checked={todo.done}
            disabled={disabled}
            onChange={() => onToggle(todo.uid)}

            className="complete-action peer appearance-none block h-6 w-6 rounded border border-amber-400 bg-amber-100 checked:bg-amber-500 checked:border-amber-600 focus-visible:outline-2 focus-visible:outline-amber-700 cursor-pointer disabled:cursor-not-allowed"
            aria-label={`${todo.title} 완료`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-bold text-red-900 opacity-0 peer-checked:opacity-100"
          >
            ✓
          </span>
        </label>
      </div>
    </li>
  );
}
