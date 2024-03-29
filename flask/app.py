from flask import *
from taipei_day_trip.models import copy_db
from taipei_day_trip.models import RedisCache
from taipei_day_trip.models import MemoryDatabase
from taipei_day_trip.models import MySQLDatabase
from taipei_day_trip.routes import attraction_bp
from taipei_day_trip.routes import avatar_bp
from taipei_day_trip.routes import booking_bp
from taipei_day_trip.routes import category_bp
from taipei_day_trip.routes import member_bp
from taipei_day_trip.routes import order_bp
from taipei_day_trip.utils import is_debug

cache = RedisCache()
mem = MemoryDatabase()
db = MySQLDatabase(debug=is_debug)
mem.import_from_json_file('data/taipei-attractions.json')
copy_db(mem, db)

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.register_blueprint(attraction_bp(db))
app.register_blueprint(avatar_bp())
app.register_blueprint(booking_bp(db, cache))
app.register_blueprint(category_bp(db))
app.register_blueprint(member_bp(db, cache))
app.register_blueprint(order_bp(db, cache))

if __name__ == '__main__':
    app.run(debug=is_debug)
