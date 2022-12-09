import pytest

from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database

def category_test_case(db: Database):
    assert len(db.categories.get_all()) == 0
    assert db.categories.add('category1') == True
    all = db.categories.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'category1'
    assert db.categories.add('category1') == False
    assert len(db.categories.get_all()) == 1

def test_memory_based_model():
    db = MemoryDatabase()
    category_test_case(db)

@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    db = MySQLDatabase(debug=True)
    category_test_case(db)
