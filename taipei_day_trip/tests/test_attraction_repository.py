import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.repository import MySQLUnitOfWork

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
                              category='category1',
                              mrt='mrt1') == True
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
                              category='category2',
                              mrt='mrt2') == False

def images_test_case(db: UnitOfWork):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    assert db.attractions.add(name='attr1',
                              description='desc1',
                              address='addr',
                              lat=50,
                              lng=40,
                              transport='trans',
                              images=['123', '456'],
                              category='category1',
                              mrt='mrt1') == True
    actual = db.attractions.get_all()[0].images
    assert len(actual) == 2
    assert actual[0] == '123'
    assert actual[1] == '456'

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    attraction_test_case(db)

def test_memory_based_images():
    db = MemoryUnitOfWork()
    images_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_repository():
    db = MySQLUnitOfWork('config.json', debug=True)
    attraction_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_images():
    db = MySQLUnitOfWork('config.json', debug=True)
    images_test_case(db)
