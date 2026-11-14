import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 기존 학습 지침 파일을 자동 생성 파일로 덮어쓰지 않습니다.
  agentRules: false,
  // 공식 생성 도구의 Tailwind 처리 설정을 사용합니다.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
