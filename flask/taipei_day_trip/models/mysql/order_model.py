from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.order_model import OrderModel
from taipei_day_trip.models.types import Attraction
from taipei_day_trip.models.types import Booking
from taipei_day_trip.models.types import Order
from taipei_day_trip.models.types import List

class MySQLOrderModel(MySQLModel, OrderModel):
    def __init__(self, 
                 cnxpool,
                 attraction_tablename: str,
                 attraction_image_tablename: str,
                 member_tablename: str,
                 booking_tablename: str,
                 debug: bool):
        self.attraction_tablename = attraction_tablename
        self.attraction_image_tablename = attraction_image_tablename
        self.member_tablename = member_tablename
        self.booking_tablename = booking_tablename
        MySQLModel.__init__(self, cnxpool, debug)
        self.order_info = MySQLOrderInfoModel(cnxpool, member_tablename, debug)
        self.order_detail = MySQLOrderDetailModel(cnxpool, self.order_info.tablename, booking_tablename, debug)

    def create_table(self):
        self.order_info.create_table()
        self.order_detail.create_table()

    @MySQLModel.with_connection
    def add(self,
            member_id: int,
            price: int,
            booking_ids: List[int],
            payment_status: int,
            contact_name: str,
            contact_email: str,
            contact_phone: str,
            cnx, cursor) -> int:
        order_id = self.order_info.add(
            member_id, price, payment_status, 
            contact_name, contact_email, contact_phone)
        self.order_detail.addList(order_id, booking_ids)
        return order_id

    @MySQLModel.with_connection
    def get_by_id(self, id: int, member_id: int, cnx, cursor) -> Order | None:
        cursor = cnx.cursor(dictionary=True)
        query = (
            'SELECT * '
            'FROM {order_info} '
            'INNER JOIN ( '
            '    SELECT '
            '        booking_tb.id AS booking_id, '
            '        booking_tb.starttime, '
            '        booking_tb.endtime, '
            '        booking_tb.price AS booking_price, '
            '        booking_tb.has_paid, '
            '        booking_tb.attraction_id, '
            '        booking_tb.attraction_name, '
            '        booking_tb.attraction_address, '
            '        booking_tb.attraction_image, '
            '        order_id '
            '    FROM {order_detail} '
            '    INNER JOIN ( '
            '        SELECT '
            '            {booking}.id, '
            '            {booking}.starttime, '
            '            {booking}.endtime, '
            '            {booking}.price, '
            '            {booking}.has_paid, '
            '            {booking}.attraction_id, '
            '            attraction_tb.name AS attraction_name, '
            '            attraction_tb.address AS attraction_address, '
            '            attraction_tb.image AS attraction_image '
            '        FROM {booking} '
            '        INNER JOIN ( '
            '            SELECT '
            '                id, '
            '                name, '
            '                address, '
            '                MIN(DISTINCT {attraction_image}.url) AS image '
            '            FROM {attraction} '
            '            INNER JOIN {attraction_image} '
            '                ON {attraction}.id={attraction_image}.attraction_id '
            '            GROUP BY {attraction}.id '
            '        ) attraction_tb '
            '            ON {booking}.attraction_id=attraction_tb.id '
            '        WHERE member_id=%s '
            '    ) booking_tb '
            '        ON {order_detail}.booking_id=booking_tb.id '
            ') order_detail_tb '
            '    ON id=order_detail_tb.order_id '
            'WHERE id=%s AND member_id=%s;'
        ).format(
            attraction = self.attraction_tablename,
            attraction_image = self.attraction_image_tablename,
            booking = self.booking_tablename,
            order_detail = self.order_detail.tablename,
            order_info = self.order_info.tablename)
        data = (member_id, id, member_id)
        cursor.execute(query, data)
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        order = Order(
            id=rows[0]['id'],
            member_id=rows[0]['member_id'],
            price=rows[0]['price'],
            payment_status=rows[0]['payment_status'],
            contact_name=rows[0]['contact_name'],
            contact_email=rows[0]['contact_email'],
            contact_phone=rows[0]['contact_phone'],
            created_at=rows[0]['created_at'],
            bookings=list(map(lambda row: Booking(
                id=row['booking_id'],
                member_id=row['member_id'],
                starttime=row['starttime'],
                endtime=row['endtime'],
                price=row['booking_price'],
                has_paid=row['has_paid'],
                attraction=Attraction(
                    id=row['attraction_id'],
                    name=row['attraction_name'],
                    address=row['attraction_address'],
                    images=[row['attraction_image']],
                    description='',
                    lat=0,
                    lng=0,
                    transport='',
                    category='',
                    mrt='')
                ), rows
            ))
        )
        
        return order

    @property
    def tablename(self) -> str:
        return ''

    @property
    def create_table_statement(self) -> str:
        return ''

    def drop_table_if_exists(self):
        self.order_detail.drop_table_if_exists()
        self.order_info.drop_table_if_exists()
        super().drop_table_if_exists()

