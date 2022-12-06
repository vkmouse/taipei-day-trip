from flask import Blueprint
from flask import make_response
from flask import request

from taipei_day_trip.controllers import MemberController
from taipei_day_trip.middleware import access_token_required
from taipei_day_trip.middleware import refresh_token_required
from taipei_day_trip.models import Database

def member_bp(db: Database):
    controller = MemberController(db)
    bp = Blueprint('member', __name__)

    @bp.route('/api/user', methods=['POST'])
    def user():
        if request.content_type != 'application/json':
            return controller.view.render_invalid_parameter()
        body = request.get_json()
        return controller.register(body['name'], body['email'], body['password'])

    @bp.route('/api/user/refresh', methods=['POST'])
    @refresh_token_required
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

    @access_token_required
    def user_auth_get(member_id):
        return controller.get_auth(member_id)

    def user_auth_put():
        if request.content_type != 'application/json':
            return controller.view.render_invalid_parameter()
        body = request.get_json()
        resp, refresh_token = controller.login(body['email'], body['password'])
        response = make_response(resp)
        if refresh_token:
            response.set_cookie('refresh_token', refresh_token)
        return response

    def user_auth_delete():
        response = make_response(controller.logout())
        response.set_cookie('refresh_token', '', expires=0)
        return response

    return bp
