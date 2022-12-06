import json
import pytest

from flask import Flask
from flask.testing import FlaskClient
from werkzeug.http import parse_cookie
from taipei_day_trip.middleware import decode
from taipei_day_trip.middleware import make_token
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.routes import member_bp

@pytest.fixture()
def app():
    db = create_db()
    app = Flask(__name__)
    app.config["TESTING"] = True # TESTING flag is disable error catching during request handling
    app.register_blueprint(member_bp(db))
    yield app

@pytest.fixture()
def client(app: Flask):
    return app.test_client()

def create_db() -> MemoryDatabase:
    db = MemoryDatabase()
    db.members.add('mem1', 'mem1@mem1.com', '12345')
    return db

def test_login_success(client: FlaskClient):
    response = client.put(
        path='/api/user/auth',
        data=json.dumps({ 
            'email': 'mem1@mem1.com',
            'password': '12345'
        }),
        content_type='application/json'
    )
    body = response.get_json()
    access_token = body['access_token']
    cookie = response.headers.get('Set-Cookie')
    cookie_attrs = parse_cookie(cookie)
    refresh_token = cookie_attrs['refresh_token']
    assert body['ok'] == True
    assert decode(access_token) == { 'id': 1, 'is_refresh': False }
    assert decode(refresh_token) == { 'id': 1, 'is_refresh': True }

def test_logout(client: FlaskClient):
    response = client.delete(path='/api/user/auth')
    assert response.get_json() == { 'ok': True }
    cookie = response.headers.get('Set-Cookie')
    cookie_attrs = parse_cookie(cookie)
    assert cookie_attrs['refresh_token'] == ''

def test_get_auth_success(client: FlaskClient):
    token = make_token(1)
    client.set_cookie('localhost', 'refresh_token', token)
    response = client.get(path='/api/user/auth')
    assert response.status_code == 200
    assert response.get_json()['data'] != None

def test_get_auth_failed(client: FlaskClient):
    response = client.get(path='/api/user/auth')
    assert response.status_code == 200
    assert response.get_json()['data'] == None
