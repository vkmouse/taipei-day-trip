import pytest

from flask import Flask
from flask.testing import FlaskClient
from taipei_day_trip.middleware import JWT
from taipei_day_trip.models import MemoryCache

jwt = JWT(MemoryCache())


@pytest.fixture()
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True  # TESTING flag is disable error catching during request handling

    @app.route("/test_access_token")
    @jwt.access_token_required
    def test_access_token(member_id):
        return {"ok": True, "member_id": member_id}, 200

    @app.route("/test_refresh_token")
    @jwt.refresh_token_required
    def test_refresh_token(member_id):
        return {"ok": True, "member_id": member_id}, 200

    yield app


@pytest.fixture()
def client(app: Flask):
    return app.test_client()


def test_access_token_with_no_header(client: FlaskClient):
    response = client.get(path="/test_access_token")
    body = response.get_json()
    assert response.status_code == 401
    assert body["error"] == True
    assert body["message"] == "Authorization Token is missing"


def test_access_token_with_invalid_jwt(client: FlaskClient):
    response = client.get(path="/test_access_token", headers={"Authorization": "Bearer 12345"})
    body = response.get_json()
    assert response.status_code == 401
    assert body["error"] == True
    assert body["message"] == "Invalid Authorization token"


def test_access_token_with_refresh(client: FlaskClient):
    response = client.get(
        path="/test_access_token",
        headers={"Authorization": f"Bearer {jwt.make_refresh_token(1)}"},
    )
    body = response.get_json()
    assert response.status_code == 401
    assert body["error"] == True
    assert body["message"] == "Invalid Authorization token"


def test_access_token_success(client: FlaskClient):
    response = client.get(
        path="/test_access_token",
        headers={"Authorization": f"Bearer {jwt.make_access_token(1)}"},
    )
    body = response.get_json()
    assert response.status_code == 200
    assert body["ok"] == True
    assert body["member_id"] == 1


def test_refresh_token_with_no_cookie(client: FlaskClient):
    response = client.get(path="/test_refresh_token")
    body = response.get_json()
    assert response.status_code == 403
    assert body["error"] == True
    assert body["message"] == "Authorization Token is missing"


def test_refresh_token_with_invalid_jwt(client: FlaskClient):
    client.set_cookie("localhost", "refresh_token", "12345")
    response = client.get(path="/test_refresh_token")
    body = response.get_json()
    assert response.status_code == 403
    assert body["error"] == True
    assert body["message"] == "Invalid Authorization token"


def test_refresh_token_with_access(client: FlaskClient):
    client.set_cookie("localhost", "refresh_token", jwt.make_access_token(1))
    response = client.get(path="/test_refresh_token")
    body = response.get_json()
    assert response.status_code == 403
    assert body["error"] == True
    assert body["message"] == "Invalid Authorization token"


def test_refresh_token_success(client: FlaskClient):
    client.set_cookie("localhost", "refresh_token", jwt.make_refresh_token(1))
    response = client.get(path="/test_refresh_token")
    body = response.get_json()
    assert response.status_code == 200
    assert body["ok"] == True
    assert body["member_id"] == 1
