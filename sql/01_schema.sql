-- CH2 실습: 개인 쇼핑몰 과제의 새 DB에서만 실행합니다.
-- 회원과 상품을 먼저 만들고, 주문에서 두 표의 기본키를 참조합니다.
begin;

create table public.members (
    id bigint generated always as identity primary key,
    name text not null check (btrim(name) <> ''),
    email text not null unique
);

create table public.products (
    id bigint generated always as identity primary key,
    name text not null check (btrim(name) <> ''),
    price integer not null check (price >= 0)
);

-- 실습에서는 주문 한 건을 상품 한 종류로 단순화합니다.
create table public.orders (
    id bigint generated always as identity primary key,
    member_id bigint not null references public.members(id),
    product_id bigint not null references public.products(id),
    quantity integer not null check (quantity > 0)
);

-- 연결·인증 확인 후 접근 정책을 별도로 추가합니다.
alter table public.members enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

commit;
