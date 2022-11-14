from taipei_day_trip.core.repositories import CategoryRepository
from taipei_day_trip.core.repositories import MRTRepository

class UnitOfWork:
    def __init__(self):
        self.__categories = self._create_category_repository()
        self.__mrts = self._create_mrt_repository()

    @property
    def categories(self) -> CategoryRepository:
        return self.__categories

    @property
    def mrts(self) -> CategoryRepository:
        return self.__mrts

    def _create_category_repository(self) -> CategoryRepository:
        return NotImplemented

    def _create_mrt_repository(self) -> MRTRepository:
        return NotImplemented
