from taipei_day_trip.models.member_model import MemberModel
from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.types import Member

class MySQLMemberModel(MySQLModel, MemberModel):
    @MySQLModel.with_connection
    def add(self, name: str, email: str, password: str, cnx, cursor) -> bool:
        if self.__email_exists(email):
            return False
        query = 'INSERT INTO {} (name, email, password) VALUES (%s, %s, %s)'.format(self.tablename)
        data = (name, email, password)
        cursor.execute(query, data)
        cnx.commit()
        return True

    @MySQLModel.with_connection
    def get_by_id(self, id: int, cnx, cursor) -> Member | None:
        cursor = cnx.cursor(dictionary=True)
        query = 'SELECT * FROM {} WHERE id = (%s)'.format(self.tablename)
        cursor.execute(query, (id,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        return Member(id=rows[0]['id'],
                      name=rows[0]['name'],
                      email=rows[0]['email'],
                      password=rows[0]['password'])

    @MySQLModel.with_connection
    def get_by_email(self, email: str, cnx, cursor) -> Member | None:
        cursor = cnx.cursor(dictionary=True)
        query = 'SELECT * FROM {} WHERE email = (%s)'.format(self.tablename)
        cursor.execute(query, (email,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        return Member(id=rows[0]['id'],
                      name=rows[0]['name'],
                      email=rows[0]['email'],
                      password=rows[0]['password'])

    @MySQLModel.with_connection
    def __email_exists(self, __email: str, cnx, cursor) -> bool:
        query = 'SELECT COUNT(*) FROM {} WHERE name=%s'.format(self.tablename)
        data = (__email,)
        cursor.execute(query, data)
        (count,) = cursor.fetchone()
        return count > 0

    @property
    def tablename(self) -> str:
        if self.debug:
            return 'test_member'
        return 'member'

    @property
    def create_table_statement(self) -> str:
        return (
            'CREATE TABLE {} ('
            '    id              bigint        NOT NULL  AUTO_INCREMENT,'
            '    name            varchar(255)  NOT NULL,'
            '    email           varchar(255)  NOT NULL,'
            '    password        varchar(72)   NOT NULL,'
            '    PRIMARY KEY (id),'
            '    UNIQUE (email)'
            ');'
        ).format(self.tablename)
