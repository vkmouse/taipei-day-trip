from taipei_day_trip.controllers.base import BaseView
from taipei_day_trip.models import Database


class CategoryController:
    def __init__(self, db: Database):
        self.__db = db
        self.view = BaseView()

    def categories(self):
        try:
            data = list(map(lambda x: x.name, self.__db.categories.get_all()))
            return {"data": data}, 200
        except Exception as e:
            return self.view.render_unexpected(e)
