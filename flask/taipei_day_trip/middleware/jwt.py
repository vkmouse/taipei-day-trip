import jwt

from datetime import datetime
from flask import request
from taipei_day_trip.models import Cache
from taipei_day_trip.utils import generate_access_token_exp
from taipei_day_trip.utils import generate_refresh_token_exp
from taipei_day_trip.utils import secret_key

class JWT:
    def __init__(self, cache: Cache):
        self.cache = cache
        self.view = JWTView()

    def make_access_token(self, id: int) -> str:
        return JWT.make_token(id, False, generate_access_token_exp())

    def make_refresh_token(self, id: int) -> str:
        return JWT.make_token(id, True, generate_refresh_token_exp())

    def access_token_required(self, func):
        def access_token_required_wrapper(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                words = request.headers['Authorization'].split(' ')
                scheme = words[0]
                if scheme == 'Bearer' and len(words) == 2:
                    token = words[1]
            if not token:
                return self.view.render_missing_access_token()
            try:
                decoded_token = JWT.decode(token)
                if decoded_token == None or decoded_token['is_refresh']:
                    return self.view.render_invalid_access_token()
                member_id = decoded_token['id']
                # self.cache.set(member_id, '')
                return func(member_id, *args, **kwargs)
            except Exception as e:
                return self.view.render_unexpected(e)
        return access_token_required_wrapper

    def refresh_token_required(self, func):
        def refresh_token_required_wrapper(*args, **kwargs):
            token = request.cookies.get('refresh_token')
            if not token:
                return self.view.render_missing_refresh_token()
            try:
                decoded_token = JWT.decode(token)
                if decoded_token == None or decoded_token['is_refresh'] == False:
                    return self.view.render_invalid_refresh_token()
                # if self.cache.get(decoded_token['id']):
                #     return self.view.render_invalid_refresh_token()
                member_id = decoded_token['id']
                return func(member_id, *args, **kwargs)
            except Exception as e:
                return self.view.render_unexpected(e)
        return refresh_token_required_wrapper

    @staticmethod
    def make_token(id: int, is_refresh: bool, exp: datetime) -> str:
        return jwt.encode({ 
            'id': id,
            'is_refresh': is_refresh,
            'exp': exp,
        }, secret_key, algorithm='HS256')

    @staticmethod
    def decode(token: str):
        try:
            return jwt.decode(token, secret_key, algorithms=['HS256'])
        except jwt.InvalidTokenError:
            return None

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
