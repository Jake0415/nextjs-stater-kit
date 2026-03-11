"""문서 리포지토리 인터페이스"""

from abc import ABC, abstractmethod

from app.domain.document.entity import Document


class IDocumentRepository(ABC):
    """문서 리포지토리 인터페이스"""

    @abstractmethod
    async def find_all(self, skip: int = 0, limit: int = 20) -> list[Document]:
        ...

    @abstractmethod
    async def find_by_id(self, document_id: str) -> Document | None:
        ...

    @abstractmethod
    async def save(self, document: Document) -> Document:
        ...

    @abstractmethod
    async def update(self, document: Document) -> Document:
        ...

    @abstractmethod
    async def soft_delete(self, document_id: str) -> None:
        ...

    @abstractmethod
    async def count(self) -> int:
        ...
