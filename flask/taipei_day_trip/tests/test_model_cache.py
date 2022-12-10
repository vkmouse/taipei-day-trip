from taipei_day_trip.models import Cache
from taipei_day_trip.models import MemoryCache

def cache_test_case(cache: Cache):
    assert cache.get('1') == None
    cache.set('1', 123, 10)
    assert cache.get('1') == 123
    cache.set('1', 456, 10)
    assert cache.get('1') == 456
    cache.set('1', None, 0)
    assert cache.get('1') == None

def test_memory_based_cache():
    cache = MemoryCache()
    cache_test_case(cache)
