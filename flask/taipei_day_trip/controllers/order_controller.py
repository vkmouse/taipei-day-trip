from taipei_day_trip.controllers.base import BaseValidator
from taipei_day_trip.controllers.base import BaseView
from taipei_day_trip.models import Database
from taipei_day_trip.models import List

class OrderController:
    def __init__(self, db: Database):
        self.__db = db
        self.validator = OrderValidator(self.__db)
        self.view = OrderView()

    def validate_payment_input(self,
                               member_id: int,
                               booking_ids: List[int],
                               price: int,
                               contact_name: str | None,
                               contact_email: str | None,
                               contact_phone: str | None) -> bool:
        if not self.validator.validate_contact_info(contact_name, contact_email, contact_phone):
            return False
        return self.validator.validate_booking_info(member_id, booking_ids)

    def process_payment(self, prime: str, price: int) -> int:
        return 0

    def update_payment_status(
        self, 
        payment_status: int,
        member_id: int,
        booking_ids: List[int],
        price: int,
        contact_name: str,
        contact_email: str,
        contact_phone: str,
    ):
        order_id = self.__db.orders.add(member_id, price, booking_ids, payment_status, contact_name, contact_email, contact_phone)
        if payment_status == 0:
            self.__db.bookings.update_payment(member_id, booking_ids)
        return self.view.render_create_order_success(order_id, payment_status)

class OrderValidator(BaseValidator):
    def __init__(self, db: Database):
        self.__db = db
    
    def validate_contact_info(self, 
                              contact_name: str | None,
                              contact_email: str | None,
                              contact_phone: str | None) -> bool:
        return (self.validate_name(contact_name) and
                self.validate_email(contact_email) and
                self.validate_phone(contact_phone))

    def validate_booking_info(self, member_id: int, booking_ids: List[int]):
        if len(booking_ids) == 0:
            return False
        booking_list = self.__db.bookings.get_unpaid_by_member_and_id(member_id, booking_ids)
        if len(booking_list) != len(booking_ids):
            return False
        return True

class OrderView(BaseView):
    def render_create_order_success(self, order_id: int, payment_status: int):
        message = '付款失敗'
        if (payment_status == 0):
            message = '付款成功'
        return {
            'data': {
                'number': order_id,
                'payment': {
                    'status': payment_status,
                    'message': message
                }
            }
        }

    def render_invaild_order_info(self):
        return { 'error': True, 'message': 'Invalid order infomation' }, 400
