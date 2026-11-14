"""본 실행이 만든 행만 대상으로 하는 회원·상품·주문 CRUD 실습."""
from uuid import uuid4


def one(response):
    rows = response.data
    if not isinstance(rows, list) or len(rows) != 1 or "id" not in rows[0]:
        raise RuntimeError("한 행의 반환값을 확인하지 못했습니다. RLS와 반환 설정을 확인하세요.")
    return rows[0]


def run_crud(client, emit=print):
    created = []
    tag = uuid4().hex[:8]
    try:
        member = one(client.table("members").insert(
            {"name": "실습 회원", "email": f"test+{tag}@example.org"}).execute())
        created.append(("members", member["id"]))
        product = one(client.table("products").insert(
            {"name": f"실습 상품 {tag}", "price": 1000}).execute())
        created.append(("products", product["id"]))
        order = one(client.table("orders").insert(
            {"member_id": member["id"], "product_id": product["id"], "quantity": 1}).execute())
        created.append(("orders", order["id"]))
        changes = {"members": {"name": "수정 회원"}, "products": {"price": 1200},
                   "orders": {"quantity": 2}}
        for table, row_id in created:
            row = one(client.table(table).select("*").eq("id", row_id).execute())
            emit(f"{table}: 생성·조회 확인, id={row['id']}")
            one(client.table(table).update(changes[table]).eq("id", row_id).execute())
            row = one(client.table(table).select("*").eq("id", row_id).execute())
            if any(row.get(key) != value for key, value in changes[table].items()):
                raise RuntimeError(f"{table}: 수정 후 값 불일치")
            emit(f"{table}: 수정 후 재조회 확인")
    finally:
        failures = []
        # 주문을 먼저 삭제해야 부모 회원·상품의 외래키 제약을 지킵니다.
        for table, row_id in reversed(created):
            try:
                client.table(table).delete().eq("id", row_id).execute()
                if client.table(table).select("id").eq("id", row_id).execute().data:
                    raise RuntimeError("삭제 후 행이 남아 있습니다.")
                emit(f"{table}: 이번 실행 행 삭제·재조회 확인, id={row_id}")
            except Exception:
                failures.append(f"{table}:{row_id}")
        if failures:
            raise RuntimeError("정리 실패, 직접 확인할 이번 실행 ID: " + ", ".join(failures))
    emit("세 테이블 CRUD 검증 완료 (현재 로그인 계정 범위)")
