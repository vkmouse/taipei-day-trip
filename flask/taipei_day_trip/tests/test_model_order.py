from datetime import datetime
from taipei_day_trip.models import MemoryDatabase
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

def order_test_case(db: Database):
    create_basic_data(db)
    create_member_data(db)
    create_booking_data(db)
    id1 = db.orders.add(1, 9999, [1, 2, 3], 0, 'name', 'email', 'phone')
    id2 = db.orders.add(2, 9999, [4, 5, 6], 0, 'name', 'email', 'phone')
    assert id1 == 1 and id2 == 2

    assert db.orders.get_by_id(id1, 2) == None
    assert db.orders.get_by_id(id2, 1) == None

    order1 = db.orders.get_by_id(id1, 1)
    assert len(order1.bookings) == 3
    assert order1.bookings[0].starttime == datetime(2000, 1, 1, 10)
    assert order1.bookings[1].starttime == datetime(2000, 1, 2, 10)
    assert order1.bookings[2].starttime == datetime(2000, 1, 3, 10)
    assert order1.price == 9999
    assert order1.payment_status == 0
    assert order1.contact_name == 'name'
    assert order1.contact_email == 'email'
    assert order1.contact_phone == 'phone'

def test_memory_based_model():
    db = MemoryDatabase()
    order_test_case(db)
