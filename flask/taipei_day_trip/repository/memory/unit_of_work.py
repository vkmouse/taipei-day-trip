import json
import re

from taipei_day_trip.core import AttractionRepository
from taipei_day_trip.core import CategoryRepository
from taipei_day_trip.core import List
from taipei_day_trip.core import MRTRepository
from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository.memory.attraction_repository import MemoryAttractionRepository
from taipei_day_trip.repository.memory.category_repository import MemoryCategoryRepository
from taipei_day_trip.repository.memory.mrt_repository import MemoryMRTRepository

class MemoryUnitOfWork(UnitOfWork):
    def _create_attraction_repository(self) -> AttractionRepository:
        return MemoryAttractionRepository(self.categories, self.mrts)

    def _create_category_repository(self) -> CategoryRepository:
        return MemoryCategoryRepository()

    def _create_mrt_repository(self) -> MRTRepository:
        return MemoryMRTRepository()

    def import_from_json_file(self, filename: str):
        file = open(filename, 'r', encoding='utf8')
        line = file.readline()
        file.close()
        self.import_from_json(line)

    def import_from_json(self, json_str):
        json_obj = json.loads(json_str)
        for attr in json_obj['result']['results']:
            self.categories.add(attr['CAT'])
            self.mrts.add(attr['MRT'])
            self.attractions.add(name=attr['name'],
                                 description=attr['description'],
                                 address=attr['address'],
                                 lat=float(attr['latitude']),
                                 lng=float(attr['longitude']),
                                 transport=attr['direction'],
                                 images=self.__parse_image_property(attr['file']),
                                 category=attr['CAT'],
                                 mrt=attr['MRT'])

    def __parse_image_property(self, urls: str) -> List[str]:
        iter = re.finditer(r'(http(s?):)([/|.|\w|\s|-])*\.(?:PNG|JPG|png|jpg)', urls)
        return list(map(lambda m: m.group(0), iter))
