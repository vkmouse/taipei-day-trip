from taipei_day_trip.models.types import List
from taipei_day_trip.models.types import Member


class MemberModel:
    def add(self, name: str, email: str, password: str) -> bool:
        """Return `False` on `email` not exists."""
        return NotImplemented

    def get_by_id(self, id: int) -> Member | None:
        """Return `None` on `id` not exists."""
        return NotImplemented

    def get_by_email(self, email: str) -> Member | None:
        """Return `None` on `email` not exists."""
        return NotImplemented
