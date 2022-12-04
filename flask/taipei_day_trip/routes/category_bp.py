from flask import Blueprint
from taipei_day_trip.controllers import CategoryController
from taipei_day_trip.core import UnitOfWork

def category_bp(db: UnitOfWork):
    bp = Blueprint('category', __name__)
    controller = CategoryController(db)
    bp.route('/api/categories')(controller.categories)
    return bp
