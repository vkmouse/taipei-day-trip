from flask import Blueprint

from taipei_day_trip.controllers import CategoryController
from taipei_day_trip.models import Database


def category_bp(db: Database):
    controller = CategoryController(db)
    bp = Blueprint("category", __name__)

    @bp.route("/api/categories")
    def categories():
        return controller.categories()

    return bp
