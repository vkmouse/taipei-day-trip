import pytest

from taipei_day_trip.models import Attraction
from taipei_day_trip.models import MemoryDatabase


def test_import_from_json():
    attraction = Attraction(
        id=1,
        name="name",
        description="description",
        address="address",
        lat=50,
        lng=40,
        transport="transport",
        images=[
            "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11002891.jpg",
            "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/10784.jpg",
        ],
        category="category",
        mrt="mrt",
    )

    json_str = (
        "{"
        '  "result": {'
        '    "limit": 1000,'
        '    "offset": 0,'
        '    "count": 58,'
        '    "sort": "",'
        '    "results": ['
        "      {"
        '        "rate": 5,'
        '        "direction": "{transport}",'
        '        "name": "{name}",'
        '        "date": "2016/07/07",'
        '        "longitude": "{lng}",'
        '        "REF_WP": "10",'
        '        "avBegin": "2010/02/14",'
        '        "langinfo": "10",'
        '        "MRT": "{mrt}",'
        '        "SERIAL_NO": "123",'
        '        "RowNumber": "1",'
        '        "CAT": "{category}",'
        '        "MEMO_TIME": "123",'
        '        "POI": "Y",'
        '        "file": "{image1}{mp3}{image2}",'
        '        "idpt": "123",'
        '        "latitude": "{lat}",'
        '        "description": "{description}",'
        '        "_id": 1,'
        '        "avEnd": "2016/07/07",'
        '        "address": "{address}"'
        "      }"
        "    ]"
        "  }"
        "}"
    )
    json_str = json_str.replace("{name}", attraction.name)
    json_str = json_str.replace("{description}", attraction.description)
    json_str = json_str.replace("{address}", attraction.address)
    json_str = json_str.replace("{lat}", str(attraction.lat))
    json_str = json_str.replace("{lng}", str(attraction.lng))
    json_str = json_str.replace("{transport}", attraction.transport)
    json_str = json_str.replace("{image1}", attraction.images[0])
    json_str = json_str.replace("{image2}", attraction.images[1])
    json_str = json_str.replace("{category}", attraction.category)
    json_str = json_str.replace("{mrt}", attraction.mrt)
    json_str = json_str.replace("{mp3}", "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/10784.mp3")

    db = MemoryDatabase()
    db.import_from_json(json_str)

    assert len(db.categories.get_all()) == 1
    assert len(db.mrts.get_all()) == 1
    assert len(db.attractions.get_all()) == 1

    assert db.categories.get_all()[0].id == 1
    assert db.categories.get_all()[0].name == attraction.category
    assert db.mrts.get_all()[0].id == 1
    assert db.mrts.get_all()[0].name == attraction.mrt

    actual = db.attractions.get_all()[0]
    assert attraction.name == actual.name
    assert attraction.description == actual.description
    assert attraction.address == actual.address
    assert attraction.lat == actual.lat
    assert attraction.lng == actual.lng
    assert attraction.transport == actual.transport
    assert len(actual.images) == 2
    assert attraction.images[0] == actual.images[0]
    assert attraction.images[1] == actual.images[1]
    assert attraction.category == actual.category
    assert attraction.mrt == actual.mrt
