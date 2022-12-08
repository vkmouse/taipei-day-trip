from datetime import datetime
from datetime import timezone
from datetime import timedelta
from taipei_day_trip.utils.env import access_token_lifetime
from taipei_day_trip.utils.env import refresh_token_lifetime

def generate_access_token_exp() -> datetime:
    exp = datetime.now(tz=timezone.utc)
    exp += timedelta(seconds=int(access_token_lifetime))
    return exp

def generate_refresh_token_exp() -> datetime:
    exp = datetime.now(tz=timezone.utc)
    exp += timedelta(seconds=int(refresh_token_lifetime))
    return exp
