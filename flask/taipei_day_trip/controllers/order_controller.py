from taipei_day_trip.controllers.base import BaseValidator
from taipei_day_trip.controllers.base import BaseView
from taipei_day_trip.models import Database
from taipei_day_trip.models import List
from taipei_day_trip.models import Order
from taipei_day_trip.utils import tappay
from taipei_day_trip.utils import tappay_merchant_id
from taipei_day_trip.utils import tappay_partner_key
from taipei_day_trip.utils import tappay_pay_by_prime_url

class OrderController:
    def __init__(self, db: Database):
        self.__db = db
        self.validator = OrderValidator(self.__db)
        self.view = OrderView()

    def create_order(self,
                     member_id: int,
                     prime: str,
                     booking_ids: List[int],
                     price: int,
                     contact_name: str | None,
                     contact_email: str | None,
                     contact_phone: str | None) -> bool:
        if not self.validate_payment_input(
            member_id,
            booking_ids,
            price,
            contact_name,
            contact_email,
            contact_phone
        ):
            return self.view.render_invalid_parameter()
        (payment_status, message) = self.process_payment(
            prime,
            price,
            contact_name,
            contact_email,
            contact_phone,
        )
        return self.update_payment_status(
            payment_status,
            message,
            member_id,
            booking_ids,
            price,
            contact_name,
            contact_email,
            contact_phone,
        )

    def get_order(self, member_id: int, order_id: int):
        try:
            order = self.__db.orders.get_by_id(order_id, member_id)
            if order:
                return self.view.render_get_order_success(order)
            else:
                return self.view.render_get_order_failed()
        except Exception as e:
            return self.view.render_unexpected(e)

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

    def process_payment(
        self,
        prime: str,
        price: int,
        contact_name: str,
        contact_email: str,
        contact_phone: str
    ) -> tuple[int, str]:
        return tappay.pay_by_prime(
            url=tappay_pay_by_prime_url,
            partner_key=tappay_partner_key,
            merchant_id=tappay_merchant_id,
            prime=prime,
            price=price,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
        )

    def update_payment_status(
        self,
        payment_status: int,
        message: str,
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
        return self.view.render_create_order_success(order_id, payment_status, message)

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
    def render_create_order_success(self, order_id: int, payment_status: int, message: str):
        if payment_status == 0:
            code = 201
        else:
            code = 200
        return {
            'data': {
                'orderId': order_id,
                'payment': {
                    'status': payment_status,
                    'message': message
                }
            }
        }, code

    def render_get_order_success(self, order: Order):
        return {
            'data': {
                'orderId': order.id,
                'status': order.payment_status,
                'trip': list(map(lambda x: {
                    'attraction': {
                        'id': x.attraction.id,
                        'name': x.attraction.name,
                        'address': x.attraction.address,
                        'image': x.attraction.images[0],
                    },
                    'starttime': x.starttime.strftime("%Y-%m-%d %H:%M:%S"),
                    'endtime': x.endtime.strftime("%Y-%m-%d %H:%M:%S"),
                }, order.bookings)),
                'contact': {
                    'name': order.contact_name,
                    'email': order.contact_email,
                    'phone': order.contact_phone
                }
            }
        }, 200

    def render_get_order_failed(self):
        return { 'data': None }, 200

    def render_invaild_order_info(self):
        return { 'error': True, 'message': 'Invalid order infomation' }, 400
