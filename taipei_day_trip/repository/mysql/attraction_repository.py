from taipei_day_trip.core import Attraction
from taipei_day_trip.core import AttractionRepository
from taipei_day_trip.core import List
from taipei_day_trip.repository.mysql.attraction_image_repository import MySQLAttractionImageRepository
from taipei_day_trip.repository.mysql.repository import MySQLRepository

class MySQLAttractionRepository(MySQLRepository, AttractionRepository):
    def __init__(self, cnxpool, category_tablename: str, mrt_tablename: str, debug: bool):
        self.category_tablename = category_tablename
        self.mrt_tablename = mrt_tablename
        MySQLRepository.__init__(self, cnxpool, debug)
        self.attraction_images = MySQLAttractionImageRepository(cnxpool, self.tablename, debug)

    @MySQLRepository.with_connection
    def add(self, 
            name: str, 
            description: str, 
            address: str, 
            lat: float, 
            lng: float, 
            transport: str, 
            images: List[str], 
            category: str, 
            mrt: str, cnx, cursor) -> bool:
        (query, data) = self.add_operation(name, description, address, lat, lng, transport, category, mrt)
        cursor.execute(query, data)
        cnx.commit()
        cursor.execute('SELECT LAST_INSERT_ID();')
        (id,) = cursor.fetchone()
        self.attraction_images.add(id, images)
        return True

    @MySQLRepository.with_connection
    def get_all(self, cnx, cursor) -> List[Attraction]:
        query = self.get_all_statement()
        cursor.execute(query)
        rows = cursor.fetchall()
        output: List[Attraction] = []
        for row in rows:
            (id, name, description, address, lat, lng, transport, category, mrt,) = row
            attraction = Attraction(id=id,
                                    name=name,
                                    description=description,
                                    address=address,
                                    lat=lat,
                                    lng=lng,
                                    transport=transport,
                                    category=category,
                                    mrt=mrt,
                                    images=self.attraction_images.get_by_attraction_id(id))
            output.append(attraction)
        return output

    @MySQLRepository.with_connection
    def get_by_id(self, id: int, cnx, cursor) -> Attraction | None:
        query = self.get_all_statement() + (
            ' WHERE {}.id = %s '
            ' LIMIT 1;'
        ).format(self.tablename)
        cursor.execute(query, (id,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        (id, name, description, address, lat, lng, transport, category, mrt,) = rows[0]
        return Attraction(id=id,
                          name=name,
                          description=description,
                          address=address,
                          lat=lat,
                          lng=lng,
                          transport=transport,
                          category=category,
                          mrt=mrt,
                          images=self.attraction_images.get_by_attraction_id(id))

    @MySQLRepository.with_connection
    def get_range(self, start: int, stop: int, cnx, cursor) -> List[Attraction]:
        query = self.get_all_statement() + (
            ' LIMIT {offset}, {count};'
        ).format(offset=start, count=stop - start)
        cursor.execute(query)
        rows = cursor.fetchall()
        output = []
        for row in rows:
            (id, name, description, address, lat, lng, transport, category, mrt,) = row
            output.append(Attraction(id=id,
                                     name=name,
                                     description=description,
                                     address=address,
                                     lat=lat,
                                     lng=lng,
                                     transport=transport,
                                     category=category,
                                     mrt=mrt,
                                     images=self.attraction_images.get_by_attraction_id(id)))
        return output

    @MySQLRepository.with_connection
    def search_by_category_or_name(self, keyword: str, start: int, stop: int, cnx, cursor) -> List[Attraction]:
        query = self.get_all_statement() + (
            " WHERE {attraction}.name LIKE %s OR {category}.name = %s "
            ' LIMIT {offset}, {count};'
        ).format(attraction=self.tablename,
                 category=self.category_tablename,
                 count=stop - start,
                 offset=start)
        data = (f'%{keyword}%', keyword)
        cursor.execute(query, data)
        rows = cursor.fetchall()
        output = []
        for row in rows:
            (id, name, description, address, lat, lng, transport, category, mrt,) = row
            output.append(Attraction(id=id,
                                     name=name,
                                     description=description,
                                     address=address,
                                     lat=lat,
                                     lng=lng,
                                     transport=transport,
                                     category=category,
                                     mrt=mrt,
                                     images=self.attraction_images.get_by_attraction_id(id)))
        return output

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_attraction'
        return 'attraction'

    @property
    def create_table_statement(self) -> str:
        return (
            'CREATE TABLE {attraction} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    name            varchar(255)  NOT NULL,'
            '    description     varchar(2048) NOT NULL,'
            '    address         varchar(255)  NOT NULL,'
            '    lat             float         NOT NULL,'
            '    lng             float         NOT NULL,'
            '    transport       varchar(1024) NOT NULL,'
            '    category_id     bigint        NOT NULL,'
            '    mrt_id          bigint,'
            '    PRIMARY KEY (id),'
            '    FOREIGN KEY (category_id) REFERENCES {category} (id),'
            '    FOREIGN KEY (mrt_id) REFERENCES {mrt} (id)'
            ');'
        ).format(attraction=self.tablename,
                 category=self.category_tablename,
                 mrt=self.mrt_tablename)

    def drop_table_if_exists(self):
        self.attraction_images.drop_table_if_exists()
        super().drop_table_if_exists()

    def add_operation(self,
                      name: str,
                      description: str,
                      address: str,
                      lat: float,
                      lng: float,
                      transport: str,
                      category: str,
                      mrt: str):
        query = (
            'INSERT INTO {attraction} (name, description, address, lat, lng, transport, category_id, mrt_id)'
            'VALUES (%s, %s, %s, %s, %s, %s,'
            '    (SELECT id FROM {category} WHERE name = %s),'
            '    (SELECT id FROM {mrt} WHERE name = %s));'
        ).format(attraction=self.tablename,
                 category=self.category_tablename,
                 mrt=self.mrt_tablename)
        data = (name, description, address, lat, lng, transport, category, mrt,)
        if mrt == None:
            query = (
                'INSERT INTO {attraction} (name, description, address, lat, lng, transport, category_id, mrt_id)'
                'VALUES (%s, %s, %s, %s, %s, %s, (SELECT id FROM {category} WHERE name = %s), null);'
            ).format(attraction=self.tablename,
                     category=self.category_tablename)
            data = (name, description, address, lat, lng, transport, category,)
        return (query, data)

    def get_all_statement(self):
        return (
            'SELECT'
            '    {attraction}.id,'
            '    {attraction}.name,'
            '    {attraction}.description,'
            '    {attraction}.address,' 
            '    {attraction}.lat,' 
            '    {attraction}.lng,' 
            '    {attraction}.transport,' 
            '    {category}.name,' 
            '    {mrt}.name '
            'FROM {attraction} '
            'INNER JOIN {category} '
            '    ON {attraction}.category_id={category}.id '
            'LEFT JOIN {mrt} '
            '    ON {attraction}.mrt_id={mrt}.id'
        ).format(attraction=self.tablename,
                 category=self.category_tablename,
                 mrt=self.mrt_tablename)