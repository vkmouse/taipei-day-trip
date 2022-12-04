from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.mrt_model import MRTModel

class UnitOfWork:
    def __init__(self):
        self.__categories = self._create_category_repository()
        self.__mrts = self._create_mrt_repository()
        self.__attractions = self._create_attraction_repository()

    @property
    def attractions(self) -> AttractionModel:
        return self.__attractions

    @property
    def categories(self) -> CategoryModel:
        return self.__categories

    @property
    def mrts(self) -> MRTModel:
        return self.__mrts

    def _create_attraction_repository(self) -> AttractionModel:
        return NotImplemented

    def _create_category_repository(self) -> CategoryModel:
        return NotImplemented

    def _create_mrt_repository(self) -> MRTModel:
        return NotImplemented

def copy_db(src: UnitOfWork, dst: UnitOfWork):
    copy_categories(src, dst)
    copy_mrt(src, dst)
    copy_attractions(src, dst)

def copy_attractions(src: UnitOfWork, dst: UnitOfWork):
    values = dst.attractions.get_all()
    for value in src.attractions.get_all():
        is_existed = len(list(filter(lambda x: x.name == value.name, values))) > 0
        if not is_existed:
            dst.attractions.add(name=value.name,
                                description=value.description,
                                address=value.address,
                                lat=value.lat,
                                lng=value.lng,
                                transport=value.transport,
                                images=value.images,
                                category=value.category,
                                mrt=value.mrt)

def copy_categories(src: UnitOfWork, dst: UnitOfWork):
    values = dst.categories.get_all()
    for value in src.categories.get_all():
        is_existed = len(list(filter(lambda x: x.name == value.name, values))) > 0
        if not is_existed:
            dst.categories.add(value.name)

def copy_mrt(src: UnitOfWork, dst: UnitOfWork):
    values = dst.mrts.get_all()
    for value in src.mrts.get_all():
        is_existed = len(list(filter(lambda x: x.name == value.name, values))) > 0
        if not is_existed:
            dst.mrts.add(value.name)
