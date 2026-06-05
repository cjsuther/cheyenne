from pydantic import BaseModel
from typing import Optional, Generic, TypeVar, List

T = TypeVar("T")


class PaginationParams(BaseModel):
    skip: int = 0
    limit: int = 20


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    skip: int
    limit: int


class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
