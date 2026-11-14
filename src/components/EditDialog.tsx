import { useEffect, useRef } from "react";
import type { Todo, TodoSaveHandler } from "@/types/todo";
import TodoForm from "./TodoForm";

type EditDialogProps = {
  todo: Todo;
  onSave: TodoSaveHandler;
  onCancel: () => void;
  pending?: boolean;
  persistent?: boolean;
};

export default function EditDialog({ todo, onSave, onCancel, pending = false, persistent = false }: EditDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // React의 편집 상태와 브라우저의 실제 모달을 맞춥니다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id="edit-dialog"
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-note"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-[90%] max-w-xl rounded-lg p-6 bg-yellow-50 backdrop:bg-black/80"
    >
      <h2 id="edit-dialog-title" className="mb-4 text-3xl font-bold text-center tracking-[10px] text-orange-300">
        할 일 수정
      </h2>
      <p id="edit-dialog-note" className="mb-4 text-sm leading-7 text-amber-800">
        {persistent ? "저장이 끝나면 내 계정의 DB에 반영됩니다." : "수정한 내용은 현재 화면에만 반영됩니다."}
      </p>
      <div id="edit-form-area">
        <TodoForm variant="edit" initialValues={todo} onSave={onSave} disabled={pending} />
      </div>
      <div className="px-4">
        <button
          type="button"
          id="cancel-edit"
          onClick={onCancel}
          disabled={pending}
          className="bg-red-200 hover:bg-amber-300 w-1/2 max-w-xs py-3 px-2 rounded-md text-white text-xl block mx-auto mt-4 cursor-pointer"
        >
          취소
        </button>
      </div>
    </dialog>
  );
}
