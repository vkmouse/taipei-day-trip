import re

class BaseValidator:
    def validate_str_is_not_empty(self, value: str | None) -> bool:
        return type(value) == str and value != None and len(value) != 0

    def validate_number(self, value: str | None) -> bool:
        return type(value) == int or (value != None and value.isdigit())

    def validate_phone(self, value: str | None) -> bool:
        if value == None:
            return False
        match = re.search(r'^09[0-9]{8}$', value)
        return match != None and match.group() == value

    def validate_name(self, value: str | None):
        if value == None:
            return False
        match = re.search('.{1,20}', value)
        return match != None and match.group() == value

    def validate_email(self, value: str | None) -> bool:
        if value == None:
            return False
        match = re.search(r'\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$', value)
        return match != None and match.group() == value

    def validate_password(self, value: str | None):
        if value == None:
            return False
        match = re.search(r'[.*a-zA-Z\d]{4,100}', value)
        return match != None and match.group() == value

class BaseView:
    def render_success(self):
        return { 'ok': True }, 200

    def render_invalid_parameter(self):
        return { 'error': True, 'message': 'Invalid parameter' }, 400

    def render_unexpected(self, e: Exception):
        return { 'error': True, 'message': str(e) }, 500
