from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.types import Category
from taipei_day_trip.models.types import List

class MySQLCategoryModel(MySQLModel, CategoryModel):
    @MySQLModel.with_connection
    def add(self, name: str, cnx, cursor) -> bool:
        if self.__name_exists(name):
            return False
        query = 'INSERT INTO {} (name) VALUES (%s)'.format(self.tablename)
        data = (name,)
        cursor.execute(query, data)
        cnx.commit()
        return True

    @MySQLModel.with_connection
    def get_all(self, cnx, cursor) -> List[Category]:
        query = 'SELECT * FROM {}'.format(self.tablename)
        cursor.execute(query)
        rows = cursor.fetchall()
        output: List[Category] = []
        for row in rows:
            (id, name,) = row
            output.append(Category(id, name))
        return output

    @MySQLModel.with_connection
    def __name_exists(self, __name: str, cnx, cursor) -> bool:
        query = 'SELECT COUNT(*) FROM {} WHERE name=%s'.format(self.tablename)
        data = (__name,)
        cursor.execute(query, data)
        (count,) = cursor.fetchone()
        return count > 0

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_category'
        return 'category'

    @property
    def create_table_statement(self) -> str:
        return (
            'CREATE TABLE {} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    name            varchar(255)  NOT NULL,'
            '    PRIMARY KEY (id)'
            ');'
        ).format(self.tablename)
