"""설정 확인은 기본 동작, 실제 DB 변경은 --run-crud로 명시합니다."""
import argparse
import os
from pathlib import Path

from dotenv import dotenv_values
from supabase import create_client


def get_supabase_client():
    config = dotenv_values(Path(__file__).resolve().parents[2] / ".env")
    url = config.get("SUPABASE_URL")
    key = config.get("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL과 공개 SUPABASE_KEY를 설정하세요.")
    if not key.startswith("sb_publishable_"):
        raise RuntimeError("관리자 비밀 키 대신 공개 키를 사용하세요.")
    return create_client(url, key)


def main():
    parser = argparse.ArgumentParser(description="회원·상품·주문 SDK CRUD 실습")
    parser.add_argument("--run-crud", action="store_true", help="로그인 후 임시 행 CRUD와 정리 실행")
    args = parser.parse_args()
    client = get_supabase_client()
    if not args.run_crud:
        print("SDK 설정 확인 완료. 로그인·DB 접속은 실행하지 않았습니다.")
        return
    email = os.environ.get("SUPABASE_TEST_EMAIL")
    password = os.environ.get("SUPABASE_TEST_PASSWORD")
    if not email or not password:
        raise RuntimeError("프로세스 환경변수에 시험 계정 이메일·비밀번호가 필요합니다.")
    response = client.auth.sign_in_with_password({"email": email, "password": password})
    if not response.user or not response.session:
        raise RuntimeError("로그인 세션을 확인하지 못했습니다.")
    try:
        from .crud import run_crud
        run_crud(client)
    finally:
        client.auth.sign_out({"scope": "local"})
