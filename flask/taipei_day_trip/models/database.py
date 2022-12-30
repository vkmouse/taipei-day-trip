from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.booking_model import BookingModel
from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.member_model import MemberModel
from taipei_day_trip.models.mrt_model import MRTModel
from taipei_day_trip.models.order_model import OrderModel


class Database:
    def __init__(self):
        self.__categories = self._create_category_model()
        self.__mrts = self._create_mrt_model()
        self.__attractions = self._create_attraction_model()
        self.__members = self._create_member_model()
        self.__bookings = self._create_booking_model()
        self.__orders = self._create_order_model()

    @property
    def attractions(self) -> AttractionModel:
        return self.__attractions

    @property
    def bookings(self) -> BookingModel:
        return self.__bookings

    @property
    def categories(self) -> CategoryModel:
        return self.__categories

    @property
    def members(self) -> MemberModel:
        return self.__members

    @property
    def mrts(self) -> MRTModel:
        return self.__mrts

    @property
    def orders(self) -> OrderModel:
        return self.__orders

    def _create_attraction_model(self) -> AttractionModel:
        return NotImplemented

    def _create_booking_model(self) -> BookingModel:
        return NotImplemented

    def _create_category_model(self) -> CategoryModel:
        return NotImplemented

    def _create_member_model(self) -> MemberModel:
        return NotImplemented

    def _create_mrt_model(self) -> MRTModel:
        return NotImplemented

    def _create_order_model(self) -> OrderModel:
        return NotImplemented


def copy_db(src: Database, dst: Database):
    copy_categories(src, dst)
    copy_mrt(src, dst)
    copy_attractions(src, dst)


def copy_attractions(src: Database, dst: Database):
    values = dst.attractions.get_all()
    for value in src.attractions.get_all():
        is_existed = len(list(filter(lambda x: x.name == value.name, values))) > 0
        if not is_existed:
            dst.attractions.add(
                name=value.name,
                description=value.description,
                address=value.address,
                lat=value.lat,
                lng=value.lng,
                transport=value.transport,
                images=value.images,
                category=value.category,
                mrt=value.mrt,
            )


def copy_categories(src: Database, dst: Database):
    values = dst.categories.get_all()
    for value in src.categories.get_all():
        is_existed = len(list(filter(lambda x: x.name == value.name, values))) > 0
        if not is_existed:
            dst.categories.add(value.name)


def copy_mrt(src: Database, dst: Database):
    values = dst.mrts.get_all()
    for value in src.mrts.get_all():
        is_existed = len(list(filter(lambda x: x.name == value.name, values))) > 0
        if not is_existed:
            dst.mrts.add(value.name)
