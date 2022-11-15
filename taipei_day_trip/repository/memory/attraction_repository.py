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
        if self.__categories.exists(category) and self.__mrts.exists(mrt):
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

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
