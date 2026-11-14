import test from "node:test";
import assert from "node:assert/strict";
import { parseTodoId, toTodo, validateTodoDraft } from "../src/lib/todo-data.ts";

test("입력 앞뒤 공백만 제거하고 줄바꿈·특수 문자는 보존", () => {
  assert.deepEqual(validateTodoDraft({date:" 2028-02-29 ",title:" 제목 ",content:" <b>내용</b>\n두 줄 "}), {
    ok: true, data: {date:"2028-02-29",title:"제목",content:"<b>내용</b>\n두 줄"},
  });
});

test("누락·공백·타입 오류 입력은 저장할 수 없음", () => {
  for (const input of [null, [], {}, {date:2}, {date:"2026-11-03",title:"  ",content:"내용"}, {date:"2026-11-03",title:"제목",content:" "}]) {
    assert.equal(validateTodoDraft(input).ok, false);
  }
});

test("없는 날짜·다른 날짜 형식·윤년이 아닌 2월 29일 거부", () => {
  for (const date of ["2026-02-29","2026-02-30","2026-13-01","26-01-01","2026-1-1","문자열"]) {
    assert.equal(validateTodoDraft({date,title:"제목",content:"내용"}).ok, false);
  }
});

test("클라이언트가 끼워 넣은 소유자와 완료 상태는 입력에서 제외", () => {
  const result = validateTodoDraft({date:"2026-11-03",title:"제목",content:"내용",user_id:"다른 사용자",is_completed:true});
  assert.equal(result.ok, true);
  assert.deepEqual(Object.keys(result.data).sort(), ["content","date","title"]);
});

test("DB 항목 ID는 정확한 양의 안전 정수만 허용", () => {
  assert.equal(parseTodoId("123"),123);
  for (const uid of ["0","-1","1.5","01","1 OR 1=1","9007199254740992","sample-1",null,1]) {
    assert.equal(parseTodoId(uid),null);
  }
});

test("튜터 DB 필드를 기존 카드 모델로 바꾸며 완료 상태 유지", () => {
  assert.deepEqual(toTodo({id:5,date:"2026-11-03",title:"제목",content:"내용",is_completed:true}), {
    uid:"5",date:"2026-11-03",title:"제목",content:"내용",done:true,
  });
});

test("DB 구조가 예제와 다르거나 정밀도를 잃은 ID는 오류로 처리", () => {
  for (const row of [null, {id:1,title:"제목"}, {id:9007199254740992,date:"2026-11-03",title:"제목",content:"내용",is_completed:false}]) {
    assert.throws(() => toTodo(row));
  }
});
