from taipei_day_trip.core import Category
from taipei_day_trip.core import CategoryRepository
from taipei_day_trip.core import List

class MemoryCategoryRepository(CategoryRepository):
    def __init__(self):
        self.__db: List[Category] = []
        self.__id: int = 0

    def add(self, name: str) -> bool:
        category_exists = len(list(filter(lambda i: i.name == name, self.__db))) > 0
        if category_exists:
            return False
        element = Category(self.__next_id, name)
        self.__db.append(element)
        return True

    def get_all(self) -> List[Category]:
        return self.__db

    def exists(self, name: str) -> bool:
        return len(list(filter(lambda i: i.name == name, self.__db))) > 0

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
