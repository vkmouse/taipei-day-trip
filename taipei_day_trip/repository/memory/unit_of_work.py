from taipei_day_trip.core import CategoryRepository
from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository.memory.category_repository import MemoryCategoryRepository

class MemoryUnitOfWork(UnitOfWork):
    def _create_category_repository(self) -> CategoryRepository:
        return MemoryCategoryRepository()