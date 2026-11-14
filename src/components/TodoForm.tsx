import { useRef, useState, type FormEvent } from "react";
import type { TodoDraft, TodoSaveHandler } from "@/types/todo";
import { validateTodoDraft } from "@/lib/todo-data";

type TodoFormProps = {
  variant: "add" | "edit";
  initialValues?: TodoDraft;
  onSave: TodoSaveHandler;
  disabled?: boolean;
};

export default function TodoForm({ variant, initialValues, onSave, disabled = false }: TodoFormProps) {
  const prefix = variant === "add" ? "add" : "edit";
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const pending = disabled || submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || submitLock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: TodoDraft = {
      date: String(data.get("date") ?? "").trim(),
      title: String(data.get("title") ?? "").trim(),
      content: String(data.get("content") ?? "").trim(),
    };
    const fields: [keyof TodoDraft, string][] = [
      ["date", "날짜를 선택해 주세요."],
      ["title", "제목을 입력해 주세요."],
      ["content", "내용을 입력해 주세요."],
    ];
    for (const [field, message] of fields) {
      if (!values[field]) {
        setError(message);
        form.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
        return;
      }
    }
    const validated = validateTodoDraft(values);
    if (!validated.ok) {
      setError(validated.error);
      form.querySelector<HTMLInputElement>('[name="date"]')?.focus();
      return;
    }
    setError("");
    submitLock.current = true;
    setSubmitting(true);
    try {
      const message = await onSave(validated.data);
      if (message) {
        setError(message);
        return;
      }
      if (variant === "add") {
        form.reset();
        form.querySelector<HTMLInputElement>('[name="title"]')?.focus();
      }
    } catch {
      setError("저장하지 못했습니다. 입력을 확인하고 다시 시도해 주세요.");
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      name={variant === "add" ? "frmTodo" : "frmEditTodo"}
      className="px-4"
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={error ? `${prefix}-error migration-status` : "migration-status"}
    >
      {error && (
        <p id={prefix + "-error"} role="alert" className="mb-3 text-red-700">{error}</p>
      )}
      <fieldset disabled={pending} className="min-w-0">
        <dl className="flex mb-3">
          <dt className="basis-[150px] p-1 bg-yellow-50 text-yellow-700 flex items-center justify-center mr-2 rounded-md border border-orange-200">
            <label htmlFor={`${prefix}-date`}>날짜</label>
          </dt>
          <dd className="grow">
            <input
              id={`${prefix}-date`}
              type="date"
              name="date"
              defaultValue={initialValues?.date ?? ""}
              placeholder="날짜 입력"
              className="h-11 w-full rounded-lg border border-orange-200 bg-gray-50 px-3 text-yellow-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </dd>
        </dl>
        <dl className="flex mb-3">
          <dt className="basis-[150px] p-1 bg-yellow-50 text-yellow-700 flex items-center justify-center mr-2 rounded-md border border-orange-200">
            <label htmlFor={`${prefix}-title`}>제목</label>
          </dt>
          <dd className="grow">
            <input
              id={`${prefix}-title`}
              type="text"
              name="title"
              defaultValue={initialValues?.title ?? ""}
              autoFocus={variant === "edit"}
              placeholder="제목 입력"
              className="h-11 w-full rounded-lg border border-orange-200 bg-gray-50 px-3 text-yellow-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </dd>
        </dl>
        <dl className="flex mb-8">
          <dt className="basis-[150px] p-1 bg-yellow-50 text-yellow-700 flex items-center justify-center mr-2 rounded-md border border-orange-200">
            <label htmlFor={`${prefix}-content`}>내용</label>
          </dt>
          <dd className="grow">
            <textarea
              id={`${prefix}-content`}
              name="content"
              defaultValue={initialValues?.content ?? ""}
              placeholder="내용 입력"
              className="h-25 w-full rounded-lg border border-orange-200 bg-gray-50 p-4 text-yellow-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 block"
            />
          </dd>
        </dl>
        <button
          type="submit"
          disabled={pending}
          onClick={(event) => {
            // 마우스 두 번 클릭의 두 번째 전송을 막습니다.
            if (event.detail > 1) event.preventDefault();
          }}
          className="bg-yellow-100 hover:bg-yellow-50 w-1/2 max-w-xs py-3 px-2 rounded-md text-yellow-700 text-xl block mx-auto cursor-pointer border-2 border-orange-300 rounded-lg disabled:cursor-not-allowed"
        >
          {pending ? "저장 중…" : variant === "add" ? "등록하기" : "수정 저장"}
        </button>
      </fieldset>
    </form>
  );
}
