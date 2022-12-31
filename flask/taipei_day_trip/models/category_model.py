from taipei_day_trip.models.types import Category
from taipei_day_trip.models.types import List


class CategoryModel:
    def add(self, name: str) -> bool:
        return NotImplemented

    def get_all(self) -> List[Category]:
        return NotImplemented
