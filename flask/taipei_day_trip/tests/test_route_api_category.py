import pytest

from flask import Flask
from flask.testing import FlaskClient
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.route import get_category_api

@pytest.fixture()
def app():
    db = init_db()
    app = Flask(__name__)
    app.config["TESTING"] = True # TESTING flag is disable error catching during request handling
    app.register_blueprint(get_category_api(db))
    yield app

@pytest.fixture()
def client(app: Flask):
    return app.test_client()

def init_db() -> MemoryUnitOfWork:
    db = MemoryUnitOfWork()
    db.categories.add('cat1')
    db.categories.add('cat2')
    db.categories.add('cat3')
    db.categories.add('cat4')
    return db

def test_categories(client: FlaskClient):
    response = client.get(path='/api/categories')
    assert response.status_code == 200
    assert response.get_json() == {
        'data': ['cat1', 'cat2', 'cat3', 'cat4']
    }
