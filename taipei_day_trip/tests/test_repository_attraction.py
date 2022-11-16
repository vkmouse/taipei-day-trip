import pytest

from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.repository import MySQLUnitOfWork
from taipei_day_trip.tests import util

def attraction_test_case(db: UnitOfWork):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    db.mrts.add('mrt2')
    assert len(db.attractions.get_all()) == 0
    assert util.add_attraction(db, mrt='mrt2') == True
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
    assert util.add_attraction(db, mrt='mrt2', category='category2') == False

def images_test_case(db: UnitOfWork):
    db.categories.add('category1')
    db.mrts.add('mrt1')
    assert util.add_attraction(db) == True
    actual = db.attractions.get_all()[0].images
    assert len(actual) == 2
    assert actual[0] == '123'
    assert actual[1] == '456'

def null_mrt_test_case(db: UnitOfWork):
    db.categories.add('category1')
    assert util.add_attraction(db, mrt=None) == True
    assert db.attractions.get_all()[0].mrt == None

def get_by_id_test_case(db: UnitOfWork):
    db.categories.add('category1')
    assert util.add_attraction(db, name='attr1') == True
    assert util.add_attraction(db, name='attr2') == True
    assert db.attractions.get_by_id(1).name == 'attr1'
    assert db.attractions.get_by_id(2).name == 'attr2'

def get_range_test_case(db: UnitOfWork):
    db.categories.add('category1')
    assert util.add_attraction(db, name='attr1') == True
    assert util.add_attraction(db, name='attr2') == True
    assert util.add_attraction(db, name='attr3') == True
    assert util.add_attraction(db, name='attr4') == True
    actuals = db.attractions.get_range(1, 3)
    assert len(actuals) == 2
    assert actuals[0].name == 'attr2'
    assert actuals[1].name == 'attr3'
    actuals = db.attractions.get_range(3, 5)
    assert len(actuals) == 1
    assert actuals[0].name == 'attr4'

def search_by_name_test_case(db: UnitOfWork):
    db.categories.add('category1')
    assert util.add_attraction(db, name='月牙灣') == True
    assert util.add_attraction(db, name='月牙刀') == True
    assert util.add_attraction(db, name='月亮') == True
    assert util.add_attraction(db, name='吃月餅') == True
    assert len(db.attractions.search_by_category_or_name('月', 0, 4)) == 4
    assert len(db.attractions.search_by_category_or_name('月牙', 0, 4)) == 2
    assert len(db.attractions.search_by_category_or_name('月牙刀', 0, 4)) == 1
    assert len(db.attractions.search_by_category_or_name('月餅', 0, 4)) == 1
    assert len(db.attractions.search_by_category_or_name('月', 1, 3)) == 2
    assert len(db.attractions.search_by_category_or_name('月', 2, 10)) == 2

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

def test_memory_based_get_range():
    db = MemoryUnitOfWork()
    get_range_test_case(db)

def test_memory_search_by_name():
    db = MemoryUnitOfWork()
    search_by_name_test_case(db)

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

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_get_range():
    db = MySQLUnitOfWork('config.json', debug=True)
    get_range_test_case(db)

@pytest.mark.skipif(not MySQLUnitOfWork.is_available('config.json'), reason="database is not avaibable")
def test_mysql_based_search_by_name():
    db = MySQLUnitOfWork('config.json', debug=True)
    search_by_name_test_case(db)
