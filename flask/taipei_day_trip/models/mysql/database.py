import mysql.connector

from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.booking_model import BookingModel
from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.member_model import MemberModel
from taipei_day_trip.models.mrt_model import MRTModel
from taipei_day_trip.models.order_model import OrderModel

from taipei_day_trip.models.mysql.attraction_model import MySQLAttractionModel
from taipei_day_trip.models.mysql.booking_model import MySQLBookingModel
from taipei_day_trip.models.mysql.category_model import MySQLCategoryModel
from taipei_day_trip.models.mysql.member_model import MySQLMemberModel
from taipei_day_trip.models.mysql.mrt_model import MySQLMRTModel
from taipei_day_trip.models.mysql.order_model import MySQLOrderModel

from taipei_day_trip.models.database import Database
from taipei_day_trip.utils import mysql_database
from taipei_day_trip.utils import mysql_host
from taipei_day_trip.utils import mysql_password
from taipei_day_trip.utils import mysql_user

class MySQLDatabase(Database):
    def __init__(self, debug=False):
        self.__debug = debug
        self.create_database()
        self.__cnxpool = self.create_connectpool()
        Database.__init__(self)
        self.categories.create_table()
        self.mrts.create_table()
        self.attractions.create_table()
        self.members.create_table()
        self.bookings.create_table()
        self.orders.create_table()

    def __del__(self):
        if self.__debug:
            self.orders.drop_table_if_exists()
            self.bookings.drop_table_if_exists()
            self.members.drop_table_if_exists()
            self.attractions.drop_table_if_exists()
            self.categories.drop_table_if_exists()
            self.mrts.drop_table_if_exists()

    def _create_attraction_model(self) -> AttractionModel:
        return MySQLAttractionModel(self.__cnxpool, self.categories.tablename, self.mrts.tablename, self.__debug)

    def _create_booking_model(self) -> BookingModel:
        return MySQLBookingModel(
            cnxpool=self.__cnxpool,
            member_tablename=self.members.tablename, 
            attraction_tablename=self.attractions.tablename, 
            attraction_image_tablename=self.attractions.attraction_images.tablename, 
            debug=self.__debug
        )
        
    def _create_category_model(self) -> CategoryModel:
        return MySQLCategoryModel(self.__cnxpool, self.__debug)
        
    def _create_member_model(self) -> MemberModel:
        return MySQLMemberModel(self.__cnxpool, self.__debug)

    def _create_mrt_model(self) -> MRTModel:
        return MySQLMRTModel(self.__cnxpool, self.__debug)

    def _create_order_model(self) -> OrderModel:
        return MySQLOrderModel(
            self.__cnxpool, 
            self.attractions.tablename,
            self.attractions.attraction_images.tablename,
            self.members.tablename, 
            self.bookings.tablename, 
            self.__debug)

    def is_available(self) -> bool:
        try:
            config = MySQLConfig.config_without_database()
            mysql.connector.connect(**config)
            return True
        except:
            return False

    def create_database(self):
        database = mysql_database
        config = MySQLConfig.config_without_database()
        with mysql.connector.connect(**config) as cnx:
            with cnx.cursor() as cursor:
                cursor.execute(f'CREATE DATABASE IF NOT EXISTS {database}')
                cursor.execute(f'SET GLOBAL group_concat_max_len = 10000;')

    def create_connectpool(self) -> mysql.connector.pooling.MySQLConnectionPool:
        return mysql.connector.pooling.MySQLConnectionPool(
            pool_name='taipei_day_trip', 
            pool_size=4, 
            **MySQLConfig.config()
        )

class MySQLConfig:
    @staticmethod
    def config():
        return {
            'host': mysql_host,
            'user': mysql_user,
            'password': mysql_password,
            'database': mysql_database
        }

    @staticmethod
    def config_without_database():
        return {
            'host': mysql_host,
            'user': mysql_user,
            'password': mysql_password,
        }
