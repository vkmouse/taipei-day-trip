from taipei_day_trip.core.types import Attraction
from taipei_day_trip.core.types import Category
from taipei_day_trip.core.types import List
from taipei_day_trip.core.types import MRT

class AttractionRepository:
    def add(self,
            name: str, 
            description: str, 
            address: str, 
            lat: float, 
            lng: float, 
            transport: str, 
            images: List[str], 
            category: str, 
            mrt: str) -> bool:
        return NotImplemented
    def get_all(self) -> List[Attraction]:
        return NotImplemented
    def get_by_id(self, id: int) -> Attraction | None:
        return NotImplemented
    def get_range(self, start: int, end: int) -> List[Attraction]:
        return NotImplemented
    def search_by_name(self, pattern: str, start: int, end: int) -> List[Attraction]:
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
