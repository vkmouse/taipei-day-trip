from taipei_day_trip.controllers import MemberController
from taipei_day_trip.models import MemoryDatabase

def create_controller() -> MemberController:
    db = MemoryDatabase()
    db.members.add('mem1', 'mem1@mem1.com', '12345')
    return MemberController(db)

def test_member_register():
    controller = create_controller()
    assert controller.register('mem2', 'mem1@mem1.com', '23345') == controller.view.render_register_email_conflict()
    assert controller.register('mem1', 'mem2@mem1.com', '12345') == controller.view.render_register_success()
    assert controller.register('', 'mem2@mem1.com', '12345') == controller.view.render_register_validation_failed()

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
