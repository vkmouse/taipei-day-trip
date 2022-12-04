from flask import *
from taipei_day_trip.core import copy_db
from taipei_day_trip.repository import MemoryUnitOfWork
from taipei_day_trip.repository import MySQLUnitOfWork
from taipei_day_trip.routes import attraction_bp
from taipei_day_trip.routes import category_bp

mem = MemoryUnitOfWork()
db = MySQLUnitOfWork()
mem.import_from_json_file('data/taipei-attractions.json')
copy_db(mem, db)

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.register_blueprint(attraction_bp(db))
app.register_blueprint(category_bp(db))

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=3000)
