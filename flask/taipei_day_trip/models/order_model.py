from taipei_day_trip.models.types import List
from taipei_day_trip.models.types import Order

class OrderModel:
    def add(self,
            member_id: int,
            price: int,
            booking_ids: List[int],
            payment_status: int,
            contact_name: str,
            contact_email: str,
            contact_phone: str) -> int:
        return NotImplemented
    def get_by_id(self, id: int, member_id: int) -> Order | None:
        return NotImplemented
