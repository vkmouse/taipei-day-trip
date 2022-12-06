import jwt
from flask import request

def make_token(id: int, is_refresh=False) -> str:
    return jwt.encode({ 'id': id, 'is_refresh': is_refresh }, 'secret', algorithm='HS256')

def decode(token: str):
    try:
        return jwt.decode(token, "secret", algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None

def access_token_required(func):
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            words = request.headers['Authorization'].split(' ')
            scheme = words[0]
            if scheme == 'Bearer' and len(words) == 2:
                token = words[1]
        if not token:
            return { 'error': True, 'message': 'Authorization Token is missing' }, 401
        try:
            decoded_token = decode(token)
            if decoded_token == None or decoded_token['is_refresh']:
                return { 'error': True, 'message': 'Invalid Authorization token' }, 401
            member_id = decoded_token['id']
            return func(member_id, *args, **kwargs)
        except Exception as e:
            return { 'error': True, 'message':str(e) }, 500
    return decorator