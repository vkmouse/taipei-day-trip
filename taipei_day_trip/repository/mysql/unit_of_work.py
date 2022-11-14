import json
import mysql.connector

from taipei_day_trip.core import CategoryRepository
from taipei_day_trip.core import UnitOfWork
from taipei_day_trip.repository.mysql.category_repository import MySQLCategoryRepository

class MySQLUnitOfWork(UnitOfWork):
    def __init__(self, configPath: str, debug=False):
        config = self.loadConfig(configPath)
        self.initDb(config)
        self.__debug = debug
        self.__cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name='taipei_day_trip', pool_size=4, **config)
        UnitOfWork.__init__(self)

    def __del__(self):
        if self.__debug:
            self.categories.dropTableIfExists()

    def _create_category_repository(self) -> CategoryRepository:
        return MySQLCategoryRepository(self.__cnxpool, self.__debug)

    @staticmethod
    def isAvailable(configPath: str) -> bool:
        try:
            config = MySQLUnitOfWork.loadConfig(configPath)
            config['database'] = None
            mysql.connector.connect(**config)
            return True
        except:
            return False

    @staticmethod
    def loadConfig(configPath: str):
        with open(configPath) as file:
            return json.load(file)

    @staticmethod
    def initDb(config):
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
