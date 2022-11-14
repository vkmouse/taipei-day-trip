import typing

List = typing.List

class Attraction:
    def __init__(self, 
                 id: int, 
                 name: str, 
                 description: str, 
                 address: str, 
                 lat: str, 
                 lng: str, 
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

class Category:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name

class MRT:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name
