import pytest

from taipei_day_trip.utils import tappay

# https://docs.tappaysdk.com/tutorial/zh/reference.html#what-is-it234

# url
get_prime_url = "https://js.tappaysdk.com/payment/tpdirect/sandbox/getprime"
pay_by_prime_url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"

# auth
appid = 11327
appkey = "app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC"
partner_key = "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM"
merchant_id = "GlobalTesting_CTBC"


def get_prime_ex(card_number):
    cardduedate = "202301"
    cardccv = "123"
    return tappay.get_prime(get_prime_url, appid, appkey, card_number, cardduedate, cardccv)


def pay_by_prime_ex(prime):
    price = 2500
    contact_name = "name"
    contact_email = "a@a.a"
    contact_phone = "0999999999"
    return tappay.pay_by_prime(
        pay_by_prime_url,
        partner_key,
        merchant_id,
        prime,
        price,
        contact_name,
        contact_email,
        contact_phone,
    )


def get_prime_visa_success():
    # 0 - Success ( type : Visa )
    return get_prime_ex("4242424242424242")


def get_prime_card_error():
    # 10003 - Card Error
    return get_prime_ex("4242421602184242")


def get_prime_bank_system_error():
    # 10005 - Bank System Error
    return get_prime_ex("4242422204184242")


def get_prime_duplicate_transaction():
    # 10006 - Duplicate Transaction
    return get_prime_ex("4242424010264242")


def get_prime_bank_merchant_account_data_error():
    # 10008 - Bank Merchant Account Data Error
    return get_prime_ex("4242424612284242")


def get_prime_amount_error():
    # 10009 - Amount Error
    return get_prime_ex("4242426418294242")


def get_prime_order_number_duplicate():
    # 10013 - Order number duplicate
    return get_prime_ex("4242427622294242")


def get_prime_bank_error():
    # 10023 - Bank Error
    return get_prime_ex("4242428826394242")


@pytest.mark.skipif(True, reason="close the test case to tappay")
def test_get_prime():
    assert get_prime_visa_success() != ""
    assert get_prime_card_error() != ""
    assert get_prime_bank_system_error() != ""
    assert get_prime_duplicate_transaction() != ""
    assert get_prime_bank_merchant_account_data_error() != ""
    assert get_prime_amount_error() != ""
    assert get_prime_order_number_duplicate() != ""
    assert get_prime_bank_error() != ""


@pytest.mark.skipif(True, reason="close the test case to tappay")
def test_pay_by_prime():
    assert pay_by_prime_ex(get_prime_visa_success())[0] == 0
    assert pay_by_prime_ex(get_prime_card_error())[0] == 10003
    assert pay_by_prime_ex(get_prime_bank_system_error())[0] == 10005
    assert pay_by_prime_ex(get_prime_duplicate_transaction())[0] == 10006
    assert pay_by_prime_ex(get_prime_bank_merchant_account_data_error())[0] == 10008
    assert pay_by_prime_ex(get_prime_amount_error())[0] == 10009
    assert pay_by_prime_ex(get_prime_order_number_duplicate())[0] == 10013
    assert pay_by_prime_ex(get_prime_bank_error())[0] == 10023
