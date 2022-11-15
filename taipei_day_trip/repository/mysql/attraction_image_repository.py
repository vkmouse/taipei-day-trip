from taipei_day_trip.core import List
from taipei_day_trip.repository.mysql.repository import MySQLRepository

class MySQLAttractionImageRepository(MySQLRepository):
    def __init__(self, cnxpool, attraction_table_name: str, debug: bool):
        self.attraction_table_name = attraction_table_name
        MySQLRepository.__init__(self, cnxpool, debug)

    @MySQLRepository.withConnection
    def add(self, attraction_id: int, urls: List[str], cnx, cursor):
        if len(urls) > 0:
            query = 'INSERT INTO {} (attraction_id, url) VALUES (%s, %s)'.format(self.tableName)
            data = list(map(lambda url: (attraction_id, url,), urls))
            cursor.executemany(query, data)
            cnx.commit()

    @MySQLRepository.withConnection
    def get_by_attraction_id(self, attraction_id: int, cnx, cursor) -> List[str]:
        query = 'SELECT url FROM {} WHERE attraction_id = %s'.format(self.tableName)
        data = (attraction_id,)
        cursor.execute(query, data)
        return list(map(lambda x: x[0], cursor.fetchall()))

    @property
    def tableName(self) -> str:
        if self.debug:
            return 'test_attraction_image'
        return 'attraction_image'

    @property
    def createTableStatement(self) -> str:
        return (
            'CREATE TABLE {attraction_image} ('
            '    attraction_id   bigint        NOT NULL,'
            '    url             varchar(255)  NOT NULL,'
            '    PRIMARY KEY (attraction_id, url),'
            '    FOREIGN KEY (attraction_id) REFERENCES {attraction} (id)'
            ');'
        ).format(attraction_image=self.tableName,
                 attraction=self.attraction_table_name)
