from datetime import datetime
from datetime import timezone
from datetime import timedelta
from taipei_day_trip.models.cache import Cache


class MemoryCache(Cache):
    def __init__(self):
        self.__db = {}
        self.__exp = {}

    def get(self, key: any):
        now = datetime.now(tz=timezone.utc)
        try:
            if self.__exp[key] > now:
                return self.__db[key]
            else:
                return None
        except:
            return None

    def set(self, key: any, value: any, exp: int = 0):
        expires = datetime.now(tz=timezone.utc)
        expires += timedelta(seconds=int(exp))
        self.__db[key] = value
        self.__exp[key] = expires
