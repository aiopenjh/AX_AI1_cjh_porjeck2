-- 2026-11-03 새 Todosupabase 프로젝트에 적용 완료. 기존 테이블에 재실행하지 않습니다.
-- 기존 todos 테이블이 있으면 중단하고 구조부터 비교합니다. 기존 데이터는 지우지 않습니다.
begin;

create table public.todos (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  date date not null,
  title text not null check (length(btrim(title)) > 0),
  content text not null check (length(btrim(content)) > 0),
  is_completed boolean not null default false
);

create index todos_user_date_idx on public.todos(user_id, date, id);
alter table public.todos enable row level security;
revoke all on table public.todos from public, anon;
grant select, insert, update, delete on table public.todos to authenticated;
grant usage, select on sequence public.todos_id_seq to authenticated;

create policy "본인 할 일 조회" on public.todos for select to authenticated
using ((select auth.uid()) = user_id);

create policy "본인 할 일 추가" on public.todos for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "본인 할 일 수정" on public.todos for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "본인 할 일 삭제" on public.todos for delete to authenticated
using ((select auth.uid()) = user_id);

commit;
