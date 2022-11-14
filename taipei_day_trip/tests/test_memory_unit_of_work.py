import pytest

from taipei_day_trip.core import Attraction
from taipei_day_trip.repository import MemoryUnitOfWork

def test_import_from_json():
    attraction = Attraction(id = 1,
                            name = 'name',
                            description = 'description',
                            address = 'address',
                            lat = 50,
                            lng = 40,
                            transport = 'transport',
                            images = ['https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11002891.jpg',
                                      'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/10784.jpg'],
                            category = 'category',
                            mrt = 'mrt')

    jsonStr = (
        '{'
        '  "result": {'
        '    "limit": 1000,'
        '    "offset": 0,'
        '    "count": 58,'
        '    "sort": "",'
        '    "results": ['
        '      {'
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
        '      }'
        '    ]'
        '  }'
        '}')
    jsonStr = jsonStr.replace('{name}', attraction.name)
    jsonStr = jsonStr.replace('{description}', attraction.description)
    jsonStr = jsonStr.replace('{address}', attraction.address)
    jsonStr = jsonStr.replace('{lat}', str(attraction.lat))
    jsonStr = jsonStr.replace('{lng}', str(attraction.lng))
    jsonStr = jsonStr.replace('{transport}', attraction.transport)
    jsonStr = jsonStr.replace('{image1}', attraction.images[0])
    jsonStr = jsonStr.replace('{image2}', attraction.images[1])
    jsonStr = jsonStr.replace('{category}', attraction.category)
    jsonStr = jsonStr.replace('{mrt}', attraction.mrt)
    jsonStr = jsonStr.replace('{mp3}', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/10784.mp3')

    db = MemoryUnitOfWork()
    db.import_from_json(jsonStr)

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
