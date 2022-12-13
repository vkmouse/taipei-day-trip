from datetime import datetime
from taipei_day_trip.models.types import Booking
from taipei_day_trip.models.types import List

class BookingModel:
    def add(self, member_id: int, attraction_id: int, starttime: datetime, endtime: datetime, price: int) -> bool:
        return NotImplemented
    def get_by_member_id(self, member_id: int) -> List[Booking]:
        return NotImplemented
    def remove_by_id(self, id: int):
        return NotImplemented
    def remove_by_member_id(self, member_id: int):
        return NotImplemented       
