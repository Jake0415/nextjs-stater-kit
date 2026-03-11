"""FastAPI 애플리케이션 엔트리포인트"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI(
    title="MH-OCR-AI API",
    description="문서 OCR 처리 및 관리 API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok"}


# API 라우터 등록
# from app.presentation.api.v1 import documents, ocr, users, auth
# app.include_router(documents.router, prefix="/api/v1")
# app.include_router(ocr.router, prefix="/api/v1")
# app.include_router(users.router, prefix="/api/v1")
# app.include_router(auth.router, prefix="/api/v1")
