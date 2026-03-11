# 백엔드 (FastAPI)

## 기술 스택

- **프레임워크**: FastAPI (Python, 포트 8000)
- **아키텍처**: DDD + 레이어드/클린 아키텍처
- **인증**: JWT Bearer 토큰 (관리자/기본 계정 2종)
- **API prefix**: `/api/v1/...`
- **데이터 삭제 정책**: Soft delete (deleted_at 타임스탬프)
- **자동 API 문서**: `/docs` (Swagger UI), `/redoc`
- **데이터 검증**: Pydantic

## 데이터베이스

- **PostgreSQL**: document, metadata, user 등 관계형 데이터
- **MongoDB**: OCR 결과 raw data (컬렉션: documents, toc_nodes, retrieval_chunks, generation_chunks, entities)
- **MinIO**: 이미지 파일 오브젝트 스토리지

## 실행 방법

```bash
cd back-end/
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 디렉토리 구조

```
back-end/
├── app/
│   ├── main.py                    # FastAPI 엔트리포인트
│   ├── config.py                  # 환경변수, DB 설정
│   ├── domain/                    # 도메인 레이어 (엔티티, 리포지토리 인터페이스, 도메인 서비스)
│   │   ├── document/
│   │   ├── ocr/
│   │   └── user/
│   ├── application/               # 애플리케이션 레이어 (유스케이스)
│   │   ├── document/
│   │   ├── ocr/
│   │   └── user/
│   ├── infrastructure/            # 인프라 레이어 (DB, 스토리지, 리포지토리 구현)
│   │   ├── database/
│   │   ├── storage/
│   │   └── repositories/
│   └── presentation/              # 프레젠테이션 레이어 (API 라우터, 스키마)
│       ├── api/v1/
│       └── schemas/
├── tests/
├── requirements.txt
├── pyproject.toml
└── .env.example
```

## API 규약

- 모든 엔드포인트는 `/api/v1/` 접두사 사용
- Path 파라미터: `{id}` 형식 (FastAPI 표준)
- 인증: `Authorization: Bearer <JWT>` 헤더
- 파일 업로드: `multipart/form-data` (PDF, 최대 50MB)
- 비동기 작업: OCR 실행 시 `202 Accepted` 응답 후 폴링
- 에러 응답: `{ "detail": "..." }` 형식

## Soft Delete 정책

- 모든 데이터 삭제는 `deleted_at` 타임스탬프 기반 소프트 삭제
- 목록 조회 시 `deleted_at IS NULL` 조건 자동 적용
- 영구 삭제는 별도 관리자 API로만 가능

## 관련 문서

- API 엔드포인트 명세: `docs/API-ENDPOINTS.md`
- API 클라이언트 가이드: `docs/API-CLIENT.md`
