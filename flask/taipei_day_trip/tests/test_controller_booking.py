from datetime import datetime
from taipei_day_trip.controllers import BookingController
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.tests import util
from taipei_day_trip.utils import hashpw


def create_controller() -> BookingController:
    db = MemoryDatabase()
    db.categories.add("category1")
    for i in range(20):
        util.add_attraction(db, name=f"attr{i + 1}")
    db.members.add("mem1", "mem1@mem1.com", hashpw("12345"), "avatar")
    db.bookings.add(1, 1, datetime(2020, 1, 1, 10, 30, 20), datetime(2020, 1, 1, 10, 30, 30), 2500)
    db.bookings.add(1, 2, datetime(2020, 2, 1, 10, 30, 20), datetime(2020, 2, 1, 10, 30, 30), 2000)
    return BookingController(db)


def test_get_by_member_id():
    controller = create_controller()
    body, status_code = controller.get_by_member_id(1)
    assert status_code == 200
    assert body == {
        "data": [
            {
                "attraction": {
                    "id": 1,
                    "name": "attr1",
                    "address": "addr",
                    "image": "123",
                },
                "bookingId": 1,
                "starttime": "2020-01-01 10:30:20",
                "endtime": "2020-01-01 10:30:30",
                "price": 2500,
            },
            {
                "attraction": {
                    "id": 2,
                    "name": "attr2",
                    "address": "addr",
                    "image": "123",
                },
                "bookingId": 2,
                "starttime": "2020-02-01 10:30:20",
                "endtime": "2020-02-01 10:30:30",
                "price": 2000,
            },
        ]
    }


def test_add_success():
    controller = create_controller()
    assert controller.add(1, 1, "2020-3-1 10:30:20", "2020-3-1 10:30:30", 2000) == controller.view.render_add_success()
    body, status_code = controller.get_by_member_id(1)
    assert status_code == 200
    assert len(body["data"]) == 3


def test_add_with_wrong_time_format():
    controller = create_controller()
    assert (
        controller.add(1, 1, "2020-3-1T10:30:20", "2020-3-1T10:30:30", 2000)
        == controller.view.render_invalid_parameter()
    )


def test_add_with_not_exists_member_or_attraction():
    controller = create_controller()
    assert (
        controller.add(999, 1, "2020-3-1 10:30:20", "2020-3-1 10:30:30", 2000)
        == controller.view.render_member_or_attraction_not_exists()
    )
    assert (
        controller.add(1, 999, "2020-3-1 10:30:20", "2020-3-1 10:30:30", 2000)
        == controller.view.render_member_or_attraction_not_exists()
    )
