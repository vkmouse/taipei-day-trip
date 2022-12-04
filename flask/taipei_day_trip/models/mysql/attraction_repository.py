from taipei_day_trip.core import Attraction
from taipei_day_trip.core import List
from taipei_day_trip.models.attraction_model import AttractionModel
from taipei_day_trip.models.mysql.attraction_image_repository import MySQLAttractionImageRepository
from taipei_day_trip.models.mysql.repository import MySQLRepository

class MySQLAttractionRepository(MySQLRepository, AttractionModel):
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
        cursor = cnx.cursor(dictionary=True)
        query = self.get_all_attraction_images_statement('')
        cursor.execute(query)
        rows = cursor.fetchall()
        attractions: List[Attraction] = []
        for row in rows:
            attractions.append(self.__parseRow(row))
        return attractions

    @MySQLRepository.with_connection
    def get_by_id(self, id: int, cnx, cursor) -> Attraction | None:
        cursor = cnx.cursor(dictionary=True)
        query = self.get_all_attraction_images_statement(f'WHERE {self.tablename}.id = %s')
        cursor.execute(query, (id,))
        rows = cursor.fetchall()
        return self.__parseRow(rows[0])

    @MySQLRepository.with_connection
    def get_range(self, start: int, stop: int, cnx, cursor) -> List[Attraction]:
        cursor = cnx.cursor(dictionary=True)
        query = self.get_range_statement(f'LIMIT {start}, {stop - start}')
        cursor.execute(query)
        rows = cursor.fetchall()
        attractions: List[Attraction] = []
        for row in rows:
            attractions.append(self.__parseRow(row))
        return attractions

    @MySQLRepository.with_connection
    def search_by_category_or_name(self, keyword: str, start: int, stop: int, cnx, cursor) -> List[Attraction]:
        cursor = cnx.cursor(dictionary=True)
        query = self.get_range_statement(
            f' WHERE {self.tablename}.name LIKE %s OR {self.category_tablename}.name = %s '
            f' LIMIT {start}, {stop - start}'
        )
        data = (f'%{keyword}%', keyword)
        cursor.execute(query, data)
        rows = cursor.fetchall()
        attractions: List[Attraction] = []
        for row in rows:
            attractions.append(self.__parseRow(row))
        return attractions

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

    def create_table(self):
        super().create_table()
        self.attraction_images.create_table()

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

    def get_all_attraction_images_statement(self, attraction_condition):
        return (
            'SELECT'
            '    {attraction}.id,'
            '    {attraction}.name,'
            '    {attraction}.description,'
            '    {attraction}.address,'
            '    {attraction}.lat,'
            '    {attraction}.lng,'
            '    {attraction}.transport,'
            '    {category}.name AS category,'
            '    {mrt}.name AS mrt,'
            '    GROUP_CONCAT(DISTINCT {attraction_image}.url) AS images '
            'FROM {attraction} '
            'INNER JOIN {category} '
            '    ON {attraction}.category_id={category}.id '
            'LEFT JOIN {mrt} '
            '    ON {attraction}.mrt_id={mrt}.id '
            'LEFT JOIN {attraction_image} '
            '    ON {attraction_image}.attraction_id={attraction}.id '
            '{attraction_condition} '
            'GROUP BY {attraction}.id'
        ).format(attraction = self.tablename,
                 attraction_condition = attraction_condition,
                 attraction_image = self.attraction_images.tablename,
                 category = self.category_tablename,
                 mrt = self.mrt_tablename)

    def get_range_statement(self, attraction_condition):
        return (
            'SELECT '
            '    tb.id,'
            '    tb.name,'
            '    tb.description,'
            '    tb.address,'
            '    tb.lat,'
            '    tb.lng,'
            '    tb.transport,'
            '    tb.category,'
            '    tb.mrt,'
            '    GROUP_CONCAT(DISTINCT {attraction_image}.url) AS images '
            'FROM {attraction_image} '
            'INNER JOIN ('
            '    SELECT '
            '        {attraction}.id,'
            '        {attraction}.name,'
            '        {attraction}.description,'
            '        {attraction}.address,'
            '        {attraction}.lat,'
            '        {attraction}.lng,'
            '        {attraction}.transport,'
            '        {category}.name AS category,'
            '        {mrt}.name AS mrt'
            '    FROM {attraction} '
            '    INNER JOIN {category} '
            '        ON {attraction}.category_id={category}.id '
            '    LEFT JOIN {mrt} '
            '        ON {attraction}.mrt_id={mrt}.id'
            '    {attraction_condition}'
            ') tb'
            '    ON {attraction_image}.attraction_id=tb.id '
            'GROUP BY tb.id;'
        ).format(attraction = self.tablename,
                 attraction_condition = attraction_condition,
                 attraction_image = self.attraction_images.tablename,
                 category = self.category_tablename,
                 mrt=self.mrt_tablename)

    def __parseRow(self, row):
        return Attraction(id=row['id'],
                          name=row['name'],
                          description=row['description'],
                          address=row['address'],
                          lat=row['lat'],
                          lng=row['lng'],
                          transport=row['transport'],
                          category=row['category'],
                          mrt=row['mrt'],
                          images=row['images'].split(','))
