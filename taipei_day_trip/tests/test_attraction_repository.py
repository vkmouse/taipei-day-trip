import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.repository import MySQLUnitOfWork

def add_attraction(db: UnitOfWork, name: str = None, category: str = None, mrt: str = None) -> bool:
    return db.attractions.add(name='attr1' if name == None else name,
                              description='desc1',
                              address='addr',
                              lat=50,
                              lng=40,
                              transport='trans',
                              images=['123', '456'],
                              category='category1' if category == None else category,
                              mrt=mrt)

def attraction_test_case(db: UnitOfWork):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    db.mrts.add('mrt2')
    assert len(db.attractions.get_all()) == 0
    assert add_attraction(db, mrt='mrt2') == True
    all = db.attractions.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == 'attr1'
    assert all[0].description == 'desc1'
    assert all[0].address == 'addr'
    assert all[0].lat == 50
    assert all[0].lng == 40
    assert all[0].transport == 'trans'
    assert all[0].images == ['123', '456']
    assert all[0].category == 'category1'
    assert all[0].mrt == 'mrt2'
    assert add_attraction(db, mrt='mrt2', category='category2') == False

def images_test_case(db: UnitOfWork):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    assert add_attraction(db) == True
    actual = db.attractions.get_all()[0].images
    assert len(actual) == 2
    assert actual[0] == '123'
    assert actual[1] == '456'

def null_mrt_test_case(db: UnitOfWork):
    db.categories.add('category1')
    assert add_attraction(db, mrt=None) == True
    assert db.attractions.get_all()[0].mrt == None

def get_by_id_test_case(db: UnitOfWork):
    db.categories.add('category1')
    assert add_attraction(db, name='attr1') == True
    assert add_attraction(db, name='attr2') == True
    assert db.attractions.get_by_id(1).name == 'attr1'
    assert db.attractions.get_by_id(2).name == 'attr2'

def test_memory_based_repository():
    db = MemoryUnitOfWork()
    attraction_test_case(db)

def test_memory_based_images():
    db = MemoryUnitOfWork()
    images_test_case(db)

def test_memory_based_null_mrt():
    db = MemoryUnitOfWork()
    null_mrt_test_case(db)

def test_memory_based_get_by_id():
    db = MemoryUnitOfWork()
    get_by_id_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_repository():
    db = MySQLUnitOfWork('config.json', debug=True)
    attraction_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_images():
    db = MySQLUnitOfWork('config.json', debug=True)
    images_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_null_mrt():
    db = MySQLUnitOfWork('config.json', debug=True)
    null_mrt_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_get_by_id():
    db = MySQLUnitOfWork('config.json', debug=True)
    get_by_id_test_case(db)
