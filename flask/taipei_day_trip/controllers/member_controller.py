import re
from taipei_day_trip.controllers.base import BaseValidator, BaseView

from taipei_day_trip.middleware import JWT
from taipei_day_trip.models import Cache
from taipei_day_trip.models import Database
from taipei_day_trip.models import Member
from taipei_day_trip.utils import checkpw
from taipei_day_trip.utils import hashpw

class MemberController:
    def __init__(self, db: Database, cache: Cache):
        self.__db = db
        self.jwt = JWT(cache)
        self.validator = MemberValidator()
        self.view = MemberView()

    def register(self, name: str | None, email: str | None, password: str | None):
        try:
            if (not self.validator.validate_name(name) or
                not self.validator.validate_email(email) or
                not self.validator.validate_password(password)):
                return self.view.render_register_validation_failed()
            password = hashpw(password)
            success = self.__db.members.add(name, email, password)
            if not success:
                return self.view.render_register_email_conflict()
            return self.view.render_success()
        except Exception as e:
            return self.view.render_unexpected(e)

    def get_auth(self, id: int):
        try:
            member = self.__db.members.get_by_id(id)
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
            if not checkpw(password, member.password):
                return self.view.render_password_is_incorrect(), None
            access_token = self.jwt.make_access_token(member.id)
            refresh_token = self.jwt.make_refresh_token(member.id)
            return self.view.render_login_success(access_token), refresh_token
        except Exception as e:
            return self.view.render_unexpected(e), None

    def logout(self, token: str | None):
        self.jwt.block_refresh_token(token)
        return self.view.render_success()

    def refresh(self, id: int):
        access_token = self.jwt.make_access_token(id)
        return self.view.render_login_success(access_token)

class MemberValidator(BaseValidator):
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

class MemberView(BaseView):
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
