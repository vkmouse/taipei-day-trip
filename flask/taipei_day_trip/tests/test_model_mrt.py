import pytest

from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database

def mrt_test_case(db: Database):
    assert len(db.mrts.get_all()) == 0

    assert db.mrts.add('mrt1') == True
    all = db.mrts.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'mrt1'
    assert db.mrts.add('mrt1') == False
    assert len(db.mrts.get_all()) == 1

    assert db.mrts.add(None) == False

def test_memory_based_model():
    db = MemoryDatabase()
    mrt_test_case(db)

@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    db = MySQLDatabase(debug=True)
    mrt_test_case(db)
