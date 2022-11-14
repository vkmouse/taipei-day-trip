import typing

List = typing.List

class Attraction:
    def __init__(self, id: int, name: str, description: str, address: str, lat: str, lng: str, transport: str, images: List[str], category_id: int, mrt_id: int):
        self.id = id
        self.name = name
        self.description = description
        self.address = address
        self.lat = lat
        self.lng = lng
        self.transport = transport
        self.images = images
        self.category_id = category_id
        self.mrt_id = mrt_id

class Category:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name

class MRT:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name
