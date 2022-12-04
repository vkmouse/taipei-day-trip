import pytest

from taipei_day_trip.models import MemoryUnitOfWork
from taipei_day_trip.models import MySQLUnitOfWork
from taipei_day_trip.models import UnitOfWork

def mrt_test_case(db: UnitOfWork):
    assert len(db.mrts.get_all()) == 0

    assert db.mrts.add('mrt1') == True
    all = db.mrts.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'mrt1'
    assert db.mrts.add('mrt1') == False
    assert len(db.mrts.get_all()) == 1

    assert db.mrts.add(None) == False

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    mrt_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_repository():
    db = MySQLUnitOfWork(debug=True)
    mrt_test_case(db)
