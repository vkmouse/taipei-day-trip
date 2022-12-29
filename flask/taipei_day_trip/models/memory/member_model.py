from taipei_day_trip.models.member_model import MemberModel
from taipei_day_trip.models.types import Member
from taipei_day_trip.models.types import List


class MemoryMemberModel(MemberModel):
    def __init__(self):
        self.__db: List[Member] = []
        self.__id: int = 0

    def add(self, name: str, email: str, password: str, avatar_url: str) -> bool:
        if self.email_exists(email):
            return False
        element = Member(self.__next_id, name, email, password, avatar_url)
        self.__db.append(element)
        return True

    def get_by_id(self, id: int) -> Member | None:
        output = list(filter(lambda i: i.id == id, self.__db))
        if len(output) == 0:
            return None
        return output[0]

    def get_by_email(self, email: str) -> Member | None:
        output = list(filter(lambda i: i.email == email, self.__db))
        if len(output) == 0:
            return None
        return output[0]

    def email_exists(self, email: str) -> bool:
        return len(list(filter(lambda i: i.email == email, self.__db))) > 0

    @property
    def __next_id(self):
        self.__id += 1
        return self.__id
