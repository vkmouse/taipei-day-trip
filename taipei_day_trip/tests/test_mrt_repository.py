import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.repository import MySQLUnitOfWork

def mrt_test_case(db: UnitOfWork):
    assert len(db.mrts.get_all()) == 0

    assert db.mrts.add('mrt1') == True
    all = db.mrts.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'mrt1'
    assert db.mrts.add('mrt1') == False
    assert len(db.mrts.get_all()) == 1
    
    assert db.mrts.add(None) == True
    assert len(db.mrts.get_all()) == 2
    assert db.mrts.get_all()[1].name == None

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    mrt_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.isAvailable('config.json'), reason="database is not avaibable")
def test_mysql_based_repository():
    db = MySQLUnitOfWork('config.json', debug=True)
    mrt_test_case(db)
