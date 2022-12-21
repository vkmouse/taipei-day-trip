import pytest

from datetime import datetime
from datetime import timedelta
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database
from taipei_day_trip.tests import util

def create_basic_data(db: Database):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    util.add_attraction(db, name='attr1')

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

def booking_test_case(db: Database):
    assert len(db.bookings.get_by_member(1)) == 0
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 14) + timedelta(hours=3), 2000) == False

    create_basic_data(db)
    create_member_data(db)
 
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    assert db.bookings.add(2, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 16), datetime(2000, 1, 1, 20), 2500) == False
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 17), datetime(2000, 1, 1, 21), 2500) == True
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 10), datetime(2000, 1, 1, 23), 2500) == False
    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 15), datetime(2000, 1, 1, 16), 2500) == False
    
    booking_list = db.bookings.get_by_member(1)
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
    booking_list = db.bookings.get_by_member(1)
    assert len(booking_list) == 2

    db.bookings.remove_by_id(1, booking_list[0].id)
    booking_list = db.bookings.get_by_member(1)
    assert len(booking_list) == 1
    assert booking_list[0].starttime == datetime(2000, 1, 1, 17)
    assert booking_list[0].endtime == datetime(2000, 1, 1, 21)
    assert booking_list[0].price == 2500
    assert booking_list[0].attraction.name == 'attr1'

    assert db.bookings.add(1, 1, datetime(2000, 1, 1, 14), datetime(2000, 1, 1, 17), 2000) == True
    db.bookings.remove_by_member(1)
    assert len(db.bookings.get_by_member(1)) == 0

def booking_test_get_by_ids_and_member_id(db: Database):
    create_basic_data(db)
    create_member_data(db)
    create_booking_data(db)
    assert len(db.bookings.get_by_member_and_id([1, 2, 3], 1)) == 3
    assert len(db.bookings.get_by_member_and_id([2, 3, 4], 1)) == 2
    assert len(db.bookings.get_by_member_and_id([4, 5, 6], 1)) == 0

def test_memory_based_model():
    booking_test_case(MemoryDatabase())
    booking_test_get_by_ids_and_member_id(MemoryDatabase())

@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    booking_test_case(MySQLDatabase(debug=True))
    booking_test_get_by_ids_and_member_id(MySQLDatabase(debug=True))
