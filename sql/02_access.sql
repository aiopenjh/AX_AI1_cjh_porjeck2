-- CH2 연습 전용. 비로그인 사용자는 접근할 수 없습니다.
begin;
alter table public.members add column owner_id uuid not null default auth.uid();
alter table public.products add column owner_id uuid not null default auth.uid();
alter table public.orders add column owner_id uuid not null default auth.uid();

-- 소유자가 같은 회원과 상품만 주문에서 연결할 수 있게 합니다.
alter table public.members add constraint members_owner_id_pair unique (owner_id, id);
alter table public.products add constraint products_owner_id_pair unique (owner_id, id);
alter table public.orders drop constraint orders_member_id_fkey,
    drop constraint orders_product_id_fkey,
    add constraint orders_member_owner_fk foreign key (owner_id, member_id)
        references public.members(owner_id, id),
    add constraint orders_product_owner_fk foreign key (owner_id, product_id)
        references public.products(owner_id, id);

revoke all on public.members, public.products, public.orders from anon;
grant select, insert, update, delete on public.members, public.products, public.orders to authenticated;
grant usage, select on sequence public.members_id_seq, public.products_id_seq, public.orders_id_seq to authenticated;

create policy course_members_own_rows on public.members for all to authenticated
    using ((select auth.uid()) = owner_id)
    with check ((select auth.uid()) = owner_id);
create policy course_products_own_rows on public.products for all to authenticated
    using ((select auth.uid()) = owner_id)
    with check ((select auth.uid()) = owner_id);
create policy course_orders_own_rows on public.orders for all to authenticated
    using ((select auth.uid()) = owner_id)
    with check ((select auth.uid()) = owner_id);
commit;
