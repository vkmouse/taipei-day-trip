import pytest

from datetime import datetime
from datetime import timedelta
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database
from taipei_day_trip.tests import util

def booking_test_case(db: Database):
    assert len(db.bookings.get_by_member_id(1)) == 0
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 14) + timedelta(hours=3), 2000) == False
    db.categories.add('category1')
    db.mrts.add('mrt1')
    util.add_attraction(db, name='attr1')
    db.members.add("name1", "1@1", "pass1")
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 16), datetime(2000, 1, 1, 20), 2500) == False
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 17), datetime(2000, 1, 1, 21), 2500) == True
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 10), datetime(2000, 1, 1, 23), 2500) == False
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 15), datetime(2000, 1, 1, 16), 2500) == False
    
    booking_list = db.bookings.get_by_member_id(1)
    assert len(booking_list) == 2
    assert booking_list[0].starttime == datetime(2000, 1, 1, 14)
    assert booking_list[0].endtime == datetime(2000, 1, 1, 17)
    assert booking_list[0].price == 2000
    assert booking_list[0].attraction.name == 'attr1'
    assert booking_list[0].attraction.images[0] == '123'
    assert booking_list[1].starttime == datetime(2000, 1, 1, 17)
    assert booking_list[1].endtime == datetime(2000, 1, 1, 21)
    assert booking_list[1].price == 2500
    assert booking_list[1].attraction.name == 'attr1'

    db.bookings.remove_by_id(2, booking_list[0].id)
    booking_list = db.bookings.get_by_member_id(1)
    assert len(booking_list) == 2

    db.bookings.remove_by_id(1, booking_list[0].id)
    booking_list = db.bookings.get_by_member_id(1)
    assert len(booking_list) == 1
    assert booking_list[0].starttime == datetime(2000, 1, 1, 17)
    assert booking_list[0].endtime == datetime(2000, 1, 1, 21)
    assert booking_list[0].price == 2500
    assert booking_list[0].attraction.name == 'attr1'

    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    db.bookings.remove_by_member_id(1)
    assert len(db.bookings.get_by_member_id(1)) == 0

def test_memory_based_model():
    db = MemoryDatabase()
    booking_test_case(db)

@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    db = MySQLDatabase(debug=True)
    booking_test_case(db)
