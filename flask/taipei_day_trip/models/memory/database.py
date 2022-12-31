import json
import re

from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.booking_model import BookingModel
from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.member_model import MemberModel
from taipei_day_trip.models.memory.attraction_model import MemoryAttractionModel
from taipei_day_trip.models.memory.booking_model import MemoryBookingModel
from taipei_day_trip.models.memory.category_model import MemoryCategoryModel
from taipei_day_trip.models.memory.member_model import MemoryMemberModel
from taipei_day_trip.models.memory.mrt_model import MemoryMRTModel
from taipei_day_trip.models.memory.order_model import MemoryOrderModel
from taipei_day_trip.models.mrt_model import MRTModel
from taipei_day_trip.models.order_model import OrderModel
from taipei_day_trip.models.types import List
from taipei_day_trip.models.database import Database


class MemoryDatabase(Database):
    def _create_attraction_model(self) -> AttractionModel:
        return MemoryAttractionModel(self.categories, self.mrts)

    def _create_booking_model(self) -> BookingModel:
        return MemoryBookingModel(self.members, self.attractions)

    def _create_category_model(self) -> CategoryModel:
        return MemoryCategoryModel()

    def _create_member_model(self) -> MemberModel:
        return MemoryMemberModel()

    def _create_mrt_model(self) -> MRTModel:
        return MemoryMRTModel()

    def _create_order_model(self) -> OrderModel:
        return MemoryOrderModel(self.bookings)

    def import_from_json_file(self, filename: str):
        file = open(filename, "r", encoding="utf8")
        line = file.readline()
        file.close()
        self.import_from_json(line)

    def import_from_json(self, json_str):
        json_obj = json.loads(json_str)
        for attr in json_obj["result"]["results"]:
            self.categories.add(attr["CAT"])
            self.mrts.add(attr["MRT"])
            self.attractions.add(
                name=attr["name"],
                description=attr["description"],
                address=attr["address"],
                lat=float(attr["latitude"]),
                lng=float(attr["longitude"]),
                transport=attr["direction"],
                images=self.__parse_image_property(attr["file"]),
                category=attr["CAT"],
                mrt=attr["MRT"],
            )

    def __parse_image_property(self, urls: str) -> List[str]:
        iter = re.finditer(r"(http(s?):)([/|.|\w|\s|-])*\.(?:PNG|JPG|png|jpg)", urls)
        return list(map(lambda m: m.group(0), iter))
