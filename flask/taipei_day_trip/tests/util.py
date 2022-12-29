from datetime import datetime
from taipei_day_trip.models import Database


def add_attraction(db: Database, name: str = None, category: str = None, mrt: str = None) -> bool:
    return db.attractions.add(
        name="attr1" if name == None else name,
        description="desc1",
        address="addr",
        lat=50,
        lng=40,
        transport="trans",
        images=["123", "456"],
        category="category1" if category == None else category,
        mrt=mrt,
    )


def create_basic_data(db: Database):
    db.categories.add("category1")
    db.mrts.add("mrt1")
    add_attraction(db, name="attr1")


def create_member_data(db: Database):
    db.members.add("name1", "1@1", "pass1", "avatar")
    db.members.add("name2", "2@2", "pass2", "avatar")


def create_booking_data(db: Database):
    db.bookings.add(1, 1, datetime(2000, 1, 1, 10), datetime(2000, 1, 1, 15), 2000)
    db.bookings.add(1, 1, datetime(2000, 1, 2, 10), datetime(2000, 1, 2, 15), 2500)
    db.bookings.add(1, 1, datetime(2000, 1, 3, 10), datetime(2000, 1, 3, 15), 2000)
    db.bookings.add(2, 1, datetime(2000, 1, 4, 10), datetime(2000, 1, 4, 15), 2000)
    db.bookings.add(2, 1, datetime(2000, 1, 5, 10), datetime(2000, 1, 5, 15), 2500)
    db.bookings.add(2, 1, datetime(2000, 1, 6, 10), datetime(2000, 1, 6, 15), 2000)
