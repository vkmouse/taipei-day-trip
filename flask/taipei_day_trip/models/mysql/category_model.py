from taipei_day_trip.models.category_model import CategoryModel
from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.types import Category
from taipei_day_trip.models.types import List


class MySQLCategoryModel(MySQLModel, CategoryModel):
    @MySQLModel.with_connection
    def add(self, name: str, cnx, cursor) -> bool:
        query = "INSERT IGNORE INTO {} (name) VALUES (%s)".format(self.tablename)
        data = (name,)
        cursor.execute(query, data)
        cnx.commit()
        return cursor.rowcount == 1

    @MySQLModel.with_connection
    def get_all(self, cnx, cursor) -> List[Category]:
        query = "SELECT * FROM {}".format(self.tablename)
        cursor.execute(query)
        rows = cursor.fetchall()
        output: List[Category] = []
        for row in rows:
            (
                id,
                name,
            ) = row
            output.append(Category(id, name))
        return output

    @property
    def tablename(self) -> str:
        if self.debug:
            return "test_category"
        return "category"

    @property
    def create_table_statement(self) -> str:
        return (
            "CREATE TABLE {} ("
            "    id              bigint        NOT NULL  AUTO_INCREMENT,"
            "    name            varchar(255)  NOT NULL,"
            "    PRIMARY KEY (id),"
            "    UNIQUE (name)"
            ");"
        ).format(self.tablename)
