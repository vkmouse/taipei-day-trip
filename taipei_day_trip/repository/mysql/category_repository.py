from taipei_day_trip.core import Category
from taipei_day_trip.core import CategoryRepository
from taipei_day_trip.core import List
from taipei_day_trip.repository.mysql.repository import MySQLRepository

class MySQLCategoryRepository(MySQLRepository, CategoryRepository):
    @MySQLRepository.withConnection
    def add(self, name: str, cnx, cursor) -> bool:
        if self.__nameExists(name):
            return False
        query = 'INSERT INTO {} (name) VALUES (%s)'.format(self.tableName)
        data = (name,)
        cursor.execute(query, data)
        cnx.commit()
        return True

    @MySQLRepository.withConnection
    def get_all(self, cnx, cursor) -> List[Category]:
        query = 'SELECT * FROM {}'.format(self.tableName)
        cursor.execute(query)
        rows = cursor.fetchall()
        output: List[Category] = []
        for row in rows:
            (id, name,) = row
            output.append(Category(id, name))
        return output

    @MySQLRepository.withConnection
    def __nameExists(self, __id: int, cnx, cursor) -> bool:
        query = 'SELECT COUNT(*) FROM {} WHERE name=%s'.format(self.tableName)
        data = (__id,)
        cursor.execute(query, data)
        (count,) = cursor.fetchone()
        return count > 0

    @property
    def tableName(self) -> str:
        if self.debug:
            return 'test_category'
        return 'category'

    @property
    def createTableStatement(self) -> str:
        return (
            'CREATE TABLE {} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    name            varchar(255)  NOT NULL,'
            '    PRIMARY KEY (id)'
            ');'
        ).format(self.tableName)
