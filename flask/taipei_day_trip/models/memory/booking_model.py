from datetime import datetime
from taipei_day_trip.models.booking_model import BookingModel
from taipei_day_trip.models.memory.attraction_model import MemoryAttractionModel
from taipei_day_trip.models.memory.member_model import MemoryMemberModel
from taipei_day_trip.models.types import Booking
from taipei_day_trip.models.types import List

class MemoryBookingModelModel(BookingModel):
    def __init__(self, members: MemoryMemberModel, attractions: MemoryAttractionModel):
        self.__db: List[Booking] = []
        self.__id: int = 0
        self.__members = members
        self.__attractions = attractions

    def add(self, member_id: int, attraction_id: int, starttime: datetime, endtime: datetime, price: int) -> bool:
        invalid = (self.__members.get_by_id(member_id) == None or 
                   self.__attractions.get_by_id(attraction_id) == None)
        if invalid:
            return False

        exists = len(list(filter(lambda i: (
            i.member_id == member_id and self.__time_overlay(i.starttime, i.endtime, starttime, endtime)
        ), self.__db))) > 0
        if exists:
            return False

        element = Booking(self.__next_id, member_id, attraction_id, starttime, endtime, price)
        self.__db.append(element)
        return True

    def get_by_member_id(self, member_id: int) -> List[Booking]:
        return list(filter(lambda i: (i.member_id == member_id), self.__db))

    def remove_by_id(self, id: int):
        self.__db = list(filter(lambda i: i.id != id, self.__db))

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id

    def __time_overlay(self, starttime1: datetime, endtime1: datetime, starttime2: datetime, endtime2: datetime):
        return not (endtime1 <= starttime2 or endtime2 <= starttime1)
