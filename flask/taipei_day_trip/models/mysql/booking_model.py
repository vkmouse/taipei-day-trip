from datetime import datetime
from taipei_day_trip.models.booking_model import BookingModel
from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.types import Booking
from taipei_day_trip.models.types import List

class MySQLBookingModel(MySQLModel, BookingModel):
    def __init__(self, cnxpool, member_tablename: str, attraction_tablename: str, debug: bool):
        self.member_tablename = member_tablename
        self.attraction_tablename = attraction_tablename
        MySQLModel.__init__(self, cnxpool, debug)

    @MySQLModel.with_connection
    def add(self, memberId: int, attractionId: int, starttime: datetime, endtime: datetime, price: int, cnx, cursor) -> bool:
        query = (
            'INSERT INTO {booking} ('
            '    member_id, '
            '    attraction_id, '
            '    starttime, '
            '    endtime, '
            '    price) '
            'SELECT %s, %s, %s, %s, %s '
            'FROM dual '
            'WHERE NOT EXISTS (SELECT * FROM {booking} WHERE NOT (endtime <= %s OR %s <= starttime))'
        ).format(booking=self.tablename)
        data = (memberId, attractionId, starttime, endtime, price, starttime, endtime)
        cursor.execute(query, data)
        cnx.commit()
        return cursor.rowcount == 1
        
    @MySQLModel.with_connection
    def get_by_memberId(self, memberId: int, cnx, cursor) -> List[Booking]:
        cursor = cnx.cursor(dictionary=True)
        query = 'SELECT * FROM {} WHERE member_id = %s'.format(self.tablename)
        cursor.execute(query, (memberId,))
        rows = cursor.fetchall()
        return list(map(lambda row: Booking(
            id=row['id'],
            memberId=row['member_id'],
            attractionId=row['attraction_id'],
            starttime=row['starttime'],
            endtime=row['endtime'],
            price=row['price'],
        ), rows))

    @MySQLModel.with_connection
    def remove_by_id(self, id: int, cnx, cursor):
        query = 'DELETE FROM {} WHERE id = (%s)'.format(self.tablename)
        cursor.execute(query, (id,))
        cnx.commit()

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_booking'
        return 'booking'

    @property
    def create_table_statement(self) -> str:
        return (
            'CREATE TABLE {booking} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    member_id       bigint        NOT NULL,'
            '    attraction_id   bigint        NOT NULL,'
            '    starttime       DATETIME      NOT NULL,'
            '    endtime         DATETIME      NOT NULL,'
            '    price           int           NOT NULL,'
            '    PRIMARY KEY (id),'
            '    FOREIGN KEY (member_id) REFERENCES {member} (id),'
            '    FOREIGN KEY (attraction_id) REFERENCES {attraction} (id)'
            ');'
        ).format(booking=self.tablename,
                 member=self.member_tablename,
                 attraction=self.attraction_tablename)
