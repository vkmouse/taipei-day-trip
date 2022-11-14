import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork

def mrt_test_case(db: UnitOfWork):
    assert len(db.mrts.get_all()) == 0
    assert db.mrts.add('mrt1') == True
    all = db.mrts.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'mrt1'
    assert db.mrts.add('mrt1') == False
    assert len(db.mrts.get_all()) == 1

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    mrt_test_case(db)
