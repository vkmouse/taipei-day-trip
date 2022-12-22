import urllib.parse
import urllib.request
import json

def get_prime(
    url: str,
    appid: int,
    appkey: str,
    cardnumber: str,
    cardduedate: str,
    cardccv: str
):
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-api-key': appkey,
    }
    data = json.dumps({
        'cardnumber': cardnumber,
        'cardduedate': cardduedate,
        'appid': appid,
        'appkey': appkey,
        'appname': 'localhost',
        'url': 'http://localhost',
        'port': '',
        'protocol': 'http:',
        'tappay_sdk_version': 'v5.14.0',
        'cardccv': cardccv,
        'device_id': 'VW01d5qfMSv2MCdZvAvQga7F6W51vc9TdHBpDOhw2WliPTEAAABhRATrbQ9y1H3k'
    })
    data = { 'jsonString': data }
    data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data, headers)
    with urllib.request.urlopen(req) as response:
        data = response.read()
        card_data = json.loads(data)
        return card_data['card']['prime']

def pay_by_prime(
    url: str,
    partner_key: str,
    merchant_id: str,
    prime: str,
    price: int,
    contact_name: str,
    contact_email: str,
    contact_phone: str
) -> tuple[int, str]:
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': partner_key,
    }

    data = {
        'prime': prime,
        'partner_key': partner_key,
        'merchant_id': merchant_id,
        'details': 'Items',
        'amount': price,
        'cardholder': {
            'phone_number': contact_phone,
            'name': contact_name,
            'email': contact_email
        }
    }
    data = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data, headers)

    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        return data['status'], data['msg']
