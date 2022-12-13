from taipei_day_trip.controllers import AttractionController
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.tests import util

def create_controller() -> AttractionController:
    db = MemoryDatabase()
    db.categories.add('category1')
    for i in range(20):
        util.add_attraction(db, name=f'attr{i + 1}')
    return AttractionController(db, 12)

def test_attraction_id():
    controller = create_controller()
    body, status_code = controller.attraction(1)
    assert status_code == 200
    assert body == {
        'data': {
            'id': 1,
            'name': 'attr1',
            'category': 'category1',
            'description': 'desc1',
            'address': 'addr',
            'transport': 'trans',
            'mrt': None,
            'lat': 50,
            'lng': 40,
            'images': ['123', '456']
        }
    }

def test_attraction_id_if_not_exists():
    controller = create_controller()
    assert controller.attraction(999) == controller.view.render_attraction_id_not_exists(999)

def test_attractions_if_missing_requestment():
    controller = create_controller()
    assert controller.attractions(None, None) == controller.view.render_invalid_parameter()

def test_attractions_if_page_not_a_number():
    controller = create_controller()
    assert controller.attractions('not a number', None) == controller.view.render_invalid_parameter()

def test_attractions_if_page_number_invalid():
    controller = create_controller()
    assert controller.attractions('-10', None) == controller.view.render_invalid_parameter()

def test_attractions_if_having_next_page():
    controller = create_controller()
    body, status_code = controller.attractions('0', None)
    assert status_code == 200
    next_page = body['nextPage']
    data = body['data']
    assert next_page == 1
    assert len(data) == 12

def test_attractions_if_not_having_next_page():
    controller = create_controller()
    body, status_code = controller.attractions('1', None)
    assert status_code == 200
    next_page = body['nextPage']
    data = body['data']
    assert next_page == None
    assert len(data) == 8
