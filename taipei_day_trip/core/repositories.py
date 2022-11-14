from taipei_day_trip.core.types import Attraction
from taipei_day_trip.core.types import Category
from taipei_day_trip.core.types import List
from taipei_day_trip.core.types import MRT

class AttractionRepository:
    def add(self,
            name: str, 
            description: str, 
            address: str, 
            lat: str, 
            lng: str, 
            transport: str, 
            images: List[str], 
            category_id: int, 
            mrt_id: int) -> bool:
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
