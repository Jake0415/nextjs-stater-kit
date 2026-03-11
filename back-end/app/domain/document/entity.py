"""문서 도메인 엔티티"""

from datetime import datetime
from enum import Enum
from dataclasses import dataclass, field


class DocumentStatus(str, Enum):
    """문서 상태"""
    UPLOADED = "UPLOADED"
    UPLOAD_FAIL = "UPLOAD_FAIL"
    OCR_EXTRACTING = "OCR_EXTRACTING"
    OCR_ACTED = "OCR_ACTED"
    OCR_EXTRACT_FAIL = "OCR_EXTRACT_FAIL"


@dataclass
class Document:
    """문서 엔티티"""
    id: str
    filename: str
    description: str | None = None
    status: DocumentStatus = DocumentStatus.UPLOADED
    file_size: int = 0
    file_type: str = "application/pdf"
    version: str = "1.0"
    uploaded_by: str | None = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    deleted_at: datetime | None = None
