import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork

def attraction_test_case(db: UnitOfWork):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    assert len(db.attractions.get_all()) == 0

    assert db.attractions.add(name='attr1',
                              description='desc1',
                              address='addr',
                              lat=50,
                              lng=40,
                              transport='trans',
                              images=[],
                              category_id=1,
                              mrt_id=1) == True
    all = db.attractions.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'attr1'
    assert all[0].description == 'desc1'
    assert all[0].address == 'addr'
    assert all[0].lat == 50
    assert all[0].lng == 40
    assert all[0].transport == 'trans'
    assert all[0].images == []
    assert all[0].category == 'category1'
    assert all[0].mrt == 'mrt1'

    assert db.attractions.add(name='attr1',
                              description='desc1',
                              address='addr',
                              lat=50,
                              lng=40,
                              transport='trans',
                              images=[],
                              category_id=2,
                              mrt_id=2) == False

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    attraction_test_case(db)
