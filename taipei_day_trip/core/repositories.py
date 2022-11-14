from taipei_day_trip.core.types import Attraction
from taipei_day_trip.core.types import Category
from taipei_day_trip.core.types import List
from taipei_day_trip.core.types import MRT

class AttractionRepository:
    def add(self, value: Attraction) -> None:
        return NotImplemented
    def get_all(self) -> List[Attraction]:
        return NotImplemented

class CategoryRepository:
    def add(self, name: str) -> bool:
        return NotImplemented
    def get_all(self) -> List[Category]:
        return NotImplemented

class MRTRepository:
    def add(self, name: str) -> bool:
        return NotImplemented
    def get_all(self) -> List[MRT]:
        return NotImplemented
