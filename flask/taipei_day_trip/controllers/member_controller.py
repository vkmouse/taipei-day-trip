import re

from taipei_day_trip.models import Database

class MemberController:
    def __init__(self, db: Database):
        self.__db = db
        self.validator = MemberValidator()
        self.view = MemberView()

    def register(self, name: str | None, email: str | None, password: str | None):
        if (not self.validator.validate_name(name) or
            not self.validator.validate_email(email) or
            not self.validator.validate_password(password)):
            return self.view.render_register_validation_failed()
        success = self.__db.members.add(name, email, password)
        if not success:
            return self.view.render_register_email_conflict()
        return self.view.render_register_success()

class MemberValidator:
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
    def render_register_success(self):
        return { 'ok': True }, 200

    def render_register_validation_failed(self):
        return { 'error': True, 'message': 'Registration information is incorrect' }, 400

    def render_register_email_conflict(self):
        return { 'error': True, 'message': 'That email is taken. Try another' }, 409
