import pytest

from datetime import datetime
from datetime import timedelta
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database
from taipei_day_trip.tests import util


def booking_test_case(db: Database):
    assert len(db.bookings.get_unpaid_by_member(1)) == 0
    assert (
        db.bookings.add(
            1,
            1,
            datetime(2000, 1, 1, 14),
            datetime(2000, 1, 1, 14) + timedelta(hours=3),
            2000,
        )
        == False
    )

    util.create_basic_data(db)
    util.create_member_data(db)

    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    assert db.bookings.add(2, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 16), datetime(2000, 1, 1, 20), 2500) == False
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 17), datetime(2000, 1, 1, 21), 2500) == True
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 10), datetime(2000, 1, 1, 23), 2500) == False
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 15), datetime(2000, 1, 1, 16), 2500) == False

    booking_list = db.bookings.get_unpaid_by_member(1)
    assert len(booking_list) == 2
    assert booking_list[0].starttime == datetime(2000, 1, 1, 14)
    assert booking_list[0].endtime == datetime(2000, 1, 1, 17)
    assert booking_list[0].price == 2000
    assert booking_list[0].attraction.name == "attr1"
    assert booking_list[0].attraction.images[0] == "123"
    assert booking_list[0].has_paid == False
    assert booking_list[1].starttime == datetime(2000, 1, 1, 17)
    assert booking_list[1].endtime == datetime(2000, 1, 1, 21)
    assert booking_list[1].price == 2500
    assert booking_list[1].attraction.name == "attr1"
    assert booking_list[1].has_paid == False

    db.bookings.remove_by_id(2, booking_list[0].id)
    booking_list = db.bookings.get_unpaid_by_member(1)
    assert len(booking_list) == 2

    db.bookings.remove_by_id(1, booking_list[0].id)
    booking_list = db.bookings.get_unpaid_by_member(1)
    assert len(booking_list) == 1
    assert booking_list[0].starttime == datetime(2000, 1, 1, 17)
    assert booking_list[0].endtime == datetime(2000, 1, 1, 21)
    assert booking_list[0].price == 2500
    assert booking_list[0].attraction.name == "attr1"

    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True


def booking_test_get_by_ids_and_member_id(db: Database):
    util.create_basic_data(db)
    util.create_member_data(db)
    util.create_booking_data(db)
    assert len(db.bookings.get_unpaid_by_member_and_id(1, [1, 2, 3])) == 3
    assert len(db.bookings.get_unpaid_by_member_and_id(1, [2, 3, 4])) == 2
    assert len(db.bookings.get_unpaid_by_member_and_id(1, [4, 5, 6])) == 0


def booking_test_update_payment(db: Database):
    util.create_basic_data(db)
    util.create_member_data(db)
    util.create_booking_data(db)

    assert len(db.bookings.get_unpaid_by_member_and_id(1, [1, 2, 3])) == 3
    db.bookings.update_payment(1, [1, 2])
    assert len(db.bookings.get_unpaid_by_member_and_id(1, [1, 2, 3])) == 1

    assert len(db.bookings.get_unpaid_by_member_and_id(2, [4, 5, 6])) == 3
    db.bookings.update_payment(1, [4])
    assert len(db.bookings.get_unpaid_by_member_and_id(2, [4, 5, 6])) == 3


def booking_test_get_unpaid_by_member(db: Database):
    util.create_basic_data(db)
    util.create_member_data(db)
    util.create_booking_data(db)

    assert len(db.bookings.get_unpaid_by_member(1)) == 3
    db.bookings.update_payment(1, [1, 2])
    assert len(db.bookings.get_unpaid_by_member(1)) == 1


def test_memory_based_model():
    booking_test_case(MemoryDatabase())
    booking_test_get_by_ids_and_member_id(MemoryDatabase())
    booking_test_update_payment(MemoryDatabase())
    booking_test_get_unpaid_by_member(MemoryDatabase())


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    booking_test_case(MySQLDatabase(debug=True))
    booking_test_get_by_ids_and_member_id(MySQLDatabase(debug=True))
    booking_test_update_payment(MySQLDatabase(debug=True))
    booking_test_get_unpaid_by_member(MySQLDatabase(debug=True))
