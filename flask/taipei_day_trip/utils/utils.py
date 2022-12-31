import bcrypt


def hashpw(password: str) -> str:
    password = password.encode("utf-8")
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")


def checkpw(password: str, hashed_password: str) -> bool:
    password = password.encode("utf-8")
    hashed_password = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password, hashed_password)
