from datetime import datetime
from taipei_day_trip.models.booking_model import BookingModel
from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.types import Attraction
from taipei_day_trip.models.types import Booking
from taipei_day_trip.models.types import List

class MySQLBookingModel(MySQLModel, BookingModel):
    def __init__(self, cnxpool, member_tablename: str, attraction_tablename: str, attraction_image_tablename: str, debug: bool):
        self.member_tablename = member_tablename
        self.attraction_tablename = attraction_tablename
        self.attraction_image_tablename = attraction_image_tablename
        MySQLModel.__init__(self, cnxpool, debug)

    @MySQLModel.with_connection
    def add(self, member_id: int, attraction_id: int, starttime: datetime, endtime: datetime, price: int, cnx, cursor) -> bool:
        query = (
            'INSERT INTO {booking} ('
            '    member_id, '
            '    attraction_id, '
            '    starttime, '
            '    endtime, '
            '    price) '
            'SELECT %s, %s, %s, %s, %s '
            'FROM dual '
            'WHERE NOT EXISTS ('
            '    SELECT * '
            '    FROM {booking} '
            '    WHERE member_id = %s AND NOT (endtime <= %s OR %s <= starttime)'
            ')'
        ).format(booking=self.tablename)
        data = (member_id, attraction_id, starttime, endtime, price, member_id, starttime, endtime)
        cursor.execute(query, data)
        cnx.commit()
        return cursor.rowcount == 1
        
    @MySQLModel.with_connection
    def get_unpaid_by_member(self, member_id: int, cnx, cursor) -> List[Booking]:
        cursor = cnx.cursor(dictionary=True)
        query = (
            'SELECT'
            '    {booking}.id,'
            '    {booking}.member_id, '
            '    {booking}.starttime, '
            '    {booking}.endtime, '
            '    {booking}.price, '
            '    {booking}.has_paid, '
            '    tb.id AS attraction_id, '
            '    tb.name AS attraction_name, '
            '    tb.address AS attraction_address, '
            '    tb.images AS attraction_images '
            'FROM {booking} '
            'INNER JOIN ('
            '    SELECT '
            '        {attraction}.id AS id, '
            '        {attraction}.name AS name, '
            '        {attraction}.address AS address, '
            '        GROUP_CONCAT(DISTINCT {attraction_image}.url) AS images '
            '    FROM {attraction_image} '
            '    INNER JOIN {attraction} '
            '        ON {attraction_image}.attraction_id={attraction}.id '
            '    GROUP BY {attraction}.id'
            ') tb'
            '    ON {booking}.attraction_id=tb.id '
            'WHERE member_id = %s AND has_paid = FALSE'
        ).format(
            booking=self.tablename,
            attraction=self.attraction_tablename,
            attraction_image=self.attraction_image_tablename)
        cursor.execute(query, (member_id,))
        rows = cursor.fetchall()
        return list(map(lambda row: Booking(
            id=row['id'],
            member_id=row['member_id'],
            starttime=row['starttime'],
            endtime=row['endtime'],
            price=row['price'],
            has_paid=row['has_paid'],
            attraction=Attraction(
                id=row['attraction_id'],
                name=row['attraction_name'],
                address=row['attraction_address'],
                images=row['attraction_images'].split(','),
                description='',
                lat=0,
                lng=0,
                transport='',
                category='',
                mrt='')
        ), rows))
    
    @MySQLModel.with_connection
    def get_unpaid_by_member_and_id(self, member_id: int, ids: List[int], cnx, cursor) -> List[Booking]:
        cursor = cnx.cursor(dictionary=True)
        query = (
            'SELECT'
            '    {booking}.id,'
            '    {booking}.member_id, '
            '    {booking}.starttime, '
            '    {booking}.endtime, '
            '    {booking}.price, '
            '    {booking}.has_paid, '
            '    tb.id AS attraction_id, '
            '    tb.name AS attraction_name, '
            '    tb.address AS attraction_address, '
            '    tb.images AS attraction_images '
            'FROM {booking} '
            'INNER JOIN ('
            '    SELECT '
            '        {attraction}.id AS id, '
            '        {attraction}.name AS name, '
            '        {attraction}.address AS address, '
            '        GROUP_CONCAT(DISTINCT {attraction_image}.url) AS images '
            '    FROM {attraction_image} '
            '    INNER JOIN {attraction} '
            '        ON {attraction_image}.attraction_id={attraction}.id '
            '    GROUP BY {attraction}.id'
            ') tb'
            '    ON {booking}.attraction_id=tb.id '
            'WHERE member_id = %s AND {booking}.id IN ({num_params}) AND has_paid = FALSE'
        ).format(
            booking=self.tablename,
            attraction=self.attraction_tablename,
            attraction_image=self.attraction_image_tablename,
            num_params=', '.join(['%s'] * len(ids))
        )
        cursor.execute(query, [member_id] + ids)
        rows = cursor.fetchall()
        return list(map(lambda row: Booking(
            id=row['id'],
            member_id=row['member_id'],
            starttime=row['starttime'],
            endtime=row['endtime'],
            price=row['price'],
            has_paid=bool(row['has_paid']),
            attraction=Attraction(
                id=row['attraction_id'],
                name=row['attraction_name'],
                address=row['attraction_address'],
                images=row['attraction_images'].split(','),
                description='',
                lat=0,
                lng=0,
                transport='',
                category='',
                mrt='')
        ), rows))
    
    @MySQLModel.with_connection
    def remove_by_id(self, member_id: int, id: int, cnx, cursor):
        query = 'DELETE FROM {} WHERE id = %s AND member_id = %s'.format(self.tablename)
        cursor.execute(query, (id, member_id, ))
        cnx.commit()

    @MySQLModel.with_connection
    def update_payment(self, member_id: int, ids: List[int], cnx, cursor):
        query = (
            'UPDATE {} '
            'SET has_paid = TRUE '
            'WHERE member_id = %s AND id IN ({num_params})'
        ).format(self.tablename, num_params=', '.join(['%s'] * len(ids)))
        cursor.execute(query, [member_id] + ids)
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
            '    id              bigint        NOT NULL     AUTO_INCREMENT,'
            '    member_id       bigint        NOT NULL,'
            '    attraction_id   bigint        NOT NULL,'
            '    starttime       DATETIME      NOT NULL,'
            '    endtime         DATETIME      NOT NULL,'
            '    price           int           NOT NULL,'
            '    has_paid        BOOLEAN       NOT NULL     DEFAULT FALSE,'
            '    PRIMARY KEY (id),'
            '    FOREIGN KEY (member_id) REFERENCES {member} (id),'
            '    FOREIGN KEY (attraction_id) REFERENCES {attraction} (id)'
            ');'
        ).format(booking=self.tablename,
                 member=self.member_tablename,
                 attraction=self.attraction_tablename)
