import dotenv
import mysql.connector
import os

from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.mrt_model import MRTModel
from taipei_day_trip.models.mysql.attraction_model import MySQLAttractionModel
from taipei_day_trip.models.mysql.category_model import MySQLCategoryModel
from taipei_day_trip.models.mysql.mrt_model import MySQLMRTModel
from taipei_day_trip.models.database import Database

class MySQLDatabase(Database):
    def __init__(self, debug=False, load_dotenv=True):
        self.__debug = debug
        if load_dotenv:
            dotenv.load_dotenv()
        self.create_database()
        self.__cnxpool = self.create_connectpool()
        Database.__init__(self)
        self.categories.create_table()
        self.mrts.create_table()
        self.attractions.create_table()

    def __del__(self):
        if self.__debug:
            self.attractions.drop_table_if_exists()
            self.categories.drop_table_if_exists()
            self.mrts.drop_table_if_exists()

    def _create_attraction_model(self) -> AttractionModel:
        return MySQLAttractionModel(self.__cnxpool, self.categories.tablename, self.mrts.tablename, self.__debug)

    def _create_category_model(self) -> CategoryModel:
        return MySQLCategoryModel(self.__cnxpool, self.__debug)

    def _create_mrt_model(self) -> MRTModel:
        return MySQLMRTModel(self.__cnxpool, self.__debug)

    def is_available(self) -> bool:
        try:
            config = MySQLConfig.config_without_database()
            mysql.connector.connect(**config)
            return True
        except:
            return False

    def create_database(self):
        database = MySQLConfig.database()
        config = MySQLConfig.config_without_database()
        with mysql.connector.connect(**config) as cnx:
            with cnx.cursor() as cursor:
                cursor.execute(f'CREATE DATABASE IF NOT EXISTS {database}')

    def create_connectpool(self) -> mysql.connector.pooling.MySQLConnectionPool:
        return mysql.connector.pooling.MySQLConnectionPool(
            pool_name='taipei_day_trip', 
            pool_size=4, 
            **MySQLConfig.config()
        )

class MySQLConfig:
    @staticmethod
    def host():
        return os.getenv('MYSQL_HOST')

    @staticmethod
    def user():
        return os.getenv('MYSQL_USER')

    @staticmethod
    def password():
        return os.getenv('MYSQL_PASSWORD')

    @staticmethod
    def database():
        return os.getenv('MYSQL_DATABASE')

    @staticmethod
    def config():
        return {
            'host': MySQLConfig.host(),
            'user': MySQLConfig.user(),
            'password': MySQLConfig.password(),
            'database': MySQLConfig.database()
        }

    @staticmethod
    def config_without_database():
        return {
            'host': MySQLConfig.host(),
            'user': MySQLConfig.user(),
            'password': MySQLConfig.password(),
        }
