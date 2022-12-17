class BaseValidator:
    def validate_number(self, value: str | None) -> bool:
        return type(value) == int or (value != None and value.isdigit())

class BaseView:
    def render_success(self):
        return { 'ok': True }, 200

    def render_invalid_parameter(self):
        return { 'error': True, 'message': 'Invalid parameter' }, 400

    def render_unexpected(self, e: Exception):
        return { 'error': True, 'message': str(e) }, 500
