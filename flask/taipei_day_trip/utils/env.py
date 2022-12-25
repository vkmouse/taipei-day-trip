import dotenv
import os

dotenv.load_dotenv()

# JWT
access_token_lifetime = os.getenv('JWT_ACCESS_TOKEN_LIFETIME')
secret_key = os.getenv('JWT_SECRET_KEY')
refresh_token_lifetime = os.getenv('JWT_REFRESH_TOKEN_LIFETIME')

# Redis
redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')

# MySQL
mysql_database = os.getenv('MYSQL_DATABASE')
mysql_host = os.getenv('MYSQL_HOST')
mysql_password = os.getenv('MYSQL_PASSWORD')
mysql_user = os.getenv('MYSQL_USER')

# TapPay
tappay_pay_by_prime_url = os.getenv('TAPPAY_PAY_BY_PRIME_URL')
tappay_partner_key = os.getenv('TAPPAY_PARTNER_KEY')
tappay_merchant_id = os.getenv('TAPPAY_MERCHANT_ID')

# Debug
is_debug = os.getenv('DEBUG') and os.getenv('DEBUG').upper() == 'TRUE'