class MySQLOrderInfoModel(MySQLModel):
    def __init__(self, cnxpool, member_tablename: str, debug: bool):
        self.member_tablename = member_tablename
        MySQLModel.__init__(self, cnxpool, debug)

    @MySQLModel.with_connection
    def add(self,
            member_id: int,
            price: int,
            payment_status: int,
            contact_name: str,
            contact_email: str,
            contact_phone: str,
            cnx, cursor) -> int:
        query = (
            'INSERT INTO {} ('
            '   member_id, '
            '   price, '
            '   payment_status, '
            '   contact_name, '
            '   contact_email, '
            '   contact_phone) '
            'VALUES (%s,%s,%s,%s,%s,%s)'
        ).format(self.tablename)
        data = (member_id, price, payment_status, contact_name, contact_email, contact_phone)
        cursor.execute(query, data)
        cnx.commit()
        return cursor.lastrowid

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_order_info'
        return 'order_info'

    @property
    def create_table_statement(self) -> str:
        return (
            'CREATE TABLE {order_info} ('
            '    id                 bigint          NOT NULL    AUTO_INCREMENT,'
            '    member_id          bigint          NOT NULL,'
            '    price              INT             NOT NULL,'
            '    payment_status     INT             NOT NULL,'
            '    contact_name       VARCHAR(255)    NOT NULL,'
            '    contact_email      VARCHAR(255)    NOT NULL,'
            '    contact_phone      VARCHAR(255)    NOT NULL,'
            '    created_at         DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP,'
            '    PRIMARY KEY (id),'
            '    FOREIGN KEY (member_id) REFERENCES {member} (id)'
            ');'
        ).format(order_info=self.tablename,
                 member=self.member_tablename)

class MySQLOrderDetailModel(MySQLModel):
    def __init__(self, cnxpool, order_tablename: str, booking_tablename: str, debug: bool):
        self.booking_tablename = booking_tablename
        self.order_tablename = order_tablename
        MySQLModel.__init__(self, cnxpool, debug)

    @MySQLModel.with_connection
    def addList(self, order_id: int, booking_ids: List[int], cnx, cursor):
        query = 'INSERT INTO {} (order_id, booking_id) VALUES (%s, %s)'.format(self.tablename)
        data = list(map(lambda booking_id: (order_id, booking_id), booking_ids))
        cursor.executemany(query, data)
        cnx.commit()

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_order_detail'
        return 'order_detail'

    @property
    def create_table_statement(self) -> str:
        return (    
            'CREATE TABLE {order_detail} ('
            '    order_id           bigint          NOT NULL,'
            '    booking_id         bigint          NOT NULL,'
            '    PRIMARY KEY (order_id,booking_id),'
            '    FOREIGN KEY (order_id) REFERENCES {order_info} (id),'
            '    FOREIGN KEY (booking_id) REFERENCES {booking} (id)'
            ');'    
        ).format(order_detail=self.tablename,
                 order_info=self.order_tablename,
                 booking=self.booking_tablename)
