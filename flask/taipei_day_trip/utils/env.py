import dotenv
import os

dotenv.load_dotenv()

# JWT
access_token_lifetime = os.getenv('JWT_ACCESS_TOKEN_LIFETIME')
secret_key = os.getenv('JWT_SECRET_KEY')
refresh_token_lifetime = os.getenv('JWT_REFRESH_TOKEN_LIFETIME')

# MySQL
mysql_database = os.getenv('MYSQL_DATABASE')
mysql_host = os.getenv('MYSQL_HOST')
mysql_password = os.getenv('MYSQL_PASSWORD')
mysql_user = os.getenv('MYSQL_USER')

# Debug
is_debug = os.getenv('DEBUG') and os.getenv('DEBUG').upper() == 'TRUE'
