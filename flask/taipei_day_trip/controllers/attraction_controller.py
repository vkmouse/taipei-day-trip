from taipei_day_trip.models import Database

class AttractionController:
    def __init__(self, db: Database, num_data_per_page: int):
        self.__db = db
        self.__num_data_per_page = num_data_per_page

    def attraction(self, id: int):
        return self.__get_by_id(id)

    def attractions(self, page: str | None, keyword: str | None):
        return self.__search(page, keyword)

    def __get_by_id(self, id: int):
        try:
            return self.__get_by_id_from_model(id)
        except Exception as e:
            return self.__handle_expection_error(e)

    def __search(self, page: str | None, keyword: str | None):
        try:
            if page == None:
                return self.__handle_missing_required_parameter('page')
            if not page.isdigit():
                return self.__handle_page_is_invalid()
            return self.__search_from_model(int(page), keyword)
        except Exception as e:
            return self.__handle_expection_error(e)

    def __get_by_id_from_model(self, id: int):
        attraction = self.__db.attractions.get_by_id(id)
        if attraction == None:
            return self.__handle_attraction_id_not_exists(id)
        return { 'data': attraction.to_json() }, 200

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
        return { 'nextPage': next_page, 'data': data }, 200

    def __handle_attraction_id_not_exists(self, id):
        return { 'error': True, 'message': f'No attraction id {id}' }, 400

    def __handle_missing_required_parameter(self, name):
        return { 'error': True, 'message': f'Missing required parameter {name}' }, 400

    def __handle_page_is_invalid(self):
        return { 'error': True, 'message': 'page is invalid, it allow only integer number' }, 400

    def __handle_expection_error(self, e: Exception):
        return { 'error': True, 'message': str(e) }, 500
