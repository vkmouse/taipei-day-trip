from datetime import datetime
from taipei_day_trip.controllers import OrderController
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import Database
from taipei_day_trip.tests import util


def create_basic_data(db: Database):
    db.categories.add("category1")
    db.mrts.add("mrt1")
    util.add_attraction(db, name="attr1")


def create_member_data(db: Database):
    db.members.add("name1", "1@1", "pass1")
    db.members.add("name2", "2@2", "pass2")


def create_booking_data(db: Database):
    db.bookings.add(1, 1, datetime(2000, 1, 1, 10), datetime(2000, 1, 1, 15), 2000)
    db.bookings.add(1, 1, datetime(2000, 1, 2, 10), datetime(2000, 1, 2, 15), 2500)
    db.bookings.add(1, 1, datetime(2000, 1, 3, 10), datetime(2000, 1, 3, 15), 2000)
    db.bookings.add(2, 1, datetime(2000, 1, 4, 10), datetime(2000, 1, 4, 15), 2000)
    db.bookings.add(2, 1, datetime(2000, 1, 5, 10), datetime(2000, 1, 5, 15), 2500)
    db.bookings.add(2, 1, datetime(2000, 1, 6, 10), datetime(2000, 1, 6, 15), 2000)


def create_controller() -> OrderController:
    db = MemoryDatabase()
    create_basic_data(db)
    create_member_data(db)
    create_booking_data(db)
    return OrderController(db)


def test_validate_payment_input():
    controller = create_controller()
    assert controller.validate_payment_input(1, [1, 2, 3], 9999, "name", "a@a.a", "0912345678") == True
    assert controller.validate_payment_input(1, [1, 2, 4], 9999, "name", "a@a.a", "0912345678") == False
    assert controller.validate_payment_input(1, [1, 2, 3], 9999, "", "a@a.a", "0912345678") == False
    assert controller.validate_payment_input(1, [1, 2, 3], 9999, "name", "email", "0912345678") == False


def test_update_payment_status():
    controller = create_controller()
    assert controller.update_payment_status(
        0, "success", 1, [1, 2, 3], 9999, "name", "a@a.a", "0912345678"
    ) == controller.view.render_create_order_success(1, 0, "success")


def test_get_order():
    controller = create_controller()
    controller.update_payment_status(0, "success", 1, [1, 2, 3], 9999, "name", "a@a.a", "0912345678")
    assert controller.get_order(1, 1)[0]["data"] != None
    assert controller.get_order(1, 2)[0]["data"] == None
