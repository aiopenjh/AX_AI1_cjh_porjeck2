import TodoWorkspace from "@/components/LocalTodoWorkspace";
import type { Todo } from "@/types/todo";

// 개발용 예시이며 실제 사용자 데이터나 DB 조회 결과가 아닙니다.
const initialTodos: Todo[] = [
  { uid: "sample-1", date: "2026-11-03", title: "예시: JSX 복습", content: "원본 HTML과 컴포넌트 구조를 비교합니다.", done: false },
  { uid: "sample-2", date: "2026-11-01", title: "예시: Props 살펴보기", content: "목록에서 카드로 전달하는 값을 확인합니다.", done: false },
  { uid: "sample-3", date: "2026-11-02", title: "예시: 완료 상태 확인", content: "체크박스를 눌러 완료 표시를 바꿔 봅니다.", done: true },
];

export default function Home() {
  return (
    <main>
      <h1 className="bg-yellow-50 text-orange-500 px-5 py-2 text-3xl text-center mb-4 tracking-[10px]">
        할 일을 등록하세요
      </h1>
      <p
        id="migration-status"
        className="mx-4 mb-4 rounded-lg border border-orange-200 bg-yellow-50 p-3 text-sm leading-7 text-amber-800"
      >
        로컬 연습용 화면입니다. 처음 보이는 3개는 개발용 예시입니다.
        등록·수정·삭제·완료는 현재 화면에서만 작동하며 새로고침하면 예시로 돌아갑니다.
        회원가입·로그인·DB 저장은 아직 연결되지 않았습니다.
      </p>
      <TodoWorkspace initialTodos={initialTodos} />
    </main>
  );
}
