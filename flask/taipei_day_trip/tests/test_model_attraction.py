import pytest

from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database
from taipei_day_trip.tests import util


def attraction_test_case(db: Database):
    db.categories.add("category1")
    db.mrts.add("mrt1")
    db.mrts.add("mrt2")
    assert len(db.attractions.get_all()) == 0
    assert util.add_attraction(db, mrt="mrt2") == True
    all = db.attractions.get_all()
    assert len(all) == 1
    assert all[0].id == 1
    assert all[0].name == "attr1"
    assert all[0].description == "desc1"
    assert all[0].address == "addr"
    assert all[0].lat == 50
    assert all[0].lng == 40
    assert all[0].transport == "trans"
    assert all[0].images == ["123", "456"]
    assert all[0].category == "category1"
    assert all[0].mrt == "mrt2"
    assert util.add_attraction(db, mrt="mrt2", category="category2") == False


def images_test_case(db: Database):
    db.categories.add("category1")
    db.mrts.add("mrt1")
    assert util.add_attraction(db) == True
    actual = db.attractions.get_all()[0].images
    assert len(actual) == 2
    assert actual[0] == "123"
    assert actual[1] == "456"


def null_mrt_test_case(db: Database):
    db.categories.add("category1")
    assert util.add_attraction(db, mrt=None) == True
    assert db.attractions.get_all()[0].mrt == None


def get_by_id_test_case(db: Database):
    db.categories.add("category1")
    assert util.add_attraction(db, name="attr1") == True
    assert util.add_attraction(db, name="attr2") == True
    assert db.attractions.get_by_id(1).name == "attr1"
    assert db.attractions.get_by_id(2).name == "attr2"


def get_range_test_case(db: Database):
    db.categories.add("category1")
    assert util.add_attraction(db, name="attr1") == True
    assert util.add_attraction(db, name="attr2") == True
    assert util.add_attraction(db, name="attr3") == True
    assert util.add_attraction(db, name="attr4") == True
    actuals = db.attractions.get_range(1, 3)
    assert len(actuals) == 2
    assert actuals[0].name == "attr2"
    assert actuals[1].name == "attr3"
    actuals = db.attractions.get_range(3, 5)
    assert len(actuals) == 1
    assert actuals[0].name == "attr4"


def search_by_name_test_case(db: Database):
    db.categories.add("category1")
    assert util.add_attraction(db, name="月牙灣") == True
    assert util.add_attraction(db, name="月牙刀") == True
    assert util.add_attraction(db, name="月亮") == True
    assert util.add_attraction(db, name="吃月餅") == True
    assert len(db.attractions.search_by_category_or_name("月", 0, 4)) == 4
    assert len(db.attractions.search_by_category_or_name("月牙", 0, 4)) == 2
    assert len(db.attractions.search_by_category_or_name("月牙刀", 0, 4)) == 1
    assert len(db.attractions.search_by_category_or_name("月餅", 0, 4)) == 1
    assert len(db.attractions.search_by_category_or_name("月", 1, 3)) == 2
    assert len(db.attractions.search_by_category_or_name("月", 2, 10)) == 2


def search_by_category_test_case(db: Database):
    db.categories.add("月牙灣")
    db.categories.add("月牙刀")
    db.categories.add("月亮")
    db.categories.add("吃月餅")
    assert util.add_attraction(db, category="月牙灣") == True
    assert util.add_attraction(db, category="月牙刀") == True
    assert util.add_attraction(db, category="月亮") == True
    assert util.add_attraction(db, category="吃月餅") == True
    assert len(db.attractions.search_by_category_or_name("月", 0, 4)) == 0
    assert len(db.attractions.search_by_category_or_name("月牙", 0, 4)) == 0
    assert len(db.attractions.search_by_category_or_name("月牙刀", 0, 4)) == 1
    assert len(db.attractions.search_by_category_or_name("月餅", 0, 4)) == 0
    assert len(db.attractions.search_by_category_or_name("月牙刀", 2, 10)) == 0


def composite_search_test_case(db: Database):
    db.categories.add("藍色公路")
    db.categories.add("公共藝術")
    assert util.add_attraction(db, name="藍色公路", category="公共藝術") == True
    assert util.add_attraction(db, name="黑色星期五", category="藍色公路") == True
    assert len(db.attractions.search_by_category_or_name("公共藝術", 0, 2)) == 1
    assert len(db.attractions.search_by_category_or_name("藍色公路", 0, 2)) == 2
    assert len(db.attractions.search_by_category_or_name("公路", 0, 2)) == 1


def test_memory_based_model():
    db = MemoryDatabase()
    attraction_test_case(db)


def test_memory_based_images():
    db = MemoryDatabase()
    images_test_case(db)


def test_memory_based_null_mrt():
    db = MemoryDatabase()
    null_mrt_test_case(db)


def test_memory_based_get_by_id():
    db = MemoryDatabase()
    get_by_id_test_case(db)


def test_memory_based_get_range():
    db = MemoryDatabase()
    get_range_test_case(db)


def test_memory_search_by_name():
    db = MemoryDatabase()
    search_by_name_test_case(db)


def test_memory_search_by_category():
    db = MemoryDatabase()
    search_by_category_test_case(db)


def test_memory_composite_search():
    db = MemoryDatabase()
    composite_search_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    db = MySQLDatabase(debug=True)
    attraction_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_images():
    db = MySQLDatabase(debug=True)
    images_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_null_mrt():
    db = MySQLDatabase(debug=True)
    null_mrt_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_get_by_id():
    db = MySQLDatabase(debug=True)
    get_by_id_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_get_range():
    db = MySQLDatabase(debug=True)
    get_range_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_search_by_name():
    db = MySQLDatabase(debug=True)
    search_by_name_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_search_by_category():
    db = MySQLDatabase(debug=True)
    search_by_category_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_composite_search():
    db = MemoryDatabase()
    composite_search_test_case(db)
