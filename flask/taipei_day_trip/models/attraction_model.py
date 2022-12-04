from taipei_day_trip.core import Attraction
from taipei_day_trip.core import List

class AttractionModel:
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
    def get_range(self, start: int, stop: int) -> List[Attraction]:
        return NotImplemented
    def search_by_category_or_name(self, keyword: str, start: int, stop: int) -> List[Attraction]:
        return NotImplemented
