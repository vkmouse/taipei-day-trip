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
    body, status_code = controller.attraction(999)
    assert status_code == 400
    assert body == {
        'error': True,
        'message': 'No attraction id 999'
    }

def test_attractions_if_missing_requestment():
    controller = create_controller()
    body, status_code = controller.attractions(None, None)
    assert status_code == 400
    assert body == {
        'error': True,
        'message': 'Missing required parameter page'
    }

def test_attractions_if_page_not_a_number():
    controller = create_controller()
    body, status_code = controller.attractions('not a number', None)
    assert status_code == 400
    assert body == {
        'error': True,
        'message': 'page is invalid, it allow only integer number'
    }

def test_attractions_if_page_number_invalid():
    controller = create_controller()
    body, status_code = controller.attractions('-10', None)
    assert status_code == 400
    assert body == {
        'error': True,
        'message': 'page is invalid, it allow only integer number'
    }

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
