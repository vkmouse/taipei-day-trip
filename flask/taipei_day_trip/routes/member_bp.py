from flask import Blueprint
from flask import make_response
from flask import request
from taipei_day_trip.controllers import MemberController
from taipei_day_trip.middleware import JWT
from taipei_day_trip.models import Cache
from taipei_day_trip.models import Database
from taipei_day_trip.utils import generate_refresh_token_exp

def member_bp(db: Database, cache: Cache):
    controller = MemberController(db, cache)
    bp = Blueprint('member', __name__)
    jwt = JWT(cache)

    @bp.route('/api/user', methods=['POST'])
    def user():
        if request.content_type != 'application/json':
            return controller.view.render_invalid_parameter()
        body = request.get_json()
        return controller.register(body['name'], body['email'], body['password'])

    @bp.route('/api/user/refresh', methods=['POST'])
    @jwt.refresh_token_required
    def user_refresh(member_id):
        return controller.refresh(member_id)

    @bp.route('/api/user/auth', methods=['GET', 'PUT', 'DELETE'])
    def user_auth():
        if request.method == 'GET':
            return user_auth_get()
        elif request.method == 'PUT':
            return user_auth_put()
        elif request.method == 'DELETE':
            return user_auth_delete()

    @jwt.access_token_required
    def user_auth_get(member_id):
        return controller.get_auth(member_id)

    def user_auth_put():
        if request.content_type != 'application/json':
            return controller.view.render_invalid_parameter()
        body = request.get_json()
        resp, refresh_token = controller.login(body['email'], body['password'])
        response = make_response(resp)
        if refresh_token:
            exp = generate_refresh_token_exp()
            response.set_cookie('refresh_token', refresh_token, expires=exp, httponly=True, secure=True)
        return response

    def user_auth_delete():
        refresh_token = request.cookies.get('refresh_token')
        response = make_response(controller.logout(refresh_token))
        response.set_cookie('refresh_token', '', expires=0)
        return response

    return bp
