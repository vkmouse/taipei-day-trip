from flask import Blueprint

from taipei_day_trip.controllers import AttractionController
from taipei_day_trip.models import Database

def attraction_bp(db: Database):
    controller = AttractionController(db, num_data_per_page=12)
    bp = Blueprint('attraction', __name__)
    bp.route('/api/attractions')(controller.attractions)
    bp.route('/api/attraction/<int:id>')(controller.attraction)
    return bp
