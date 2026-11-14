# Todo 리스트 (Next.js + Supabase)

기존 JS Todo를 Next.js로 옮겼습니다. 로그인한 사용자는 본인 할 일을 등록·조회·수정·삭제하고 완료 상태를 바꿀 수 있습니다. Supabase의 RLS 정책이 다른 사용자의 할 일 접근을 제한합니다.

## 실행

1. `.env.example`을 참고해 `.env.local`을 준비합니다.
2. `npm ci` 및 `npm run dev`를 실행합니다.
3. 브라우저에서 http://localhost:3000을 엽니다.

`/todos`는 회원 전용 목록, `/todos/[id]`는 서버에서 조회하는 상세 화면입니다. `/demo`는 DB가 없는 별도 연습 화면입니다.

DB가 비어 있는 새 Supabase 프로젝트를 만들 때만 [테이블·정책 SQL](docs/supabase-setup.sql)을 참고합니다. 기존 프로젝트에는 재실행하지 않습니다.

## 확인

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`

## 수정 기록

- 회원가입 버튼 아래에 처리 중·이메일 확인·발송 한도(429) 안내를 추가했습니다. 안내를 못 보고 가입 버튼을 다시 누르는 혼동을 줄이기 위한 수정입니다. Supabase의 메일 발송 한도나 인증 정책은 변경하지 않았습니다.
- 배포 주소: [Vercel Todo](https://project-qy5xx.vercel.app)
