"""MHSSO JWT 토큰 검증 모듈"""

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

bearer_scheme = HTTPBearer()


class SSOTokenPayload:
    """MHSSO에서 발급한 JWT 토큰 페이로드"""

    def __init__(self, payload: dict):
        self.user_id: str = payload.get("sub", "")
        self.email: str = payload.get("email", "")
        self.name: str = payload.get("name", "")
        self.role: str = payload.get("role", "USER")
        self.iss: str = payload.get("iss", "")
        self.exp: int = payload.get("exp", 0)
        self.iat: int = payload.get("iat", 0)


def verify_sso_token(token: str) -> SSOTokenPayload:
    """MHSSO가 발급한 Access Token을 검증하고 페이로드를 반환한다.

    Args:
        token: JWT Access Token 문자열

    Returns:
        SSOTokenPayload: 검증된 토큰 페이로드

    Raises:
        HTTPException: 토큰이 유효하지 않은 경우
    """
    try:
        payload = jwt.decode(
            token,
            settings.SSO_JWT_ACCESS_SECRET,
            algorithms=["HS256"],
            issuer=settings.SSO_JWT_ISSUER,
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 만료되었습니다",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다",
        )

    return SSOTokenPayload(payload)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> SSOTokenPayload:
    """FastAPI 의존성: Authorization 헤더에서 JWT를 추출하여 현재 사용자를 반환한다."""
    return verify_sso_token(credentials.credentials)


async def get_current_admin(
    user: SSOTokenPayload = Depends(get_current_user),
) -> SSOTokenPayload:
    """FastAPI 의존성: 관리자 권한을 가진 사용자만 허용한다."""
    if user.role not in ("SUPER_ADMIN", "ADMIN"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다",
        )
    return user
