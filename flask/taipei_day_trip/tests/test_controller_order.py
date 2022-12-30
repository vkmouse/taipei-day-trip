from taipei_day_trip.controllers import OrderController
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.tests import util


def create_controller() -> OrderController:
    db = MemoryDatabase()
    util.create_basic_data(db)
    util.create_member_data(db)
    util.create_booking_data(db)
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


def test_get_orders():
    controller = create_controller()
    controller.update_payment_status(0, "success", 1, [1, 2, 3], 9999, "name", "a@a.a", "0912345678")
    controller.update_payment_status(0, "success", 1, [1, 2, 3], 9999, "name", "a@a.a", "0912345678")
    assert len(controller.get_orders(1)[0]["data"]) == 2
