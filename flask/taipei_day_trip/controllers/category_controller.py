from taipei_day_trip.core import UnitOfWork

class CategoryController:
    def __init__(self, db: UnitOfWork):
        self.__db = db

    def categories(self):
        try:
            data = list(map(lambda x: x.name, self.__db.categories.get_all()))
            return { 'data': data }, 200
        except Exception as e:
            return { 'error': True, 'message': str(e) }, 500
