from flask import Blueprint
from taipei_day_trip.core import UnitOfWork

def get_attraction_api(db: UnitOfWork):
    bp = Blueprint('attraction', __name__)

    @bp.route('/api/attraction/<int:id>')
    def attraction(id):
        try:
            attraction = db.attractions.get_by_id(id)
            if attraction == None:
                return { 'error': True, 'message': f'No attraction id {id}' }, 400
            data = {
                'id': attraction.id,
                'name': attraction.name,
                'category': attraction.category,
                'description': attraction.description,
                'address': attraction.address,
                'transport': attraction.transport,
                'mrt': attraction.mrt,
                'lat': attraction.lat,
                'lng': attraction.lng,
                'images': attraction.images,
            }
            return { 'data': data }, 200
        except Exception as e:
            return { 'error': True, 'message': str(e) }, 500

    return bp
