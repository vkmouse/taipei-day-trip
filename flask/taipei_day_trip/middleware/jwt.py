import jwt

def make_token(id: int, is_refresh=False) -> str:
    return jwt.encode({ 'id': id, 'is_refresh': is_refresh }, 'secret', algorithm='HS256')

def decode(token: str):
    try:
        return jwt.decode(token, "secret", algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None
