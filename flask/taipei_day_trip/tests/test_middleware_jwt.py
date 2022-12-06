import json
import pytest

from flask import Flask
from flask.testing import FlaskClient
from taipei_day_trip.middleware import access_token_required
from taipei_day_trip.middleware import make_token
from taipei_day_trip.models import MemoryDatabase

@pytest.fixture()
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True # TESTING flag is disable error catching during request handling
    
    @app.route('/test')
    @access_token_required
    def test(member_id):
        return { 'ok': True, 'member_id': member_id }, 200

    yield app

@pytest.fixture()
def client(app: Flask):
    return app.test_client()

def test_access_token_with_no_header(client: FlaskClient):
    response = client.get(path='/test')
    body = response.get_json()
    assert response.status_code == 401
    assert body['error'] == True
    assert body['message'] == 'Authorization Token is missing'

def test_access_token_with_invalid_jwt(client: FlaskClient):
    response = client.get(path='/test', headers={ 'Authorization': 'Bearer 12345' })
    body = response.get_json()
    assert response.status_code == 401
    assert body['error'] == True
    assert body['message'] == 'Invalid Authorization token'

def test_access_token_with_refresh(client: FlaskClient):
    response = client.get(path='/test', headers={ 'Authorization': f'Bearer {make_token(1, is_refresh=True)}' })
    body = response.get_json()
    assert response.status_code == 401
    assert body['error'] == True
    assert body['message'] == 'Invalid Authorization token'

def test_access_token_success(client: FlaskClient):
    response = client.get(path='/test', headers={ 'Authorization': f'Bearer {make_token(1)}' })
    body = response.get_json()
    assert response.status_code == 200
    assert body['ok'] == True
    assert body['member_id'] == 1
