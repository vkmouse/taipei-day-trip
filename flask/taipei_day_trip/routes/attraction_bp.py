from flask import Blueprint

from taipei_day_trip.controllers import AttractionController
from taipei_day_trip.core import UnitOfWork

def attraction_bp(db: UnitOfWork):
    bp = Blueprint('attraction', __name__)
    controller = AttractionController(db, num_data_per_page=12)
    bp.route('/api/attractions')(controller.attractions)
    bp.route('/api/attraction/<int:id>')(controller.attraction)
    return bp
