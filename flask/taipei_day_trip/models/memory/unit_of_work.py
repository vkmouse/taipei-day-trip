import json
import re

from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.memory.attraction_repository import MemoryAttractionRepository
from taipei_day_trip.models.memory.category_repository import MemoryCategoryRepository
from taipei_day_trip.models.memory.mrt_repository import MemoryMRTRepository
from taipei_day_trip.models.mrt_model import MRTModel
from taipei_day_trip.models.types import List
from taipei_day_trip.models.database import Database

class MemoryUnitOfWork(Database):
    def _create_attraction_repository(self) -> AttractionModel:
        return MemoryAttractionRepository(self.categories, self.mrts)

    def _create_category_repository(self) -> CategoryModel:
        return MemoryCategoryRepository()

    def _create_mrt_repository(self) -> MRTModel:
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
