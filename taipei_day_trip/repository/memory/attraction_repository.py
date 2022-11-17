from taipei_day_trip.core import Attraction
from taipei_day_trip.core import AttractionRepository
from taipei_day_trip.core import List
from taipei_day_trip.repository.memory.category_repository import MemoryCategoryRepository
from taipei_day_trip.repository.memory.mrt_repository import MemoryMRTRepository

class MemoryAttractionRepository(AttractionRepository):
    def __init__(self, categories: MemoryCategoryRepository, mrts: MemoryMRTRepository):
        self.__db: List[Attraction] = []
        self.__id: int = 0
        self.__categories = categories
        self.__mrts = mrts

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
        is_valid = self.__categories.exists(category) and (mrt == None or self.__mrts.exists(mrt))
        if is_valid:
            element = Attraction(self.__next_id, 
                                 name,
                                 description,
                                 address,
                                 lat,
                                 lng,
                                 transport,
                                 images,
                                 category=category,
                                 mrt=mrt)
            self.__db.append(element)
            return True
        return False

    def get_all(self) -> List[Attraction]:
        return self.__db

    def get_by_id(self, id: int) -> Attraction | None:
        output = list(filter(lambda i: i.id == id, self.__db))
        if len(output) == 0:
            return None
        return output[0]

    def get_range(self, start: int, stop: int) -> List[Attraction]:
        output: List[Attraction] = []
        for i in range(start, stop):
            if i >= len(self.__db):
                break
            output.append(self.__db[i])
        return output

    def search_by_category_or_name(self, keyword: str, start: int, stop: int) -> List[Attraction]:
        output = self.get_range(start, stop)
        return list(filter(lambda x: keyword in x.name or x.category == keyword, output))

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
