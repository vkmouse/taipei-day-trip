from taipei_day_trip.core.repositories import CategoryRepository

class UnitOfWork:
    def __init__(self):
        self.__categories = self._create_category_repository()

    @property
    def categories(self) -> CategoryRepository:
        return self.__categories

    def _create_category_repository(self) -> CategoryRepository:
        return NotImplemented
