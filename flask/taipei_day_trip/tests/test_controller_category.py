from taipei_day_trip.controllers import CategoryController
from taipei_day_trip.models import MemoryDatabase


def create_controller() -> CategoryController:
    db = MemoryDatabase()
    db.categories.add("cat1")
    db.categories.add("cat2")
    db.categories.add("cat3")
    db.categories.add("cat4")
    return CategoryController(db)


def test_categories():
    controller = create_controller()
    body, status_code = controller.categories()
    assert status_code == 200
    assert body == {"data": ["cat1", "cat2", "cat3", "cat4"]}
