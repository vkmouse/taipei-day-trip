import redis

from taipei_day_trip.models.cache import Cache
from taipei_day_trip.utils import redis_host
from taipei_day_trip.utils import redis_port

class RedisCache(Cache):
    def __init__(self):
        self.client = redis.Redis(host=redis_host, port=redis_port)

    def get(self, key):
        if self.client.exists(key):
            value = self.client.get(key).decode('utf-8')
            return value
        else:
            return None

    def set(self, key, value, exp: int = 0):
        if value == None:
            self.client.unlink(key)
        else:
            self.client.setex(key, exp, value)
