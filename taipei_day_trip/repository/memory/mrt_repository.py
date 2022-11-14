from taipei_day_trip.core import MRT
from taipei_day_trip.core import MRTRepository
from taipei_day_trip.core import List

class MemoryMRTRepository(MRTRepository):
    def __init__(self):
        self.__db: List[MRT] = []
        self.__id: int = 0

    def add(self, name: str) -> bool:
        mrt_exists = len(list(filter(lambda i: i.name == name, self.__db))) > 0
        if mrt_exists:
            return False
        category = MRT(self.__next_id, name)
        self.__db.append(category)
        return True

    def get_all(self) -> List[MRT]:
        return self.__db

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
