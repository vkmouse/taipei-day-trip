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
    util.add_attraction(db, name='attr1')
    util.add_attraction(db, name='attr2')
    util.add_attraction(db, name='attr3')
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
    response = client.get(path='/api/attraction/4')
    assert response.status_code == 400
    assert response.get_json() == {
        'error': True,
        'message': 'No attraction id 4'
    }