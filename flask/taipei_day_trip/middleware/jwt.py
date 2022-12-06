import dotenv
import jwt
import os

from datetime import datetime
from datetime import timezone
from datetime import timedelta
from flask import request

dotenv.load_dotenv()
secret_key = os.getenv('JWT_SECRET_KEY')
access_token_lifetime = os.getenv('JWT_ACCESS_TOKEN_LIFETIME')
refresh_token_lifetime = os.getenv('JWT_REFRESH_TOKEN_LIFETIME')

def get_exp(is_refresh: bool):
    exp = datetime.now(tz=timezone.utc)
    if is_refresh:
        exp += timedelta(seconds=int(refresh_token_lifetime))
    else:
        exp += timedelta(seconds=int(access_token_lifetime))
    return exp

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
