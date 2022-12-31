from taipei_day_trip.models.types import List
from taipei_day_trip.models.types import MRT


class MRTModel:
    def add(self, name: str) -> bool:
        return NotImplemented

    def get_all(self) -> List[MRT]:
        return NotImplemented
