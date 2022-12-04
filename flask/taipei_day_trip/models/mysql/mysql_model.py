import mysql.connector
import logging

class MySQLModel:
    def with_connection(func):
        def wrap(self, *args, **kwargs):
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor()
            output = False
            try:
                output = func(self, *args, **kwargs, cnx=cnx, cursor=cursor)
            except mysql.connector.Error as err:
                logging.error('Something went wrong: {}'.format(err))
            finally:
                cursor.close()
                cnx.close()
            return output
        return wrap

    def __init__(self, cnxpool: mysql.connector.pooling.MySQLConnectionPool, debug: bool):
        self.debug = debug
        self.cnxpool = cnxpool

    @with_connection
    def create_table(self, cnx, cursor):
        if not self.table_exists():
            cursor.execute(self.create_table_statement)

    @with_connection
    def drop_table_if_exists(self, cnx, cursor):
        if self.table_exists():
            cursor.execute(self.drop_table_statement)

    @with_connection
    def table_exists(self, cnx, cursor) -> bool:
        cursor.execute('SHOW TABLES;')
        isExists = (self.tablename,) in cursor.fetchall()
        return isExists

    @property
    def tablename(self) -> str:
        return NotImplemented

    @property
    def create_table_statement(self) -> str:
        return NotImplemented

    @property
    def drop_table_statement(self) -> str:
        return 'DROP TABLE {};'.format(self.tablename)
