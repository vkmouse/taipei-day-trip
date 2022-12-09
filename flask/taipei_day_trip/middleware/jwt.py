import jwt

from flask import request
from taipei_day_trip.utils import generate_access_token_exp
from taipei_day_trip.utils import generate_refresh_token_exp
from taipei_day_trip.utils import secret_key

def get_exp(is_refresh: bool):
    if is_refresh:
        return generate_refresh_token_exp()
    else:
        return generate_access_token_exp()

def make_token(id: int, is_refresh=False) -> str:
    return jwt.encode({ 
        'id': id,
        'is_refresh': is_refresh,
        'exp': get_exp(is_refresh)
    }, secret_key, algorithm='HS256')

def decode(token: str):
    try:
        return jwt.decode(token, secret_key, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        return None

def access_token_required(func):
    view = JWTView()
    def access_token_required_wrapper(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            words = request.headers['Authorization'].split(' ')
            scheme = words[0]
            if scheme == 'Bearer' and len(words) == 2:
                token = words[1]
        if not token:
            return view.render_missing_access_token()
        try:
            decoded_token = decode(token)
            if decoded_token == None or decoded_token['is_refresh']:
                return view.render_invalid_access_token()
            member_id = decoded_token['id']
            return func(member_id, *args, **kwargs)
        except Exception as e:
            return view.render_unexpected(e)
    return access_token_required_wrapper

def refresh_token_required(func):
    view = JWTView()
    def refresh_token_required_wrapper(*args, **kwargs):
        token = request.cookies.get('refresh_token')
        if not token:
            return view.render_missing_refresh_token()
        try:
            decoded_token = decode(token)
            if decoded_token == None or decoded_token['is_refresh'] == False:
                return view.render_invalid_refresh_token()
            member_id = decoded_token['id']
            return func(member_id, *args, **kwargs)
        except Exception as e:
            return view.render_unexpected(e)
    return refresh_token_required_wrapper

class JWTView:
    def render_missing_access_token(self):
        return { 'error': True, 'message': 'Authorization Token is missing' }, 401

    def render_invalid_access_token(self):
        return { 'error': True, 'message': 'Invalid Authorization token' }, 401

    def render_missing_refresh_token(self):
        return { 'error': True, 'message': 'Authorization Token is missing' }, 403

    def render_invalid_refresh_token(self):
        return { 'error': True, 'message': 'Invalid Authorization token' }, 403

    def render_unexpected(self, e: Exception):
        return { 'error': True, 'message':str(e) }, 500
