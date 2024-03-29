from taipei_day_trip.controllers.base import BaseValidator, BaseView
from taipei_day_trip.models import Booking
from taipei_day_trip.models import Database
from taipei_day_trip.models import List
from taipei_day_trip.utils.time import parse_datestr


class BookingController:
    def __init__(self, db: Database):
        self.__db = db
        self.validator = BookingValidator()
        self.view = BookingView()

    def get_by_member_id(self, member_id: int):
        try:
            result = self.__db.bookings.get_unpaid_by_member(member_id)
            return self.view.render_get_by_member_id(result)
        except:
            return self.view.render_unexpected()

    def add(
        self,
        member_id: int,
        attraction_id: int,
        starttime: str | None,
        endtime: str | None,
        price: int,
    ):
        try:
            if (
                not self.validator.validate_date(starttime)
                or not self.validator.validate_date(endtime)
                or not self.validator.validate_starttime_to_endtime(starttime, endtime)
            ):
                return self.view.render_invalid_parameter()
            success = self.__db.bookings.add(
                member_id,
                attraction_id,
                parse_datestr(starttime),
                parse_datestr(endtime),
                price,
            )
            if not success:
                return self.view.render_member_or_attraction_not_exists()
            return self.view.render_add_success()
        except Exception as e:
            return self.view.render_unexpected(e)

    def remove_by_id(self, member_id: int, id: str | None):
        try:
            if not self.validator.validate_number(id):
                return self.view.render_invalid_parameter()
            self.__db.bookings.remove_by_id(member_id, id)
            return self.view.render_success()
        except Exception as e:
            return self.view.render_unexpected(e)


class BookingValidator(BaseValidator):
    def validate_date(self, date: str | None) -> bool:
        return parse_datestr(date) != None

    def validate_starttime_to_endtime(self, starttime: str | None, endtime: str | None):
        start = parse_datestr(starttime)
        end = parse_datestr(endtime)
        return end > start


class BookingView(BaseView):
    def render_get_by_member_id(self, bookings: List[Booking]):
        data = list(
            map(
                lambda x: {
                    "attraction": {
                        "id": x.attraction.id,
                        "name": x.attraction.name,
                        "address": x.attraction.address,
                        "image": x.attraction.images[0],
                    },
                    "bookingId": x.id,
                    "starttime": x.starttime.strftime("%Y-%m-%d %H:%M:%S"),
                    "endtime": x.endtime.strftime("%Y-%m-%d %H:%M:%S"),
                    "price": x.price,
                },
                bookings,
            )
        )
        return {"data": data}, 200

    def render_add_success(self):
        return {"ok": True}, 201

    def render_member_or_attraction_not_exists(self):
        return {"error": True, "message": "Invalid member or attraction"}, 400
