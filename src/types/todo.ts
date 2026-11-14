export type Todo = {
  uid: string;
  date: string;
  title: string;
  content: string;
  done: boolean;
};

export type TodoDraft = Pick<Todo, "date" | "title" | "content">;

// 오류 메시지를 반환하면 폼 입력을 지우지 않고 표시합니다.
export type TodoSaveHandler = (values: TodoDraft) => void | string | null | Promise<void | string | null>;
