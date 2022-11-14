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
            lat: str, 
            lng: str, 
            transport: str, 
            images: List[str], 
            category_id: int, 
            mrt_id: int) -> bool:
        category = self.__categories.get_by_id(category_id)
        mrt = self.__mrts.get_by_id(mrt_id)
        if category == None or mrt == None:
            return False
        element = Attraction(self.__next_id, 
                           name,
                           description,
                           address,
                           lat,
                           lng,
                           transport,
                           images,
                           category=self.__categories.get_by_id(category_id).name,
                           mrt=self.__mrts.get_by_id(mrt_id).name)
        self.__db.append(element)
        return True

    def get_all(self) -> List[Attraction]:
        return self.__db

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
