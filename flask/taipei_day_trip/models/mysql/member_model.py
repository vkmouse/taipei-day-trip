from taipei_day_trip.models.member_model import MemberModel
from taipei_day_trip.models.mysql.mysql_model import MySQLModel
from taipei_day_trip.models.types import Member


class MySQLMemberModel(MySQLModel, MemberModel):
    @MySQLModel.with_connection
    def add(self, name: str, email: str, password: str, avatar_url: str, cnx, cursor) -> bool:
        query = (
            "INSERT INTO {member} ("
            "    name, "
            "    email, "
            "    password,"
            "    avatar_url) "
            "SELECT %s, %s, %s, %s "
            "FROM dual "
            "WHERE NOT EXISTS (SELECT * FROM {member} WHERE email = %s)"
        ).format(member=self.tablename)
        data = (name, email, password, avatar_url, email)
        cursor.execute(query, data)
        cnx.commit()
        return cursor.rowcount == 1

    @MySQLModel.with_connection
    def get_by_id(self, id: int, cnx, cursor) -> Member | None:
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT * FROM {} WHERE id = (%s)".format(self.tablename)
        cursor.execute(query, (id,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        return Member(
            id=rows[0]["id"],
            name=rows[0]["name"],
            email=rows[0]["email"],
            password=rows[0]["password"],
            avatar_url=rows[0]["avatar_url"],
        )

    @MySQLModel.with_connection
    def get_by_email(self, email: str, cnx, cursor) -> Member | None:
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT * FROM {} WHERE email = (%s)".format(self.tablename)
        cursor.execute(query, (email,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        return Member(
            id=rows[0]["id"],
            name=rows[0]["name"],
            email=rows[0]["email"],
            password=rows[0]["password"],
            avatar_url=rows[0]["avatar_url"],
        )

    @property
    def tablename(self) -> str:
        if self.debug:
            return "test_member"
        return "member"

    @property
    def create_table_statement(self) -> str:
        return (
            "CREATE TABLE {} ("
            "    id              bigint        NOT NULL  AUTO_INCREMENT,"
            "    name            varchar(255)  NOT NULL,"
            "    email           varchar(255)  NOT NULL,"
            "    password        varchar(72)   NOT NULL,"
            "    avatar_url      varchar(255)  NOT NULL,"
            "    PRIMARY KEY (id),"
            "    UNIQUE (email)"
            ");"
        ).format(self.tablename)
