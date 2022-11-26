from taipei_day_trip.core import MRT
from taipei_day_trip.core import MRTRepository
from taipei_day_trip.core import List
from taipei_day_trip.repository.mysql.repository import MySQLRepository

class MySQLMRTRepository(MySQLRepository, MRTRepository):
    @MySQLRepository.with_connection
    def add(self, name: str, cnx, cursor) -> bool:
        if name == None or self.__nameExists(name):
            return False
        query = 'INSERT INTO {} (name) VALUES (%s)'.format(self.tablename)
        data = (name,)
        cursor.execute(query, data)
        cnx.commit()
        return True

    @MySQLRepository.with_connection
    def get_all(self, cnx, cursor) -> List[MRT]:
        query = 'SELECT * FROM {}'.format(self.tablename)
        cursor.execute(query)
        rows = cursor.fetchall()
        output: List[MRT] = []
        for row in rows:
            (id, name,) = row
            output.append(MRT(id, name))
        return output

    @MySQLRepository.with_connection
    def __nameExists(self, __id: int, cnx, cursor) -> bool:
        query = 'SELECT COUNT(*) FROM {} WHERE name=%s'.format(self.tablename)
        data = (__id,)
        cursor.execute(query, data)
        (count,) = cursor.fetchone()
        return count > 0

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_mrt'
        return 'mrt'

    @property
    def create_table_statement(self) -> str:
        return (
            'CREATE TABLE {} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    name            varchar(255)  NOT NULL,'
            '    PRIMARY KEY (id)'
            ');'
        ).format(self.tablename)
