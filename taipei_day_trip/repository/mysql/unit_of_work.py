import json
import mysql.connector

from taipei_day_trip.core import AttractionRepository
from taipei_day_trip.core import CategoryRepository
from taipei_day_trip.core import MRTRepository
from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository.mysql.attraction_repository import MySQLAttractionRepository
from taipei_day_trip.repository.mysql.category_repository import MySQLCategoryRepository
from taipei_day_trip.repository.mysql.mrt_repository import MySQLMRTRepository

class MySQLUnitOfWork(UnitOfWork):
    def __init__(self, configPath: str, debug=False):
        config = self.load_config(configPath)
        self.init_db(config)
        self.__debug = debug
        self.__cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name='taipei_day_trip', pool_size=4, **config)
        UnitOfWork.__init__(self)

    def __del__(self):
        if self.__debug:
            self.attractions.drop_table_if_exists()
            self.categories.drop_table_if_exists()
            self.mrts.drop_table_if_exists()

    def _create_attraction_repository(self) -> AttractionRepository:
        return MySQLAttractionRepository(self.__cnxpool, self.categories.tablename, self.mrts.tablename, self.__debug)

    def _create_category_repository(self) -> CategoryRepository:
        return MySQLCategoryRepository(self.__cnxpool, self.__debug)

    def _create_mrt_repository(self) -> MRTRepository:
        return MySQLMRTRepository(self.__cnxpool, self.__debug)

    @staticmethod
    def is_available(configPath: str) -> bool:
        try:
            config = MySQLUnitOfWork.load_config(configPath)
            config['database'] = None
            mysql.connector.connect(**config)
            return True
        except:
            return False

    @staticmethod
    def load_config(configPath: str):
        with open(configPath) as file:
            return json.load(file)

    @staticmethod
    def init_db(config):
        database = config['database']
        config['database'] = None
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        cursor.execute('SHOW DATABASES;')
        if not (database,) in cursor.fetchall():
            cursor.execute('CREATE DATABASE ' + database)
        cursor.close()
        cnx.close()
        config['database'] = database
