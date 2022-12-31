from flask import Blueprint
from flask import request

from taipei_day_trip.controllers import AttractionController
from taipei_day_trip.models import Database


def attraction_bp(db: Database):
    controller = AttractionController(db, num_data_per_page=12)
    bp = Blueprint("attraction", __name__)

    @bp.route("/api/attractions")
    def attractions():
        return controller.attractions(request.args.get("page"), request.args.get("keyword"))

    @bp.route("/api/attraction/<int:id>")
    def attraction(id: int):
        return controller.attraction(id)

    return bp
