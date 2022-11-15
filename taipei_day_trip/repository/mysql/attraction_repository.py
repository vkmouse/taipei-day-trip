from taipei_day_trip.core import Attraction
from taipei_day_trip.core import AttractionRepository
from taipei_day_trip.core import List
from taipei_day_trip.repository.mysql.repository import MySQLRepository

class MySQLAttractionRepository(MySQLRepository, AttractionRepository):
    def __init__(self, cnxpool, categoryTableName: str, mrtTableName: str, debug: bool):
        self.categoryTableName = categoryTableName
        self.mrtTableName = mrtTableName
        MySQLRepository.__init__(self, cnxpool, debug)

    @MySQLRepository.withConnection
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
        query = (
            'INSERT INTO {attraction} (name, description, address, lat, lng, transport, category_id, mrt_id)'
            'VALUES (%s, %s, %s, %s, %s, %s,'
            '    (SELECT id FROM {category} WHERE name = %s),'
            '    (SELECT id FROM {mrt} WHERE name = %s));'
        ).format(attraction=self.tableName,
                 category=self.categoryTableName,
                 mrt=self.mrtTableName)
        data = (name, description, address, lat, lng, transport, category, mrt,)
        cursor.execute(query, data)
        cnx.commit()
        return True

    @MySQLRepository.withConnection
    def get_all(self, cnx, cursor) -> List[Attraction]:
        query = (
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
            'INNER JOIN {mrt} '
            '    ON {attraction}.category_id={mrt}.id'
        ).format(attraction=self.tableName,
                 category=self.categoryTableName,
                 mrt=self.mrtTableName)
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
                                    images=[])
            output.append(attraction)
        return output

    @property
    def tableName(self) -> str:
        if self.debug:
            return 'test_attraction'
        return 'attraction'

    @property
    def createTableStatement(self) -> str:
        return (
            'CREATE TABLE {attraction} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    name            varchar(255)  NOT NULL,'
            '    description     varchar(1024) NOT NULL,'
            '    address         varchar(255)  NOT NULL,'
            '    lat             float         NOT NULL,'
            '    lng             float         NOT NULL,'
            '    transport       varchar(1024) NOT NULL,'
            '    category_id     bigint        NOT NULL,'
            '    mrt_id          bigint        NOT NULL,'
            '    PRIMARY KEY (id),'
            '    FOREIGN KEY (category_id) REFERENCES {category} (id),'
            '    FOREIGN KEY (mrt_id) REFERENCES {mrt} (id)'
            ');'
        ).format(attraction=self.tableName,
                 category=self.categoryTableName,
                 mrt=self.mrtTableName)
