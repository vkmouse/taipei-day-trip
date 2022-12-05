from taipei_day_trip.controllers import MemberController
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import Member

def create_controller() -> MemberController:
    db = MemoryDatabase()
    db.members.add('mem1', 'mem1@mem1.com', '12345')
    return MemberController(db)

def test_member_register():
    controller = create_controller()
    assert controller.register('mem2', 'mem1@mem1.com', '23345') == controller.view.render_register_email_conflict()
    assert controller.register('mem1', 'mem2@mem1.com', '12345') == controller.view.render_register_success()
    assert controller.register('', 'mem2@mem1.com', '12345') == controller.view.render_register_validation_failed()

def test_member_get_auth():
    controller = create_controller()
    assert controller.get_auth('1') == controller.view.render_get_auth(Member(1, 'mem1', 'mem1@mem1.com', '12345'))
    assert controller.get_auth('0') == controller.view.render_get_auth(None)
    assert controller.get_auth('fds4s') == controller.view.render_get_auth(None)
    assert controller.get_auth(None) == controller.view.render_get_auth(None)

def test_member_validate_id():
    controller = create_controller()
    assert controller.validator.validate_id('10') == True
    assert controller.validator.validate_id(None) == False
    assert controller.validator.validate_id('fdsf') == False

def test_member_validate_name():
    controller = create_controller()
    assert controller.validator.validate_name(None) == False
    assert controller.validator.validate_name('') == False
    assert controller.validator.validate_name('a'*21) == False
    assert controller.validator.validate_name('a') == True

def test_member_validate_email():
    controller = create_controller()
    assert controller.validator.validate_email(None) == False
    assert controller.validator.validate_email('') == False
    assert controller.validator.validate_email('aaa') == False
    assert controller.validator.validate_email('aaa@aaa') == False
    assert controller.validator.validate_email('aaa@aaa.aaa') == True
    
def test_member_validate_password():
    controller = create_controller()
    assert controller.validator.validate_password(None) == False
    assert controller.validator.validate_password('') == False
    assert controller.validator.validate_password('^&^*&^') == False
    assert controller.validator.validate_password('a'*3) == False
    assert controller.validator.validate_password('a'*101) == False
    assert controller.validator.validate_password('a.A14.') == True
