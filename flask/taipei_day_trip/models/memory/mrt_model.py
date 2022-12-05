from taipei_day_trip.models.mrt_model import MRTModel
from taipei_day_trip.models.types import MRT
from taipei_day_trip.models.types import List

class MemoryMRTModel(MRTModel):
    def __init__(self):
        self.__db: List[MRT] = []
        self.__id: int = 0

    def add(self, name: str) -> bool:
        mrt_exists = len(list(filter(lambda i: i.name == name, self.__db))) > 0
        if name == None or mrt_exists:
            return False
        element = MRT(self.__next_id, name)
        self.__db.append(element)
        return True

    def get_all(self) -> List[MRT]:
        return self.__db

    def exists(self, name: str) -> bool:
        return len(list(filter(lambda i: i.name == name, self.__db))) > 0

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
