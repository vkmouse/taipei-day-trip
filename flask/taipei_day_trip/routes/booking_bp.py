from flask import Blueprint
from flask import request

from taipei_day_trip.controllers import BookingController
from taipei_day_trip.middleware import JWT
from taipei_day_trip.models import Cache
from taipei_day_trip.models import Database

def booking_bp(db: Database, cache: Cache):
    controller = BookingController(db)
    jwt = JWT(cache)
    bp = Blueprint('booking', __name__)

    @bp.route('/api/booking', methods=['GET', 'POST', 'DELETE'])
    @jwt.access_token_required
    def booking(member_id: int):
        if request.method == 'GET':
            return booking_get(member_id)
        elif request.method == 'POST':
            return booking_post(member_id)
        elif request.method == 'DELETE':
            return booking_delete(member_id)

    def booking_get(member_id: int):
        return controller.get_by_member_id(member_id)

    def booking_post(member_id: int):
        if request.content_type != 'application/json':
            return controller.view.render_invalid_parameter()
        body = request.get_json()
        return controller.add(member_id, body['attractionId'], body['starttime'], body['endtime'], body['price'])

    def booking_delete(member_id: int):
        if request.content_type == 'application/json':
            body = request.get_json()
            return controller.remove_by_id(member_id, body['bookingId'])
        return controller.view.render_invalid_parameter()

    return bp
