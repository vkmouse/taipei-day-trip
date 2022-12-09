from taipei_day_trip.models import Attraction
from taipei_day_trip.models import Database

class AttractionController:
    def __init__(self, db: Database, num_data_per_page: int):
        self.__db = db
        self.__num_data_per_page = num_data_per_page
        self.view = AttractionView()

    def attraction(self, id: int):
        try:
            attraction = self.__db.attractions.get_by_id(id)
            if attraction == None:
                return self.view.render_attraction_id_not_exists(id)
            return self.view.render_attraction_success(attraction)
        except Exception as e:
            return self.view.render_expection_error(e)

    def attractions(self, page: str | None, keyword: str | None):
        try:
            if page == None:
                return self.view.render_missing_required_parameter('page')
            if not page.isdigit():
                return self.view.render_page_is_invalid()
            return self.__search_from_model(int(page), keyword)
        except Exception as e:
            return self.view.render_expection_error(e)

    def __search_from_model(self, page: int, keyword: str | None):
        start = self.__num_data_per_page * page
        stop = self.__num_data_per_page * (page + 1) + 1
        output = []
        if keyword == None:
            output = self.__db.attractions.get_range(start, stop)
        else:
            output = self.__db.attractions.search_by_category_or_name(keyword, start, stop)
        if len(output) > self.__num_data_per_page:
            next_page = page + 1
        else:
            next_page = None
        data = list(map(lambda x: x.to_json(), output[0:self.__num_data_per_page]))
        return self.view.render_search_from_model_success(next_page, data)

class AttractionView:
    def render_search_from_model_success(self, next_page, data):
        return { 'nextPage': next_page, 'data': data }, 200

    def render_attraction_success(self, attraction: Attraction):
        return { 'data': attraction.to_json() }, 200

    def render_attraction_id_not_exists(self, id):
        return { 'error': True, 'message': f'No attraction id {id}' }, 400

    def render_missing_required_parameter(self, name):
        return { 'error': True, 'message': f'Missing required parameter {name}' }, 400

    def render_page_is_invalid(self):
        return { 'error': True, 'message': 'page is invalid, it allow only integer number' }, 400

    def render_expection_error(self, e: Exception):
        return { 'error': True, 'message': str(e) }, 500
