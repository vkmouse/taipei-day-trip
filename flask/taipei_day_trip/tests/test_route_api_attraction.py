import pytest

from flask import Flask
from flask.testing import FlaskClient
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.route import get_attraction_api
from taipei_day_trip.tests import util

@pytest.fixture()
def app():
    db = init_db()
    app = Flask(__name__)
    app.config['TESTING'] = True # TESTING flag is disable error catching during request handling
    app.register_blueprint(get_attraction_api(db))
    yield app

@pytest.fixture()
def client(app: Flask):
    return app.test_client()

def init_db() -> MemoryUnitOfWork:
    db = MemoryUnitOfWork()
    db.categories.add('category1')
    for i in range(20):
        util.add_attraction(db, name=f'attr{i + 1}')
    return db

def test_attraction_id(client: FlaskClient):
    response = client.get(path='/api/attraction/1')
    assert response.status_code == 200
    assert response.get_json() == {
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

def test_attraction_id_if_not_exists(client: FlaskClient):
    response = client.get(path='/api/attraction/999')
    assert response.status_code == 400
    assert response.get_json() == {
        'error': True,
        'message': 'No attraction id 999'
    }

def test_attractions_if_missing_requestment(client: FlaskClient):
    response = client.get(path='/api/attractions')
    assert response.status_code == 400
    assert response.get_json() == {
        'error': True,
        'message': 'Missing required parameter page'
    }

def test_attractions_if_page_not_a_number(client: FlaskClient):
    response = client.get(path='/api/attractions', query_string={ 'page': 'not a number' })
    assert response.status_code == 400
    assert response.get_json() == {
        'error': True,
        'message': 'page is invalid, it allow only integer number'
    }

def test_attractions_if_page_number_invalid(client: FlaskClient):
    response = client.get(path='/api/attractions', query_string={ 'page': -10 })
    assert response.status_code == 400
    assert response.get_json() == {
        'error': True,
        'message': 'page is invalid, it allow only integer number'
    }

def test_attractions_if_having_next_page(client: FlaskClient):
    response = client.get(path='/api/attractions', query_string={ 'page': 0 })
    assert response.status_code == 200
    body = response.get_json()
    next_page = body['nextPage']
    data = body['data']
    assert next_page == 1
    assert len(data) == 12

def test_attractions_if_not_having_next_page(client: FlaskClient):
    response = client.get(path='/api/attractions', query_string={ 'page': 1 })
    assert response.status_code == 200
    body = response.get_json()
    next_page = body['nextPage']
    data = body['data']
    assert next_page == None
    assert len(data) == 8
