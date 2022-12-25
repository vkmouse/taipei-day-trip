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
