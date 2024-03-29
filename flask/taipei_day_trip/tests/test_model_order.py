import pytest

from datetime import datetime
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database
from taipei_day_trip.tests import util


def order_test_case(db: Database):
    util.create_basic_data(db)
    util.create_member_data(db)
    util.create_booking_data(db)
    id1 = db.orders.add(1, 9999, [1, 2, 3], 0, "name", "email", "phone")
    id2 = db.orders.add(2, 9999, [4, 5, 6], 0, "name", "email", "phone")
    assert id1 == 1 and id2 == 2

    assert db.orders.get_by_id(id1, 2) == None
    assert db.orders.get_by_id(id2, 1) == None

    assert len(db.orders.get_by_member(id1)) == 1

    order1 = db.orders.get_by_id(id1, 1)
    assert len(order1.bookings) == 3
    assert order1.bookings[0].starttime == datetime(2000, 1, 1, 10)
    assert order1.bookings[1].starttime == datetime(2000, 1, 2, 10)
    assert order1.bookings[2].starttime == datetime(2000, 1, 3, 10)
    assert order1.price == 9999
    assert order1.payment_status == 0
    assert order1.contact_name == "name"
    assert order1.contact_email == "email"
    assert order1.contact_phone == "phone"


def test_memory_based_model():
    db = MemoryDatabase()
    order_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    db = MySQLDatabase(debug=True)
    order_test_case(db)
