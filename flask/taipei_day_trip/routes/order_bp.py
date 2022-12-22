from flask import Blueprint
from flask import request

from taipei_day_trip.controllers import OrderController
from taipei_day_trip.middleware import JWT
from taipei_day_trip.models import Cache
from taipei_day_trip.models import Database

def order_bp(db: Database, cache: Cache):
    controller = OrderController(db)
    bp = Blueprint('order', __name__)
    jwt = JWT(cache)

    @bp.route('/api/orders', methods=['POST'])
    @jwt.access_token_required
    def orders(member_id):
        try:
            body = request.get_json()
            order = body['order']
            contact = order['contact']
            prime = body['prime']
            price = order['price']
            booking_ids = order['bookingIds']
            contact_name = contact['name']
            contact_email = contact['email']
            contact_phone = contact['phone']
        except:
            return controller.view.render_invalid_parameter()
        is_valid = controller.validate_payment_input(member_id,
                                                     booking_ids,
                                                     price,
                                                     contact_name,
                                                     contact_email,
                                                     contact_phone)
        if not is_valid:
            return controller.view.render_invalid_parameter()
        payment_status = controller.process_payment()
        return controller.update_payment_status(payment_status)

    @bp.route('/api/order/<int:id>')
    def order():
        if request.content_type != 'application/json':
            return controller.view.render_invalid_parameter()
        body = request.get_json()
        return controller.view.render_success()

    return bp
