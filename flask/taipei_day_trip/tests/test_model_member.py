import pytest

from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.models import Database


def member_test_case(db: Database):
    assert db.members.add("name1", "1@1", "pass1", "avatar_url") == True
    assert db.members.add("name1", "1@1", "pass1", "avatar_url") == False
    assert db.members.get_by_email("1@1") != None
    assert db.members.get_by_email("2@2") == None
    member = db.members.get_by_email("1@1")
    assert member.id == 1
    assert member.name == "name1"
    assert member.email == "1@1"
    assert member.password == "pass1"


def test_memory_based_model():
    db = MemoryDatabase()
    member_test_case(db)


@pytest.mark.skipif(not MySQLDatabase(debug=True).is_available(), reason="database is not avaibable")
def test_mysql_based_model():
    db = MySQLDatabase(debug=True)
    member_test_case(db)
