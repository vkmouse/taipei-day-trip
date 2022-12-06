import re

from taipei_day_trip.middleware import decode
from taipei_day_trip.middleware import make_token
from taipei_day_trip.models import Database
from taipei_day_trip.models import Member

class MemberController:
    def __init__(self, db: Database):
        self.__db = db
        self.validator = MemberValidator()
        self.view = MemberView()

    def register(self, name: str | None, email: str | None, password: str | None):
        try:
            if (not self.validator.validate_name(name) or
                not self.validator.validate_email(email) or
                not self.validator.validate_password(password)):
                return self.view.render_register_validation_failed()
            success = self.__db.members.add(name, email, password)
            if not success:
                return self.view.render_register_email_conflict()
            return self.view.render_success()
        except Exception as e:
            return self.view.render_unexpected(e)

    def get_auth(self, token: str | None):
        try:
            if token == None:
                return self.view.render_get_auth(None)
            decoded = decode(token)
            if decoded == None:
                return self.view.render_get_auth(None)
            id = decoded['id']
            if not self.validator.validate_id(str(id)):
                return self.view.render_get_auth(None)
            member = self.__db.members.get_by_id(int(id))
            return self.view.render_get_auth(member)
        except Exception as e:
            return self.view.render_unexpected(e)

    def login(self, email: str | None, password: str | None):
        try:
            if not email and self.validator.validate_email(email):
                return self.view.render_email_is_not_exists(), None
            if not password and self.validator.validate_password(password):
                return self.view.render_password_is_incorrect(), None
            member = self.__db.members.get_by_email(email)
            if member == None:
                return self.view.render_email_is_not_exists(), None
            if member.password != password:
                return self.view.render_password_is_incorrect(), None
            access_token = make_token(member.id)
            refresh_token = make_token(member.id, is_refresh=True)
            return self.view.render_login_success(access_token), refresh_token
        except Exception as e:
            return self.view.render_unexpected(e), None

    def logout(self):
        return self.view.render_success()

class MemberValidator:
    def validate_id(self, id: str | None) -> bool:
        return id != None and id.isdigit()

    def validate_name(self, name: str | None):
        if name == None:
            return False
        match = re.search('.{1,20}', name)
        return match != None and match.group() == name

    def validate_email(self, email: str | None) -> bool:
        if email == None:
            return False
        match = re.search(r'\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$', email)
        return match != None and match.group() == email

    def validate_password(self, password: str | None):
        if password == None:
            return False
        match = re.search(r'[.*a-zA-Z\d]{4,100}', password)
        return match != None and match.group() == password

class MemberView:
    def render_success(self):
        return { 'ok': True }, 200

    def render_login_success(self, token: str):
        return { 'ok': True, 'access_token': token }, 200

    def render_get_auth(self, member: Member | None):
        if member:
            return {
                'data': {
                    'id': member.id,
                    'name': member.name,
                    'email': member.email
                }
            }, 200
        return { 'data': None }, 200

    def render_register_validation_failed(self):
        return { 'error': True, 'message': 'Registration information is incorrect' }, 400

    def render_register_email_conflict(self):
        return { 'error': True, 'message': 'That email is taken. Try another' }, 409

    def render_email_is_not_exists(self):
        return { 'error': True, 'message': 'Login email is not exists' }, 400

    def render_password_is_incorrect(self):
        return { 'error': True, 'message': 'Login password is incorrect' }, 400

    def render_invalid_parameter(self):
        return { 'error': True, 'message': 'Invalid parameter' }, 400

    def render_unexpected(self, e: Exception):
        return { 'error': True, 'message': str(e) }, 500
