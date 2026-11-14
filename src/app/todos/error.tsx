"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="m-4"><p role="alert" className="text-red-700">화면을 불러오지 못했습니다.</p><button className="mt-3 rounded bg-yellow-100 p-3" onClick={reset}>다시 시도</button></section>;
}
