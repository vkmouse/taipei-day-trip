from flask import Blueprint
from flask import request
from taipei_day_trip.core import UnitOfWork

def get_attraction_api(db: UnitOfWork):
    bp = Blueprint('attraction', __name__)

    @bp.route('/api/attractions')
    def attractions():
        try:
            num_data_per_page = 12
            page = request.args.get('page')
            keyword = request.args.get('keyword')
            if page == None:
                return { 'error': True, 'message': 'Missing required parameter "page"' }, 400
            if not page.isdigit():
                return { 'error': True, 'message': '"page" parameter has error, it allow only integer number' }, 400
            page = int(page)
            start = num_data_per_page * page
            stop = num_data_per_page * (page + 1) + 1
            output = []
            if keyword == None:
                output = db.attractions.get_range(start, stop)
            else:
                output = db.attractions.search_by_category_or_name(keyword, start, stop)
            if len(output) > num_data_per_page:
                next_page = page + 1
            else:
                next_page = None
            data = []
            for attraction in output[0:num_data_per_page]:
                data.append(attraction.to_json())
            return { 'nextPage': next_page, 'data': data }, 200
        except Exception as e:
            return { 'error': True, 'message': str(e) }, 500

    @bp.route('/api/attraction/<int:id>')
    def attraction(id):
        try:
            attraction = db.attractions.get_by_id(id)
            if attraction == None:
                return { 'error': True, 'message': f'No attraction id {id}' }, 400
            return { 'data': attraction.to_json() }, 200
        except Exception as e:
            return { 'error': True, 'message': str(e) }, 500

    return bp
