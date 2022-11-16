import typing

List = typing.List

class Attraction:
    def __init__(self, 
                 id: int, 
                 name: str, 
                 description: str, 
                 address: str, 
                 lat: float, 
                 lng: float, 
                 transport: str, 
                 images: List[str], 
                 category: str, 
                 mrt: str):
        self.id = id
        self.name = name
        self.description = description
        self.address = address
        self.lat = lat
        self.lng = lng
        self.transport = transport
        self.images = images
        self.category = category
        self.mrt = mrt

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'address': self.address,
            'transport': self.transport,
            'mrt': self.mrt,
            'lat': self.lat,
            'lng': self.lng,
            'images': self.images,
        }

class Category:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name

class MRT:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name
