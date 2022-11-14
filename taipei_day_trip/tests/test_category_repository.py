import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork

def category_test_case(db: UnitOfWork):
    assert len(db.categories.get_all()) == 0
    assert db.categories.add('category1') == True
    all = db.categories.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'category1'
    assert db.categories.add('category1') == False
    assert len(db.categories.get_all()) == 1

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    category_test_case(db)
