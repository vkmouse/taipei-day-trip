import jwt

def make_token(id: int) -> str:
    return jwt.encode({'id': id}, 'secret', algorithm='HS256')

def decode(token: str):
    try:
        return jwt.decode(token, "secret", algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None
