from taipei_day_trip.models.cache import Cache

class MemoryCache(Cache):
    def __init__(self):
        self.__db = {}

    def get(self, key: any):
        try:
            return self.__db[key]
        except:
            return None

    def set(self, key: any, value: any):
        self.__db[key] = value
