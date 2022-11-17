from flask import Blueprint

from taipei_day_trip.core import UnitOfWork

def get_category_api(db: UnitOfWork):
    bp = Blueprint('category', __name__)
    
    @bp.route('/api/categories')
    def categories():
        try:
            data = list(map(lambda x: x.name, db.categories.get_all()))
            return { 'data': data }, 200
        except Exception as e:
            return { 'error': True, 'message': str(e) }, 500

    return bp
